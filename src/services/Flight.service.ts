import type { Flight } from "../types/Flight.interface";

const FLIGHT_API_URL = 'https://failbondi.fail/api/dump';
const CACHE_DURATION_RECENT = 5 * 60 * 1000; // 5 minutos para fechas recientes
const CACHE_DURATION_OLD = 24 * 60 * 60 * 1000; // 24 horas para fechas pasadas

// Estructura del caché
interface CacheEntry {
    data: Flight[];
    timestamp: number;
    date: string; // fecha en formato YYYY-MM-DD
}

// Caché en memoria (se pierde al refrescar la página)
const flightCache = new Map<string, CacheEntry>();

// Variable para evitar descargas duplicadas simultáneas
const ongoingFetches = new Map<string, Promise<Flight[]>>();

export const getFlights = async (searchDate: Date): Promise<Flight[]> => {
    const searchDateStr = formatDateToYYYYMMDD(searchDate);
    
    // 1. Verificar si tenemos datos en caché y si aún son válidos
    const cached = flightCache.get(searchDateStr);
    const now = Date.now();
    
    if (cached) {
        const cacheDuration = getCacheDuration(searchDate);
        const cacheAge = now - cached.timestamp;
        
        if (cacheAge < cacheDuration) {
            console.log(`✅ Usando caché para ${searchDateStr} (${Math.round(cacheAge / 1000)}s antiguos)`);
            
            // Pre-cargar fechas cercanas en background (sin esperar)
            preloadNearbyDates(searchDate);
            
            return cached.data;
        }
    }
    
    // 2. Si no hay caché o expiró, hacer fetch (pero evitar duplicados)
    const result = await fetchFlightsWithDeduplication(searchDateStr);
    
    // Pre-cargar fechas cercanas en background (sin esperar)
    preloadNearbyDates(searchDate);
    
    return result;
};

// Función interna que maneja el fetch real con deduplicación
const fetchFlightsWithDeduplication = async (searchDateStr: string): Promise<Flight[]> => {
    // Si ya hay un fetch en curso para esta fecha, retornar esa promesa
    if (ongoingFetches.has(searchDateStr)) {
        console.log(`⏳ Esperando fetch en curso para ${searchDateStr}...`);
        return ongoingFetches.get(searchDateStr)!;
    }
    
    // Crear nueva promesa de fetch
    const fetchPromise = (async () => {
        console.log(`🌐 Descargando datos para ${searchDateStr}...`);
        
        try {
            const response = await fetch(FLIGHT_API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const allFlights: Flight[] = await response.json();
            
            // Filtrar vuelos por fecha y que sean de Flybondi (FO)
            const filteredFlights = allFlights.filter(flight => {
                // Verificar que sea de Flybondi
                const isFlybondi = flight.json.nro.startsWith('FO ');
                
                // Verificar que sea de la fecha buscada
                const isCorrectDate = flight.json.x_date === searchDateStr;
                
                // Solo incluir vuelos de salida (despegue)
                const isDeparture = flight.json.mov === 'D';
                
                // Validaciones adicionales para evitar vuelos fantasma
                const hasValidData = flight.json.stda && flight.json.arpt && flight.json.IATAdestorig;
                
                // Filtrar vuelos que tienen delta absurdo (más de 24 horas = 86400 segundos)
                const hasReasonableDelta = flight.delta === null || Math.abs(flight.delta) < 86400;
                
                // VALIDACIÓN: Incluir vuelos verificables
                // Incluir vuelos que:
                // 1. Despegaron (tienen atda y delta), O
                // 2. Están EXPLÍCITAMENTE cancelados (marcados como "cancel" en estes)
                const hasDeparted = flight.atda !== null && flight.delta !== null;
                const isExplicitlyCancelled = flight.json.estes?.toLowerCase().includes('cancel');
                
                return isFlybondi && 
                       isCorrectDate && 
                       isDeparture && 
                       hasValidData && 
                       hasReasonableDelta && 
                       (hasDeparted || isExplicitlyCancelled);
            });
            
            // Convertir delta de segundos a minutos y deduplicar
            const flightMap = new Map<string, Flight>();
            
            filteredFlights.forEach(flight => {
                const key = `${flight.json.nro}-${flight.json.x_date}`;
                
                // Convertir delta de segundos a minutos
                const processedFlight = {
                    ...flight,
                    delta: flight.delta !== null ? Math.round(flight.delta / 60) : null
                };
                
                // Si ya existe, mantener el que tenga información más reciente
                if (!flightMap.has(key) || 
                    (processedFlight.last_updated > flightMap.get(key)!.last_updated)) {
                    flightMap.set(key, processedFlight);
                }
            });
            
            const processedFlights = Array.from(flightMap.values());
            
            // Guardar en caché
            flightCache.set(searchDateStr, {
                data: processedFlights,
                timestamp: Date.now(),
                date: searchDateStr
            });
            
            console.log(`💾 Datos guardados en caché (${processedFlights.length} vuelos)`);
            
            return processedFlights;
        } finally {
            // Limpiar el registro de fetch en curso
            ongoingFetches.delete(searchDateStr);
        }
    })();
    
    // Registrar el fetch en curso
    ongoingFetches.set(searchDateStr, fetchPromise);
    
    return fetchPromise;
};

// Pre-cargar fechas cercanas en background
const preloadNearbyDates = (currentDate: Date): void => {
    // Pre-cargar ayer y mañana si no están en caché
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const yesterdayStr = formatDateToYYYYMMDD(yesterday);
    const tomorrowStr = formatDateToYYYYMMDD(tomorrow);
    
    // Pre-cargar ayer (sin esperar)
    if (!flightCache.has(yesterdayStr) && !ongoingFetches.has(yesterdayStr)) {
        console.log(`📅 Pre-cargando fecha anterior: ${yesterdayStr}`);
        fetchFlightsWithDeduplication(yesterdayStr).catch(err => {
            console.warn(`⚠️ Error pre-cargando ${yesterdayStr}:`, err);
        });
    }
    
    // Pre-cargar mañana (sin esperar)
    if (!flightCache.has(tomorrowStr) && !ongoingFetches.has(tomorrowStr)) {
        console.log(`📅 Pre-cargando fecha siguiente: ${tomorrowStr}`);
        fetchFlightsWithDeduplication(tomorrowStr).catch(err => {
            console.warn(`⚠️ Error pre-cargando ${tomorrowStr}:`, err);
        });
    }
};

// Determinar duración del caché según qué tan vieja es la fecha
const getCacheDuration = (date: Date): number => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    const daysDiff = Math.floor((todayStart.getTime() - dateStart.getTime()) / (1000 * 60 * 60 * 24));
    
    // Fechas de hace 2+ días: caché de 24 horas (no cambian)
    if (daysDiff >= 2) {
        return CACHE_DURATION_OLD;
    }
    
    // Fechas recientes (hoy, ayer, mañana): caché de 5 minutos
    return CACHE_DURATION_RECENT;
};

// Función para limpiar caché manualmente (útil para botón de "refrescar")
export const clearCache = (): void => {
    flightCache.clear();
    ongoingFetches.clear();
    console.log('🗑️ Caché limpiado');
};

// Función para obtener info del caché (útil para debugging)
export const getCacheInfo = (): { date: string; age: number; flights: number }[] => {
    const now = Date.now();
    return Array.from(flightCache.entries()).map(([date, entry]) => ({
        date,
        age: Math.round((now - entry.timestamp) / 1000), // segundos
        flights: entry.data.length
    }));
};

// Función auxiliar para formatear fecha
const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
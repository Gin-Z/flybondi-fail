import type { Flight } from "../types/Flight.interface";

const FLIGHT_API_URL = '/data/flights.json';

export const getFlights = async (searchDate: Date): Promise<Flight[]> => {
    try {
        const response = await fetch(FLIGHT_API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const allFlights: Flight[] = await response.json();
        
        // Formatear la fecha de búsqueda a YYYY-MM-DD
        const searchDateStr = formatDateToYYYYMMDD(searchDate);
        
        // Filtrar vuelos por fecha
        const filteredFlights = allFlights.filter(
            flight => flight.fecha === searchDateStr
        );
        
        return filteredFlights;
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
};

// Función auxiliar para formatear fecha
const formatDateToYYYYMMDD = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
import { useState } from "react";
import { useFlights } from "../context/FlightsContext";
import type { Flight } from "../types/Flight.interface";

const WastedTime = () => {
    const { flights, loading } = useFlights();
    const [showModal, setShowModal] = useState(false);

    // Asientos por tipo de avión de Flybondi
    const AIRPLANE_SEATS: Record<string, number> = {
        'B738': 189, // Boeing 737-800
        'default': 189 // Asumimos Boeing 737-800 por defecto
    };
    
    const OCCUPANCY_RATE = 0.75; // 75% de ocupación

    // Función para calcular la demora en minutos
    const calculateDelay = (flight: Flight): number | null => {
        if (!flight.atda) return null; // Cancelado
        return flight.delta;
    };

    // Calcular tiempo total desperdiciado
    const calculateWastedTime = (): { years: number; months: number; days: number } => {
        let totalMinutes = 0;

        flights.forEach(flight => {
            const delay = calculateDelay(flight);
            
            // Solo incluir vuelos que despegaron con retraso
            if (delay !== null && delay > 0) {
                // Obtener cantidad de asientos (usar default si no está especificado)
                const seats = AIRPLANE_SEATS['default'];
                
                // Calcular minutos-persona desperdiciados
                const wastedMinutes = delay * seats * OCCUPANCY_RATE;
                totalMinutes += wastedMinutes;
            }
        });

        // Convertir minutos totales a años, meses y días
        const totalDays = Math.floor(totalMinutes / (60 * 24));
        
        const years = Math.floor(totalDays / 365);
        const remainingDays = totalDays % 365;
        const months = Math.floor(remainingDays / 30);
        const days = remainingDays % 30;

        return { years, months, days };
    };

    if (loading) {
        return (
            <div className="card p-3">
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
                    <div className="spinner-border spinner-border-sm" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        );
    }

    const { years, months, days } = calculateWastedTime();

    // Formatear el texto mostrando años, meses y días
    const formatTimeWasted = (): string => {
        const parts: string[] = [];
        
        if (years > 0) {
            parts.push(`${years} ${years === 1 ? 'año' : 'años'}`);
        }
        
        if (months > 0) {
            parts.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
        }
        
        if (days > 0) {
            parts.push(`${days} ${days === 1 ? 'día' : 'días'}`);
        }
        
        // Si no hay ningún tiempo, mostrar 0 días
        if (parts.length === 0) {
            return '0 días';
        }
        
        return parts.join(' ');
    };

    return (
        <>
            <div className="card p-3 text-center">
                <div className="d-flex justify-content-center align-items-center">
                    <div className="card-body">
                        <p className="card-text">
                            En total, Flybondi desperdició aproximadamente{' '}
                            <strong>{formatTimeWasted()}</strong>
                            {' '}de vida entre todos sus pasajeros.
                        </p>
                    </div>
                    <button 
                        type="button" 
                        className="btn"
                        onClick={() => setShowModal(true)}
                    >
                        <i className="bi bi-lightbulb"></i>
                    </button>
                </div>
            </div>

           
        </>
    );
};

export default WastedTime;
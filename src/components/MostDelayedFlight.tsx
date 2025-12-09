import { useFlights } from "../context/FlightsContext";
import type { Flight } from "../types/Flight.interface";

const MostDelayedFlight = () => {
    const { flights, loading } = useFlights();

    // Función para calcular la demora en minutos
    const calculateDelay = (flight: Flight): number | null => {
        if (!flight.despegue_real) return null; // Cancelado

        const [estimatedHours, estimatedMinutes] = flight.despegue_estimado.split(':').map(Number);
        const [realHours, realMinutes] = flight.despegue_real.split(':').map(Number);

        const estimatedTotalMinutes = estimatedHours * 60 + estimatedMinutes;
        let realTotalMinutes = realHours * 60 + realMinutes;

        // Si el vuelo real es mucho menor que el estimado, probablemente cruzó medianoche
        if (realTotalMinutes < estimatedTotalMinutes - 12 * 60) {
            realTotalMinutes += 24 * 60; // Sumar 24 horas al tiempo real
        }

        return realTotalMinutes - estimatedTotalMinutes;
    };

    // Formatear el tiempo de demora
    const formatDelay = (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes}min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return mins > 0 ? `${hours}hs ${mins}min` : `${hours}hs`;
    };

    // Encontrar el vuelo con mayor retraso
    const getMostDelayedFlight = (): { flight: Flight; delay: number } | null => {
        let maxDelay = 0;
        let mostDelayed: Flight | null = null;

        flights.forEach(flight => {
            const delay = calculateDelay(flight);
            if (delay !== null && delay > maxDelay) {
                maxDelay = delay;
                mostDelayed = flight;
            }
        });

        if (!mostDelayed) return null;
     
        return { flight: mostDelayed, delay: maxDelay };
    };

    if (loading) {
        return (
            <div className="card p-3 text-center">
                <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    const result = getMostDelayedFlight();

    if (!result) {
        return (
            <div className="card p-3 text-center">
                <div className="card-body">
                    <p className="card-text">
                        No hay vuelos con retraso registrado.
                    </p>
                </div>
            </div>
        );
    }

    const { flight, delay } = result;
    const ruta = flight.ruta.replace('→', 'a');

    return (
        <div className="card p-3 text-center">
            <div className="card-body">
                <p className="card-text">
                    El vuelo más atrasado fue el {flight.vuelo} de {ruta}, que salió{' '}
                    <strong className="text-danger">{formatDelay(delay)} tarde</strong>. ¡Qué mal!
                </p>
            </div>
        </div>
    );
};

export default MostDelayedFlight;
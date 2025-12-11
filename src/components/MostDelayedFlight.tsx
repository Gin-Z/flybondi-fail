import { useFlights } from "../context/FlightsContext";
import type { Flight } from "../types/Flight.interface";
import { getAirportName } from "../utils/airportNames";

const MostDelayedFlight = () => {
    const { flights, loading } = useFlights();

    // Función para calcular la demora en minutos
    const calculateDelay = (flight: Flight): number | null => {
        if (!flight.atda) return null; // Cancelado
        return flight.delta;
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
    const origen = getAirportName(flight.json.arpt);
    const destino = getAirportName(flight.json.destorig);
    const ruta = `${origen} a ${destino}`;

    return (
        <div className="card p-3 text-center">
            <div className="card-body">
                <p className="card-text">
                    El vuelo más atrasado fue el {flight.json.nro} de {ruta}, que salió{' '}
                    <strong className="text-danger">{formatDelay(delay)} tarde</strong>. ¡Qué mal!
                </p>
            </div>
        </div>
    );
};

export default MostDelayedFlight;

// src/components/Info.tsx
import { useFlights } from "../context/FlightsContext";
import type { Flight } from "../types/Flight.interface";
import { getAirportName } from "../utils/airportNames";

const Info = () => {
    const { flights, loading } = useFlights();

    // Función para calcular la demora en minutos
    const calculateDelay = (flight: Flight): number | null => {
        if (!flight.atda) return null; // Cancelado
        return flight.delta;
    };

    // Formatear el tiempo de demora
    const formatDelay = (minutes: number): string => {
        const absMinutes = Math.abs(minutes);
        if (absMinutes < 60) {
            return `${absMinutes}min`;
        }
        const hours = Math.floor(absMinutes / 60);
        const mins = absMinutes % 60;
        return mins > 0 ? `${hours}hs ${mins}min` : `${hours}hs`;
    };

    // Obtener la clase CSS según la demora
    const getDelayClass = (delay: number | null): string => {
        if (delay === null) return "status-cancelled";
        if (delay > 45) return "status-45plus";
        if (delay >= 30) return "status-45_30";
        if (delay >= 15) return "status-30_15";
        return "status-15_0";
    };

    // Función para formatear la ruta con nombres completos
    const getRoute = (flight: Flight): string => {
        const origen = getAirportName(flight.json.arpt);
        const destino = getAirportName(flight.json.IATAdestorig);
        return `${origen} → ${destino}`;
    };

    // Ordenar vuelos: cancelados primero, luego por demora (mayor a menor)
    const sortedFlights = [...flights].sort((a, b) => {
        const delayA = calculateDelay(a);
        const delayB = calculateDelay(b);

        // Cancelados primero
        if (delayA === null && delayB === null) return 0;
        if (delayA === null) return -1;
        if (delayB === null) return 1;

        // Ordenar por demora de mayor a menor
        return delayB - delayA;
    });

    if (loading) {
        return (
            <div className="card p-3 text-center">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    if (flights.length === 0) {
        return (
            <div className="card p-3 text-center">
                <p className="card-text">No hay vuelos para esta fecha.</p>
            </div>
        );
    }

    return (
        <div className="card p-3 text-center">
            <h5 className="card-title mb-3">Detalles de todos los vuelos</h5>
            <div className="table-responsive">
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Vuelo</th>
                            <th scope="col">Ruta</th>
                            <th scope="col">Hora programada</th>
                            <th scope="col">Hora real</th>
                            <th scope="col">
                                Demora en despegar
                                <i className="bi bi-arrow-down ms-1"></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFlights.map((flight, index) => {
                            const delay = calculateDelay(flight);
                            const isCancelled = delay === null;
                            const delayClass = getDelayClass(delay);
                            
                            return (
                                <tr key={`${flight.aerolineas_flight_id}-${index}`}>
                                    <td>{flight.json.nro}</td>
                                    <td>{getRoute(flight)}</td>
                                    <td>{flight.json.stda}</td>
                                    <td>{flight.json.atda || '-'}</td>
                                    <td>
                                        {isCancelled ? (
                                            <strong className={delayClass}>Cancelado</strong>
                                        ) : delay! > 0 ? (
                                            <strong className={delayClass}>
                                                {formatDelay(delay!)} tarde
                                            </strong>
                                        ) : delay! < 0 ? (
                                            <strong className="text-success">
                                                Adelantado {formatDelay(delay!)}
                                            </strong>
                                        ) : (
                                            <strong className={delayClass}>A tiempo</strong>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Info;

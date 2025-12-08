import { useFlights } from "../context/FlightsContext";
import type { Flight } from "../types/Flight.interface";

const Flights = () => {
    const { flights, loading } = useFlights();

    // Función para calcular la demora en minutos
    const calculateDelay = (flight: Flight): number | null => {
        if (!flight.despegue_real) return null; // Cancelado

        const [estimatedHours, estimatedMinutes] = flight.despegue_estimado.split(':').map(Number);
        const [realHours, realMinutes] = flight.despegue_real.split(':').map(Number);

        const estimatedTotalMinutes = estimatedHours * 60 + estimatedMinutes;
        let realTotalMinutes = realHours * 60 + realMinutes;

        // Si el vuelo real es mucho menor que el estimado, probablemente cruzó medianoche
        // (ej: programado 23:30, despegó 01:30 del día siguiente)
        if (realTotalMinutes < estimatedTotalMinutes - 12 * 60) {
            realTotalMinutes += 24 * 60; // Sumar 24 horas al tiempo real
        }

        return realTotalMinutes - estimatedTotalMinutes;
    };

    // Función para obtener la clase CSS según la demora
    const getStatusClass = (flight: Flight): string => {
        const delay = calculateDelay(flight);

        if (delay === null) return "status-cancelled"; // Cancelado
        if (delay > 45) return "status-45plus";
        if (delay >= 30) return "status-45_30";
        if (delay >= 15) return "status-30_15";
        return "status-15_0";
    };

    // Ordenar vuelos por categoría de demora
    const sortedFlights = [...flights].sort((a, b) => {
        const delayA = calculateDelay(a);
        const delayB = calculateDelay(b);

        // Función auxiliar para obtener prioridad (menor = primero)
        const getPriority = (delay: number | null): number => {
            if (delay === null) return 0; // Cancelados primero
            if (delay > 45) return 1;      // Más de 45 min
            if (delay >= 30) return 2;     // 30-45 min
            if (delay >= 15) return 3;     // 15-30 min
            return 4;                      // Menos de 15 min
        };

        const priorityA = getPriority(delayA);
        const priorityB = getPriority(delayB);

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // Si tienen la misma prioridad, ordenar por demora (de mayor a menor)
        if (delayA === null && delayB === null) return 0;
        if (delayA === null) return -1;
        if (delayB === null) return 1;
        return delayB - delayA;
    });

    // Calcular estadísticas
    const totalFlights = flights.length;
    const cancelledFlights = flights.filter(f => !f.despegue_real).length;
    const delayedOver45 = flights.filter(f => {
        const delay = calculateDelay(f);
        return delay !== null && delay > 45;
    }).length;

    // Dividir vuelos en filas de 9
    const flightsPerRow = 9;
    const rows: Flight[][] = [];
    for (let i = 0; i < sortedFlights.length; i += flightsPerRow) {
        rows.push(sortedFlights.slice(i, i + flightsPerRow));
    }

    if (loading) {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (flights.length === 0) {
        return (
            <div className="card">
                <div className="card-body text-center">
                    <p className="card-text">No hay vuelos para esta fecha.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="container text-center flights-grid">
                {rows.map((row, rowIndex) => (
                    <div className="row" key={rowIndex}>
                        {row.map((flight, colIndex) => (
                            <div className="col" key={`${rowIndex}-${colIndex}`}>
                                <i 
                                    className={`bi bi-airplane-fill ${getStatusClass(flight)}`}
                                />
                            </div>
                        ))}
                        {/* Rellenar espacios vacíos si la última fila no está completa */}
                        {rowIndex === rows.length - 1 && 
                         row.length < flightsPerRow && 
                         Array.from({ length: flightsPerRow - row.length }).map((_, i) => (
                            <div className="col" key={`empty-${i}`}></div>
                         ))
                        }
                    </div>
                ))}
            </div>
            <div className="card-body">
                <p className="card-text text-center fw-bold">
                    De {totalFlights} vuelos, {delayedOver45} tardaron más de 45 minutos en despegar y {cancelledFlights} vuelos fueron cancelados.
                </p>
            </div>
            <div className="container text-center">
                <div className="row">
                    <div className="col">
                        <i className="bi bi-airplane-fill status-cancelled" /> 
                        <p className="card-text">Cancelado</p>
                    </div>
                    <div className="col">
                        <i className="bi bi-airplane-fill status-45plus" /> 
                        <p className="card-text">Más de 45 min</p>
                    </div>
                    <div className="col">
                        <i className="bi bi-airplane-fill status-45_30" /> 
                        <p className="card-text">45-30 min</p>
                    </div>
                    <div className="col">
                        <i className="bi bi-airplane-fill status-30_15" /> 
                        <p className="card-text">30-15 min</p>
                    </div>
                    <div className="col">
                        <i className="bi bi-airplane-fill status-15_0" /> 
                        <p className="card-text">15-0 min</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Flights;
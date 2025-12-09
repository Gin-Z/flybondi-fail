import { useState } from "react";
import { useFlights } from "../context/FlightsContext";
import type { Flight } from "../types/Flight.interface";
import { MeanModal } from "./MeanModal";

const Mean = () => {
  const { flights, loading } = useFlights();
  const [showModal, setShowModal] = useState(false);

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

  // Calcular promedio de demoras (solo vuelos que despegaron)
  const flightsWithDelay = flights
    .map(f => calculateDelay(f))
    .filter((delay): delay is number => delay !== null);

  const totalFlights = flightsWithDelay.length;
  const averageDelayMinutes = totalFlights > 0
    ? Math.round(flightsWithDelay.reduce((sum, delay) => sum + delay, 0) / totalFlights)
    : 0;

  // Configuración del gráfico
  const totalWidth = 500;
  const barHeight = 25;
  const barBgWidth = 440;
  const maxMinutes = 180; // 3 horas = 180 minutos

  // Calcular el ancho de la barra según el promedio
  // Si averageDelayMinutes > 180, la barra será del ancho máximo
  const barWidth = Math.min((averageDelayMinutes / maxMinutes) * barBgWidth, barBgWidth);

  // Formatear el tiempo de demora
  const formatDelay = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
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

  if (totalFlights === 0) {
    return (
      <div className="card p-3 text-center">
        <h5 className="m-0">No hay datos de vuelos</h5>
      </div>
    );
  }

  return (
    <>
      <div className="card p-3 text-center">
        <div className="d-flex justify-content-center align-items-center">
          <h5 className="m-0 px-2">Promedio de retraso en el despegue.</h5>
          <button 
            type="button" 
            className="btn"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-lightbulb"></i>
          </button>
        </div>
        <svg
          viewBox={`0 0 ${totalWidth} 150`}
          width="100%"
          height="150"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block", margin: "0 auto" }}
        >
          {/* Texto */}
          <text
            x="50%"
            y="25"
            textAnchor="middle"
            fontSize="22"
            fontWeight="600"
          >
            Flybondi
            <tspan opacity="0.6" fontSize="20" fontWeight="400">
              {" "}{totalFlights} vuelos
            </tspan>
          </text>

          {/* Barra fondo */}
          <rect
            x={(totalWidth - barBgWidth) / 2}
            y="45"
            width={barBgWidth}
            height={barHeight}
            fill="#eee"
            rx="5"
          />

          {/* Barra amarilla */}
          <rect
            x={(totalWidth - barBgWidth) / 2}
            y="45"
            width={barWidth}
            height={barHeight}
            fill="#EDD200"
            rx="5"
          />

          {/* Label valor */}
          <text
            x="50%"
            y="95"
            textAnchor="middle"
            fontSize="20"
          >
            {formatDelay(averageDelayMinutes)}
          </text>

          {/* Ticks */}
          <g
            transform={`translate(${(totalWidth - barBgWidth) / 2}, 120)`}
            fontSize="18"
            opacity="0.7"
          >
            <text x="0" y="15">0hs</text>
            <text x={barBgWidth / 3} y="15">1hs</text>
            <text x={(barBgWidth / 3) * 2} y="15">2hs</text>
            <text x={barBgWidth} y="15" textAnchor="end">3hs</text>
          </g>
        </svg>
      </div>
      
      <MeanModal show={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};

export default Mean;

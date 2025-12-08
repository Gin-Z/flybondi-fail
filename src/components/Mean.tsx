const Mean =() =>{
   const totalWidth = 500;       // ancho ideal del gráfico
  const barHeight = 25;
  const barBgWidth = 440;
  const barWidth = 45.5;        // barra de 18min aprox

  return (
    <div className="card p-3 text-center">
      <div className="d-flex justify-content-center align-items-center">
        <h5 className="m-0 px-2">Promedio de retraso en el despegue.</h5>
        <button type="button" className="btn">
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
            {" "}36 vuelos
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
          18 min
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
  );
}
export default Mean;
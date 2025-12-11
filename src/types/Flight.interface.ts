export interface Flight {
    aerolineas_flight_id: string;
    last_updated: string;
    json: {
        id: string;
        mov: string; // "A" = Arribo, "D" = Despegue
        nro: string; // Código de vuelo (ej: "FO 5100")
        arpt: string; // Aeropuerto origen/destino según mov
        IATAdestorig: string; // Código IATA del otro aeropuerto
        destorig: string; // Nombre del otro aeropuerto
        stda: string; // Fecha/hora programada (formato: "DD/MM HH:mm")
        atda: string | null; // Fecha/hora real (formato: "DD/MM HH:mm")
        estes: string; // Estado en español
        aerolinea: string; // Nombre de la aerolínea
        x_date: string; // Fecha del vuelo (formato: "YYYY-MM-DD")
    };
    stda: string; // ISO timestamp programado
    atda: string | null; // ISO timestamp real
    delta: number | null; // Diferencia en minutos
}

export interface Flight {
    vuelo: string,
    fecha: string,
    ruta: string,
    despegue_estimado: string,
    despegue_real: string | null
}
export interface Flight {
    id: string,
    fecha: string,
    ruta: string,
    despegue_estimado: string,
    despegue_real: string | null
}
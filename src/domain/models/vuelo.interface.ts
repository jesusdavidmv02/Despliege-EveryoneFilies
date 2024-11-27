export interface Vuelo {
    id_vuelo: number;
    cod_vuelo?: number;
    aerolinea?: string;
    origen_aeropuerto?: string;
    destino_aeropuerto?: string;
    fecha_salida?: Date;
    fecha_llegada?: Date;
    duracion?: number;
    total_asientos?: number;
    asientos_disponibles?: number;
    estado_vuelo?: string;
    precio_base_vuelo?: number;
}
  
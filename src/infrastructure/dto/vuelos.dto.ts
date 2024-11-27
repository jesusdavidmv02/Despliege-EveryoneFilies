import { validate, IsString, IsInt, IsDate, IsOptional } from "class-validator";

export class CreateVueloDto {
    @IsString()
    cod_vuelo: string;

    @IsString()
    aerolinea: string;

    @IsString()
    origen_aeropuerto: string;

    @IsString()
    destino_aeropuerto: string;

    @IsDate()
    fecha_salida: Date;

    @IsDate()
    fecha_llegada: Date;

    @IsInt()
    duracion: number;

    @IsInt()
    total_asientos: number;

    @IsInt()
    @IsOptional()
    asientos_disponibles?: number;

    @IsString()
    @IsOptional()
    estado_vuelo?: string;

    constructor(body: {
        cod_vuelo: string;
        aerolinea: string;
        origen_aeropuerto: string;
        destino_aeropuerto: string;
        fecha_salida: Date;
        fecha_llegada: Date;
        duracion: number;
        total_asientos: number;
        asientos_disponibles?: number;
        estado_vuelo?: string;
    }) {
        this.cod_vuelo = body?.cod_vuelo;
        this.aerolinea = body?.aerolinea;
        this.origen_aeropuerto = body?.origen_aeropuerto;
        this.destino_aeropuerto = body?.destino_aeropuerto;
        this.fecha_salida = body?.fecha_salida;
        this.fecha_llegada = body?.fecha_llegada;
        this.duracion = body?.duracion;
        this.total_asientos = body?.total_asientos;
        this.asientos_disponibles = body?.asientos_disponibles;
        this.estado_vuelo = body?.estado_vuelo;
    }

    async validateDto() {
        // Retorna un array de errores. Si no hay errores, el array estará vacío.
        return await validate(this, {
            validationError: { target: false, value: false },
        });
    }
}

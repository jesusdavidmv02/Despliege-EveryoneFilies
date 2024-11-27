import { validate, IsString, IsInt, IsOptional, IsDate } from "class-validator";

export class CreateReservaDto {
    @IsString()
    cod_vuelo: string;

    @IsDate()
    @IsOptional()
    fecha_reserva?: Date;

    @IsString()
    @IsOptional()
    estado_reserva?: string;

    @IsInt()
    @IsOptional()
    cantidad_pasajeros?: number;

    constructor(body: {
        cod_vuelo: string;
        fecha_reserva?: Date;
        estado_reserva?: string;
        cantidad_pasajeros?: number;
    }) {
        this.cod_vuelo = body?.cod_vuelo;
        this.fecha_reserva = body?.fecha_reserva;
        this.estado_reserva = body?.estado_reserva;
        this.cantidad_pasajeros = body?.cantidad_pasajeros;
    }

    async validateDto() {
        // Retorna un array de errores. Si no hay errores, el array estará vacío.
        return await validate(this, {
            validationError: { target: false, value: false },
        });
    }
}

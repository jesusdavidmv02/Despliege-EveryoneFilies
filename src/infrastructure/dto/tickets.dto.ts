import { validate, IsString, IsInt, IsDate, IsOptional, IsEnum } from "class-validator";

export class CreateTicketsDto {
    @IsInt()
    id_reserva: number;

    @IsString()
    cod_vuelo: string;

    @IsInt()
    id_pasajero: number;

    @IsDate()
    @IsOptional()
    fecha_emision?: Date;

    @IsEnum(["emitido", "check-in", "abordado", "finalizado", "cancelado"])
    @IsOptional()
    estado_ticket?: string;

    constructor(body: {
        id_reserva: number;
        cod_vuelo: string;
        id_pasajero: number;
        fecha_emision?: Date;
        estado_ticket?: string;
    }) {
        this.id_reserva = body?.id_reserva;
        this.cod_vuelo = body?.cod_vuelo;
        this.id_pasajero = body?.id_pasajero;
        this.fecha_emision = body?.fecha_emision;
        this.estado_ticket = body?.estado_ticket;
    }

    async validateDto() {
        // Retorna un array de errores. Si no hay errores, el array estará vacío.
        return await validate(this, {
            validationError: { target: false, value: false },
        });
    }
}

import { validate, IsInt } from "class-validator";
import { PasajeroEntity } from "../entities/pasajero.entity";

export class pasajeroReservaDto {

    @IsInt()
    id_reserva: number


    @IsInt()
    id_asiento: number

    @IsInt()    
    pasajero?: PasajeroEntity;

    constructor(body: {
        id_reserva: number;
        id_asiento: number;
    },) {
        this.id_reserva = body?.id_reserva;
        this.id_asiento = body?.id_asiento;
    }

    async validateDto() {
        // NOTA: Retorna un arrays de errores.
        // Si no hay errores, retorna un array vacio.
        return await validate(this, {
            validationError: { target: false, value: false },
        });
    }
}
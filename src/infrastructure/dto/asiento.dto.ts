import { validate, IsBoolean, IsInt, IsString } from "class-validator";

export class CreateAsientoDto {
    @IsString()
    cod_vuelo: string;

    @IsBoolean()
    disponible: boolean;

    @IsString()
    numero_asiento: string;

    // @IsInt()
    // id_precio_temporal: number;

    @IsInt()
    id_categoria_asiento: number;

    constructor(body: {
        cod_vuelo: string;
        disponible: boolean;
        numero_asiento: string;
        id_precio_temporal: number;
        id_categoria_asiento: number;
    }) {
        this.cod_vuelo = body?.cod_vuelo;
        this.disponible = body?.disponible;
        this.numero_asiento = body?.numero_asiento;
        // this.id_precio_temporal = body?.id_precio_temporal;
        this.id_categoria_asiento = body?.id_categoria_asiento;
    }

    async validateDto() {
        return await validate(this, {
            validationError: { target: false, value: false },
        });
    }
}

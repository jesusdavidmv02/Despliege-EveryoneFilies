import { validate, IsString, IsNumber } from "class-validator";

export class CreateCategoriaDto {
    @IsString()
    nombre_categoria: string;

    @IsNumber()
    precio_base: number;

    constructor(body: {
        nombre_categoria: string;
        precio_base: number;
    }) {
        this.nombre_categoria = body?.nombre_categoria;
        this.precio_base = body?.precio_base;
    }

    async validateDto() {
        // Retorna un array de errores. Si no hay errores, el array estará vacío.
        return await validate(this, {
            validationError: { target: false, value: false },
        });
    }
}

import { validate, IsString, IsInt, IsEmail, IsDate, Min,Max } from "class-validator";

export class PasajeroDto {
    @IsString()
    nombre: string;
    
    @IsString()
    apellido: string;

    @IsEmail()
    email: string;

    @IsInt()
    telefono: string;

    @IsString()
    nacionalidad: string;

    @IsInt()
    id_pasaporte: string;


    constructor(body: {
        nombre: string;
        apellido: string;
        email: string;
        telefono: string;
        nacionalidad: string; 
        id_pasaporte: string;
    }) {
        this.nombre = body?.nombre;
        this.apellido = body?.apellido;
        this.email = body?.email;
        this.telefono = body?.telefono;
        this.nacionalidad = body?.nacionalidad;
        this.id_pasaporte = body?.id_pasaporte;
    }

    async validateDto() {
        // NOTA: Retorna un arrays de errores.
        // Si no hay errores, retorna un array vacio.
        return await validate(this, {
          validationError: { target: false, value: false },
        });
      }
}
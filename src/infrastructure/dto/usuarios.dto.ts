import { validate, IsString, IsEmail, IsEnum } from "class-validator";

export class CreateUsuarioDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsEnum(["cliente", "administrador"])
    role: "cliente" | "administrador";

    constructor(body: {
        email: string;
        password: string;
        role: "cliente" | "administrador";
    }) {
        this.email = body?.email;
        this.password = body?.password;
        this.role = body?.role;
    }

    async validateDto() {
        // Retorna un array de errores. Si no hay errores, el array estará vacío.
        return await validate(this, {
            validationError: { target: false, value: false },
        });
    }
}

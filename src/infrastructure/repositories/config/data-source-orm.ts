import config from "config"
import { DataSource } from "typeorm"
import { PasajeroEntity } from "../../entities/pasajero.entity"
import { pasajeroReservaEntity } from "../../entities/pasajero_reserva.entity"
// import { Asiento } from "../../entities/asiento.model"
// import { Categoria } from "../../entities/categoria.model"
import { ReservaEntity } from "../../entities/reserva.entity"
import { TicketsEntity } from "../../entities/tickets.entity";
import { AsientoEntity } from "../../entities/asientos.entity";
import { CategoriaEntity } from "../../entities/categorias.entity";
import { UsuarioEntity } from "../../entities/usuarios.entity";
import { PreciosTemporalesEntity } from "../../entities/precios_temporales.entity";
import { VueloEntity } from "../../entities/vuelos.entity";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions"
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions"

const common: any = {
    host: config.get('HOST'),
    // port: config.get<number>('PORT'),
    username: config.get('USER'),
    password: config.get('PASSWORD') || '',
    database: config.get('DATABASE'),
    synchronize: false, // NOTA: Si esta 
    entities: [PasajeroEntity, pasajeroReservaEntity, ReservaEntity, VueloEntity, AsientoEntity, CategoriaEntity, UsuarioEntity, PreciosTemporalesEntity, TicketsEntity], // NOTA: Registrar cada entidad "tabla"
}
const postgresConfig: PostgresConnectionOptions = {
    type: "postgres",
    ssl: true,
    ...common
}
const mysqlConfig: MysqlConnectionOptions = {
    type: "mysql",
    ...common
}
export const AppDataSource = new DataSource(
    config.get('DB_TYPE') === 'mysql' ? mysqlConfig : postgresConfig, // Tipo de base de datos
)

async function verifyConnection() {
    try {
        // Intentar inicializar la conexión
        await AppDataSource.initialize()
        console.log("Conexión a la base de datos MySQL exitosa")
    } catch (error) {
        // Si ocurre un error, mostrarlo
        console.error("Error de conexión a la base de datos:", error)
    }
}

// Llamar a la función para verificar la conexión
verifyConnection()

import config  from "config"
import { DataSource } from "typeorm";
import { VueloEntity } from "../entities/vuelos.entity";
import { PasajeroEntity } from "../entities/pasajero.entity";
import { AsientoEntity } from "../entities/asientos.entity";
import { UsuarioEntity } from "../entities/usuarios.entity";
import { PreciosTemporalesEntity } from "../entities/precios_temporales.entity";
import { CategoriaEntity } from "../entities/categorias.entity";
import { pasajeroReservaEntity } from "../entities/pasajero_reserva.entity";
import { ReservaEntity } from "../entities/reserva.entity";
import { TicketsEntity } from "../entities/tickets.entity";

const dbSSL = config.get<boolean>("SSL");

console.log( "--------" +    config.get<string>("HOST"))
console.log( "--------" +    config.get<number>("DB_PORT"))
console.log( "--------" +    config.get<string>("USER"))
console.log( "--------" +    config.get<string>("PASSWORD"))
console.log( "--------" +    config.get<string>("DATABASE"))

export const AppDataSourcePgs = new DataSource({
  type: "postgres",
  host: config.get<string>("HOST"),
  port: config.get<number>("DB_PORT"),
  username: config.get<string>("USER"),
  password: config.get<string>("PASSWORD"),
  database: config.get<string>("DATABASE"),
  ssl: dbSSL ? { rejectUnauthorized: false } : false,
  entities: [VueloEntity ,
     PasajeroEntity ,
     AsientoEntity ,
     UsuarioEntity , 
     PreciosTemporalesEntity, 
     CategoriaEntity,
     pasajeroReservaEntity,
     ReservaEntity,
     TicketsEntity 
    ],
  synchronize: true,
  connectTimeoutMS: 10000, // 10 segundos

});

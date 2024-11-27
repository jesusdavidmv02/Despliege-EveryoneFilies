import { AppDataSourceMysql } from "../db/source.orm";
import { TicketsEntity } from "../entities/tickets.entity";
import { AppDataSource } from "./config/data-source-orm";
import{Repository} from "typeorm"

export class TicketsRepository {
  repository: Repository<TicketsEntity>;

  constructor() {
      this.repository = AppDataSourceMysql.getRepository(TicketsEntity)
  }

  agregar(tickets: TicketsEntity) {
       return this.repository.save(tickets)
     
  }

  async obtenerProIdReservaEntickes(id_reserva: number){
      const resultados = await this.repository.find({
        where: { id_reserva: id_reserva }
    });
    return resultados;
    
 }

  obtener(){
      return this.repository.find()
  }
  
  obtenerById(id: number){
      return this.repository.findOne({
        select:{
          id_ticket:true,
          id_reserva: true,
          id_vuelo: true,
          id_pasajero: true,
          fecha_emision:true,
          estado_ticket:true,
        },
          where: {
              id_ticket:id
          },
      })
  }

  eliminar(id_ticket: number) {
      return this.repository.delete({id_ticket})
  }

  actualizar(tickets: TicketsEntity) {
      return this.repository.update(tickets.id_ticket, {
        id_vuelo: tickets.id_vuelo,
        id_pasajero: tickets.id_pasajero,
        fecha_emision: tickets.fecha_emision,
        estado_ticket: tickets.estado_ticket,
      })
  }


  obtenerPorId(id_ticket: number){
      return this.repository.find({
          where: {
              id_reserva: id_ticket
          }
      })
  }


}
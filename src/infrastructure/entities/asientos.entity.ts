
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { CategoriaEntity } from "./categorias.entity";
import { VueloEntity } from "./vuelos.entity";
import { pasajeroReservaEntity } from "./pasajero_reserva.entity";

@Entity("asientos")
export class AsientoEntity {

  @PrimaryGeneratedColumn()
  id_asiento: number = 0 ; 

  // Clave foránea que conecta cada asiento con un vuelo específico usando id_vuelo
  @Column()
  id_vuelo?: number; 

  // Relación ManyToOne con Vuelo
  @ManyToOne(() => VueloEntity, (vuelo) => vuelo.id_vuelo)
  @JoinColumn({ name: "id_vuelo", referencedColumnName: "id_vuelo" }) // Usamos cod_vuelo como clave foránea
  vuelo?: VueloEntity ;

  // Indica si el asiento está disponible
  @Column({ type: "boolean", default: true })
  disponible?: boolean;

  // Número de asiento
  @Column()
  numero_asiento?: string;

  // Clave foránea que conecta con la tabla PrecioTemporal
  //se comenta esta columna debido a que no se requiere 
  // @Column()
  // id_precio_temporal?: number;

  // @ManyToOne(() => PreciosTemporalesEntity)
  // @JoinColumn({ name: "id_precio_temporal" })
  // precio_temporal?: PreciosTemporalesEntity;
  
  // Clave foránea que conecta con la tabla Categoria

  @Column()
  id_categoria?: number;
  
  @ManyToOne(() => CategoriaEntity, (categoria) => categoria.id_categoria ) //  { eager: false } trae los datos internos 
  @JoinColumn({ name: "id_categoria" })
  id_categoria_asiento?: number;

   // Relación inversa con pasajeroReservaEntity
   @OneToMany(() => pasajeroReservaEntity, pasajeroReserva => pasajeroReserva.asiento)
   pasajeroReservas?: pasajeroReservaEntity[];

}

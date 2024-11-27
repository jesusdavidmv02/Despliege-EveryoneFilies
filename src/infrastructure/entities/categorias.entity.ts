import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { AsientoEntity } from "./asientos.entity";

@Entity("categorias")
export class CategoriaEntity {

  @PrimaryGeneratedColumn()
  id_categoria : number =  0;
  
  @Column()
  nombre_categoria?: string;

  @Column("decimal")
  porcentaje_categoria?: number;


  @OneToMany(() => AsientoEntity, (asiento) => asiento.id_categoria_asiento)
  //asientos: Asiento[]; // Cambiado a un array de Asiento
  asientos?: AsientoEntity; // revisar

}


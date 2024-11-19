import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  sender: string;

  @Column()
  room: string;

  @Column()
  message:string;
}

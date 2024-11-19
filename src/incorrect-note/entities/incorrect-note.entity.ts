import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class IncorrectNote {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({nullable: true})
  mentoId: number;
  @Column()
  studentId: number;
  @Column()
  errorType: number; 
  @Column()
  language: string;
  @Column()
  noteName: string; 
  @Column({nullable: true})
  chatName: number;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class IncorrectNote {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  mentoId: number;
  @Column()
  studentId: number;
  @Column()
  errorType: number; 
  @Column()
  language: string;
  @Column()
  noteName: string; 
  @Column()
  chatName: string;
}

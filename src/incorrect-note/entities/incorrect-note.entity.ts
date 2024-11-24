import { Column, Entity, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['studentId','noteName','language'])
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

import { ChatRoom } from "../../chat-room/entities/chat-room.entity";
import { User } from "../../user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity()
@Unique(['studentId','noteName','language'])
export class IncorrectNote {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>User, {nullable:true})
  @JoinColumn({name:'mentoId'})
  mento:User

  @Column({nullable: true})
  mentoId: number;

  @ManyToOne(()=>User)
  @JoinColumn({name:'studentId'})
  student:User

  @Column()
  studentId: number;
  @Column()
  errorType: number; 
  @Column()
  language: string;
  @Column()
  noteName: string; 

  @OneToOne(()=>ChatRoom)
  @JoinColumn({name:'chatName'})
  chatRoom:ChatRoom

  @Column({nullable: true})
  chatName: number;
}

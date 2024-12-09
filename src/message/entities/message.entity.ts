import { ChatRoom } from "../../chat-room/entities/chat-room.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id:number;

  @Column()
  sender: string;

  @ManyToOne(() => ChatRoom)
  @JoinColumn({ name: 'room' })
  chatRoom: ChatRoom;

  @Column()
  room: number;

  @Column()
  message:string;
}

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ChatRoom {
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    sender:number;

    @Column()
    receiver:number;
    @Column()
    noteName:string;
    @Column()
    noteId:number;
    
}

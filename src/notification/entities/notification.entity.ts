import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    sender:string;

    @Column()
    receiver:string;

    @Column()
    content:string;
}

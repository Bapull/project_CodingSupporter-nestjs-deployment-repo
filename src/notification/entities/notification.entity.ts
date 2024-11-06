import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    userId:number;

    @Column()
    writerId:number;

    @Column()
    not_type:string;

    @Column()
    content:string;

    @Column()
    isChecked:number;


}

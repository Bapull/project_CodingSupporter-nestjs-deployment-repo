import { DateDimensionField } from "aws-sdk/clients/quicksight";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id:number

    @Column()
    message:string

    @Column()
    type:string

    @CreateDateColumn({ type: 'timestamp' })
    timestamp:Date

    @Column()
    userId:number

    @Column()
    link:string
}

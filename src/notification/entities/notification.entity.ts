import { DateDimensionField } from "aws-sdk/clients/quicksight";
import { User } from "../../user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId:number

    @Column()
    link:string
}

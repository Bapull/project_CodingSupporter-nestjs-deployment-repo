import { User } from '../../user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['userId', 'checkInTime'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>User)
  @JoinColumn({name:'userId'})
  user:User


  @Column()
  userId: number;

  @Column()
  checkInTime: string;
}

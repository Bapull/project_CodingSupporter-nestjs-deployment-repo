import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({ type: 'timestamp' })
  checkInTime: Date;
}

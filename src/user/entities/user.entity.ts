import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id:number;
  @Column()
  name:string;
  @Column()
  useLanguage: string;
  @Column()
  position: number;
  @Column()
  profilePicture: string;
  @Column()
  googleId: string;
}

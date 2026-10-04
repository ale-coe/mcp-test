import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from './message.entity.js';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[];
}

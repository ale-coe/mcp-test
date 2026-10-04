import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity.js';

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn()
  messageId: number;

  @Column()
  content: string;

  @Column()
  releaseDate: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.messages, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user: User;
}

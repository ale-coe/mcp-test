import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  releaseDate: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column()
  userId: number;
}

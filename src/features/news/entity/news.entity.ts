import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class NewsEntity {
  @PrimaryGeneratedColumn()
  newsId: number;
  @Column()
  news: string;
  @Column()
  createdAt: string;
  @Column({ default: null })
  updateAt: string;
  @Column()
  authorId: number;
}

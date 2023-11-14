import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './entity/news.entity';

@Injectable()
export class NewsRepository {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly usersCollection: Repository<NewsEntity>,
  ) {}

  async save(news: NewsEntity): Promise<NewsEntity> {
    return this.usersCollection.save(news);
  }

  async getNewsById(newsId: number): Promise<NewsEntity> {
    return this.usersCollection.findOneBy({ newsId: newsId });
  }

  async deleteNewsById(newsId: number): Promise<boolean> {
    const result = await this.usersCollection.delete({ newsId: newsId });
    return result.affected === 1;
  }

  async getNews(): Promise<NewsEntity[]> {
    return this.usersCollection.find();
  }
}

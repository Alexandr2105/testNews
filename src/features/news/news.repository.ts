import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NewsEntity } from './entity/news.entity';

@Injectable()
export class NewsRepository {
  constructor(
    @InjectRepository(NewsEntity)
    private readonly newsCollection: Repository<NewsEntity>,
  ) {}

  async save(news: NewsEntity): Promise<NewsEntity> {
    return this.newsCollection.save(news);
  }

  async getNewsById(newsId: number): Promise<NewsEntity> {
    return this.newsCollection.findOneBy({ newsId: newsId });
  }

  async deleteNewsById(newsId: number): Promise<boolean> {
    const result = await this.newsCollection.delete({ newsId: newsId });
    return result.affected === 1;
  }

  async getNews(): Promise<NewsEntity[]> {
    return this.newsCollection.find();
  }
}

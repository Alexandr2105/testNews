import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../features/users/entity/user.entity';
import { Repository } from 'typeorm';
import { NewsEntity } from '../features/news/entity/news.entity';

export class TestingRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersCollection: Repository<UserEntity>,
    @InjectRepository(NewsEntity)
    private readonly newsCollection: Repository<NewsEntity>,
  ) {}

  async deleteAllCollection() {
    await this.usersCollection.query(`DELETE FROM public."user_entity"`);
    await this.newsCollection.query(`DELETE FROM public."news_entity"`);
  }
}

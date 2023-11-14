import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewsRepository } from '../../news.repository';
import { NewsEntity } from '../../entity/news.entity';

export class CreateNewsCommand {
  constructor(public userId: number, public news: string) {}
}

@CommandHandler(CreateNewsCommand)
export class CreateNewsUseCase implements ICommandHandler<CreateNewsCommand> {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(command: CreateNewsCommand): Promise<NewsEntity> {
    const news = new NewsEntity();
    news.news = command.news;
    news.createdAt = new Date().toISOString();
    news.authorId = command.userId;
    return this.newsRepository.save(news);
  }
}

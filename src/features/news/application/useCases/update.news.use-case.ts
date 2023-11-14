import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewsRepository } from '../../news.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { NewsEntity } from '../../entity/news.entity';

export class UpdateNewsCommand {
  constructor(
    public userid: number,
    public news: string,
    public idNews: number,
  ) {}
}

@CommandHandler(UpdateNewsCommand)
export class UpdateNewsUseCase implements ICommandHandler<UpdateNewsCommand> {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(command: UpdateNewsCommand): Promise<NewsEntity> {
    const news = await this.newsRepository.getNewsById(command.idNews);
    if (!news) throw new NotFoundException();
    if (news.authorId !== command.userid) throw new ForbiddenException();
    news.news = command.news;
    news.updateAt = new Date().toISOString();
    return this.newsRepository.save(news);
  }
}

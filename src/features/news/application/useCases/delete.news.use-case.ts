import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NewsRepository } from '../../news.repository';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

export class DeleteNewsCommand {
  constructor(public userId: number, public newsId: number) {}
}

@CommandHandler(DeleteNewsCommand)
export class DeleteNewsUseCase implements ICommandHandler<DeleteNewsCommand> {
  constructor(private readonly newsRepository: NewsRepository) {}

  async execute(command: DeleteNewsCommand): Promise<any> {
    const news = await this.newsRepository.getNewsById(command.newsId);
    if (!news) throw new NotFoundException();
    if (news.authorId !== command.userId) throw new ForbiddenException();
    return this.newsRepository.deleteNewsById(command.newsId);
  }
}

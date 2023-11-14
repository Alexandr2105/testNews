import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../../users/users.repository';

export class GetInformationAboutCommand {
  constructor(public userId: number) {}
}

@CommandHandler(GetInformationAboutCommand)
export class GetInformationAboutUserUseCase
  implements ICommandHandler<GetInformationAboutCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: GetInformationAboutCommand): Promise<any> {
    return this.usersRepository.getUserById(command.userId);
  }
}

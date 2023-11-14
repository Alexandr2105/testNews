import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegistrationUserDto } from '../../dto/registration.dto';
import { UserEntity } from '../../../users/entity/user.entity';
import { UsersRepository } from '../../../users/users.repository';
import { BcryptService } from '../../../../common/bcript/bcript.service';
import { BadRequestException } from '@nestjs/common';

export class CreateUserCommand {
  constructor(public userDto: RegistrationUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private readonly usersRepository: UsersRepository,
    private bcryptService: BcryptService,
  ) {}

  async execute(command: CreateUserCommand): Promise<UserEntity> {
    const user = await this.usersRepository.getUserByEmail(
      command.userDto.email,
    );
    if (user)
      throw new BadRequestException({
        message: 'Такой email уже сущуствует',
        field: 'email',
      });
    const hash = await this.bcryptService.generateHashForNewUser(
      command.userDto.password,
    );
    const newUser = new UserEntity();
    newUser.createdAt = new Date().toISOString();
    newUser.password = hash;
    newUser.email = command.userDto.email;
    newUser.login = command.userDto.login;
    return this.usersRepository.createUser(newUser);
  }
}

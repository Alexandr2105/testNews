import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../features/users/users.repository';
import { BcryptService } from '../bcript/bcript.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly genHash: BcryptService,
  ) {
    super({
      usernameField: 'email',
    });
  }
  async validate(email: string, password: string): Promise<any> {
    const user = await this.usersRepository.getUserByEmail(email);
    const hashPassword = await this.genHash.generateHash(
      password.toString(),
      user.password,
    );

    if (!user || user.password === hashPassword) {
      return user;
    } else {
      throw new UnauthorizedException();
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersCollection: Repository<UserEntity>,
  ) {}

  async getUserByEmail(email: any): Promise<UserEntity> {
    return this.usersCollection.findOne({
      where: { email: email },
    });
  }

  async createUser(user: UserEntity): Promise<UserEntity> {
    return this.usersCollection.save(user);
  }

  async getUserById(userId: number): Promise<any> {
    return this.usersCollection.findOne({
      where: { userId: userId },
      select: { userId: true, login: true, createdAt: true, email: true },
    });
  }
}

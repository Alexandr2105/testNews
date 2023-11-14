import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserEntity } from './features/users/entity/user.entity';
import { RefreshStrategy } from './common/strategies/refresh.strategy';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { LocalStrategy } from './common/strategies/local.strategy';
import { AuthController } from './features/auth/auth.controller';
import { Jwt } from './features/auth/jwt';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserUseCase } from './features/auth/application/useCases/create.user.use-case';
import { UsersRepository } from './features/users/users.repository';
import { BcryptService } from './common/bcript/bcript.service';
import { NewsEntity } from './features/news/entity/news.entity';
import { NewsController } from './features/news/news.controller';
import { CreateNewsUseCase } from './features/news/application/useCases/create.news.use-case';
import { NewsRepository } from './features/news/news.repository';
import { UpdateNewsUseCase } from './features/news/application/useCases/update.news.use-case';
import { DeleteNewsUseCase } from './features/news/application/useCases/delete.news.use-case';
import { GetInformationAboutUserUseCase } from './features/news/application/useCases/get.information.about.user.use-case';
import { TestingRepository } from './testing/testing.repository';
import { TestingController } from './testing/testing.controller';

const entities = [UserEntity, NewsEntity];
const strategies = [LocalStrategy, JwtStrategy, RefreshStrategy];
const useCases = [
  CreateUserUseCase,
  CreateNewsUseCase,
  UpdateNewsUseCase,
  DeleteNewsUseCase,
  GetInformationAboutUserUseCase,
];
const repositories = [UsersRepository, NewsRepository, TestingRepository];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        ssl: true,
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USERNAME'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DATABASE'),
        entities: [...entities],
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature(entities),
    JwtModule.register({}),
    CqrsModule,
  ],
  controllers: [
    AppController,
    AuthController,
    NewsController,
    TestingController,
  ],
  providers: [
    AppService,
    Jwt,
    ...useCases,
    ...repositories,
    ...strategies,
    BcryptService,
  ],
})
export class AppModule {}

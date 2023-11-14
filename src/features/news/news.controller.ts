import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { NewsDto } from './dto/news.dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateNewsCommand } from './application/useCases/create.news.use-case';
import { NewsEntity } from './entity/news.entity';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { UpdateNewsCommand } from './application/useCases/update.news.use-case';
import { DeleteNewsCommand } from './application/useCases/delete.news.use-case';
import { NewsRepository } from './news.repository';

@Controller('news')
export class NewsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly newsRepository: NewsRepository,
  ) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Post()
  async createNews(@Body() body: NewsDto, @Req() req): Promise<NewsEntity> {
    return this.commandBus.execute(
      new CreateNewsCommand(req.user.id, body.news),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @Put(':id')
  async updateNews(
    @Body() body: NewsDto,
    @Req() req,
    @Param('id') idNews: number,
  ): Promise<NewsEntity> {
    return this.commandBus.execute(
      new UpdateNewsCommand(req.user.id, body.news, idNews),
    );
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Delete(':id')
  async deleteNews(@Req() req, @Param('id') idNews: number): Promise<boolean> {
    return this.commandBus.execute(new DeleteNewsCommand(req.user.id, idNews));
  }

  @HttpCode(200)
  @Get()
  async getNews(): Promise<NewsEntity[]> {
    return this.newsRepository.getNews();
  }

  @HttpCode(200)
  @Get(':idNews')
  async getNewsById(@Param('idNews') idNews: number): Promise<NewsEntity> {
    return this.newsRepository.getNewsById(idNews);
  }
}

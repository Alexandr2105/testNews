import { Transform } from 'class-transformer';

export class NewsDto {
  @Transform(({ value }) => value.trim())
  news: string;
}

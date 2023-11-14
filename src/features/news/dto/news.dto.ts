import { Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class NewsDto {
  @Transform(({ value }) => value.trim())
  @IsNotEmpty()
  news: string;
}

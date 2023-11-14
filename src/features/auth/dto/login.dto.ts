import { Transform } from 'class-transformer';
import { IsEmail } from 'class-validator';

export class LoginDto {
  @Transform(({ value }) => value.trim())
  @IsEmail()
  email: string;
  @Transform(({ value }) => value.trim())
  password: string;
}

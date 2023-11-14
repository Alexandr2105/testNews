import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Jwt } from './jwt';
import { LoginDto } from './dto/login.dto';
import { RegistrationUserDto } from './dto/registration.dto';
import { RefreshAuthGuard } from '../../common/guards/refresh.auth.guard';
import { LocalAuthGuard } from '../../common/guards/local.auth.guard';
import { CreateUserCommand } from './application/useCases/create.user.use-case';
import { JwtAuthGuard } from '../../common/guards/jwt.auth.guard';
import { GetInformationAboutCommand } from '../news/application/useCases/get.information.about.user.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: Jwt,
    private readonly commandBus: CommandBus,
  ) {}

  @HttpCode(204)
  @Post('registration')
  async registration(@Body() body: RegistrationUserDto) {
    await this.commandBus.execute(new CreateUserCommand(body));
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login')
  async loginUser(@Req() req, @Body() body: LoginDto, @Res() res) {
    const accessToken = this.jwtService.creatJWT(req.user.userId);
    const refreshToken = this.jwtService.creatRefreshJWT(req.user.userId);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
    });
    res.send(accessToken);
  }

  @UseGuards(RefreshAuthGuard)
  @HttpCode(200)
  @Post('refresh-token')
  async createRefreshToken(@Req() req, @Res() res) {
    const token = this.jwtService.creatJWT(req.user.userId);
    const refreshToken = this.jwtService.creatRefreshJWT(req.user.userId);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: false,
      secure: false,
    });
    res.send(token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req): Promise<any> {
    return this.commandBus.execute(new GetInformationAboutCommand(req.user.id));
  }
}

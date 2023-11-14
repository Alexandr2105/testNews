import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { settings } from '../../common/helper/settings';

@Injectable()
export class Jwt {
  constructor(protected jwt: JwtService, protected refreshToken: JwtService) {}

  creatJWT(userId: string) {
    return {
      accessToken: this.jwt.sign(
        { userId: userId },
        { expiresIn: settings.TOKEN_LIFE, secret: settings.JWT_SECRET },
      ),
    };
  }

  creatRefreshJWT(userId: string) {
    return this.refreshToken.sign(
      {
        userId: userId,
      },
      {
        expiresIn: settings.REFRESH_TOKEN_LIFE,
        secret: settings.REFRESH_TOKEN_SECRET,
      },
    );
  }
}

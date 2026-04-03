import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../../infrastructure/redis/redis.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(REDIS_CLIENT) private readonly redis: Redis) {
    const secret =
      process.env.JWT_SECRET ||
      'hohoino_bibib!ohi6156445616489745644897456464897';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    return { sub: payload.sub, id: payload.sub, email: payload.email, phoneNbr: payload.phoneNbr, username: payload.username, role: payload.role || payload.roles?.[0] || 'user' };
  }
}

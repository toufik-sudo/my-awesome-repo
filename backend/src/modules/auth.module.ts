import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
// import { AuthService } from 'src/auth/auth.service';
import { AuthController } from 'src/user/controllers/auth.controller';
import { JwtStrategy } from 'src/services/jwt/jwt.strategy';
import { UserModule } from '../user/modules/user.module';
import { SessionService } from '../services/session/session.service';

const secret =
  process.env.JWT_SECRET || 'hohoino_bibib!ohi6156445616489745644897456464897';
@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
      session: true,
    }),
    JwtModule.register({
      global: true,
      secret: secret,
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, SessionService],
  exports: [AuthService, PassportModule, SessionService],
})
export class AuthModule {}

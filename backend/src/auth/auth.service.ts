import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../infrastructure/redis/redis.constant';
import { LoginDto } from 'src/dtos/login/login.dto';
import { RegisterDto } from 'src/dtos/login/register.dto';
import { CreateUserRequestDto } from 'src/user/dtos/requests/create.user.request.dto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/services/user.service';
import { CreateUserResponseDto } from '../user/dtos/responses/create.user.response.dto';
import { SessionService } from '../services/session/session.service';
import { SessionDto } from '../dtos/login/session.dto';
import { ValidateUserRequestDto } from '../user/dtos/requests/validate.user.request.dto';
import {
  USER_CREATED_KO,
  USER_CREATED_OK,
  USER_DUPLICATE,
  USER_EMAIL_KO,
  USER_LOGIN_DUPLICATE_KO,
  USER_LOGIN_NOTFOUND_KO,
  USER_NOT_FOUND,
  USER_OTP_KO,
  USER_PASSWORD_KO,
  USER_PHONE_NBR_KO,
  USER_VALIDATED_KO,
  USER_VALIDATED_OK,
} from '../user/constants/user.constants';
import {
  DUPLICATE_ENTITY_CODE,
  USER_CREATED_KO_CODE,
  USER_LOGIN_DUPLICATE_KO_CODE,
  USER_LOGIN_NOTFOUND_KO_CODE,
  USER_OTP_KO_CODE,
  USER_PASSWORD_KO_CODE,
} from '../constants/exceptions.codes.constants';
import { ActivateUserRequestDto } from '../user/dtos/requests/activate.user.request.dto';
import { emit } from 'process';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) { }

  private logger = new Logger(AuthService.name);

  private secret =
    process.env.JWT_SECRET;

  async validateUser(validateUserRequestDto: ValidateUserRequestDto) {
    const { phoneNbr, email, otp } = validateUserRequestDto;

    // ✅ At least one of email or phoneNbr must be provided
    if (!phoneNbr && !email) {
      throw new HttpException(USER_PHONE_NBR_KO, HttpStatus.BAD_REQUEST, {
        cause: USER_PHONE_NBR_KO,
        description: 'Either phoneNbr or email must be provided',
      });
    }

    // ✅ Phone format validation (only if phoneNbr provided)
    if (phoneNbr) {
      const phoneRegex = /^\+?[0-9]{8,15}$/;
      if (!phoneRegex.test(phoneNbr.trim())) {
        throw new HttpException(USER_PHONE_NBR_KO, HttpStatus.BAD_REQUEST, {
          cause: USER_PHONE_NBR_KO,
          description: 'Invalid phone number format',
        });
      }
    }

    // ✅ Email format validation (only if email provided)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        throw new HttpException(USER_EMAIL_KO, HttpStatus.BAD_REQUEST, {
          cause: USER_EMAIL_KO,
          description: 'Invalid email format',
        });
      }
    }

    if (!otp) {
      throw new UnauthorizedException(USER_OTP_KO);
    }

    // ✅ Lookup by whichever identifier was provided
    const userList: User[] = phoneNbr
      ? await this.userService.findUserByPhoneNbr(phoneNbr.trim())
      : await this.userService.findUserByEmail(email.trim());

    if (!userList || userList.length === 0) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.NOT_FOUND, {
        cause: USER_NOT_FOUND,
        description: HttpStatus.NOT_FOUND.toString(),
      });
    }

    if (userList.length > 1) {
      throw new HttpException(USER_DUPLICATE, HttpStatus.CONFLICT, {
        cause: USER_DUPLICATE,
        description: DUPLICATE_ENTITY_CODE.toString(),
      });
    }

    const user: User = userList[0];
    if (user.otp != otp) {
      throw new HttpException(USER_OTP_KO, HttpStatus.UNAUTHORIZED, {
        cause: USER_OTP_KO,
        description: USER_OTP_KO_CODE.toString(),
      });
    }

    user.isActive = true;
    return this.userService.saveUser(user, USER_VALIDATED_OK, USER_VALIDATED_KO);
  }


  async checkTokenAndSession(
    req,
    res,
    authHeader: string | null,
    isLogin: boolean,
    user: LoginDto,
  ): Promise<any> {
    // ✅ Handles both "Bearer <token>" and raw token (from session)
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader ?? null;

    if (token) {
      const decoded = await this.verifyToken(req, res, token);
      if (decoded && decoded !== 'TOKEN_EXPIRED' && decoded !== 'TOKEN_INVALID') {
        if (isLogin) {
          throw new UnauthorizedException('TOKEN_ALREADY_EXIST');
        }
        return 'TOKEN_ALREADY_EXIST';
      }
      return decoded;
    }

    const sessionData: SessionDto = this.sessionService.getSession(
      req,
      user.phoneNbr,
    );

    if (sessionData?.authToken) {
      return this.checkTokenAndSession(
        req,
        res,
        sessionData.authToken, // ← raw JWT, now safely handled above
        isLogin,
        user,
      );
    }

    return 'TOKEN_INVALID';
  }


  async login(req, res, authHeader, loginDto: LoginDto) {
    try {
      if (!loginDto.password || loginDto.password?.length < 8) {
        throw new UnauthorizedException(USER_PASSWORD_KO);
      }
      if (!loginDto.phoneNbr && !loginDto.email) {
        if (!loginDto.phoneNbr) {
          throw new UnauthorizedException(USER_PHONE_NBR_KO);
        } else {
          throw new UnauthorizedException(USER_EMAIL_KO);
        }
      }

      console.log('begin login service !!!');
      const decodedToken = await this.checkTokenAndSession(
        req,
        res,
        authHeader,
        true,
        loginDto,
      );

      if (
        decodedToken &&
        decodedToken != 'TOKEN_INVALID' &&
        decodedToken != 'TOKEN_EXPIRED'
      ) {
        return {
          access_token: decodedToken,
        };
      }

      let userdb: User[] = [];
      if (loginDto.phoneNbr) {
        userdb = await this.userService.findUserByPhoneNbr(
          loginDto.phoneNbr,
        );
      } else {
        userdb = await this.userService.findUserByEmail(
          loginDto.email,
        );
      }

      if (!userdb) {
        throw new HttpException(
          USER_LOGIN_NOTFOUND_KO,
          HttpStatus.UNAUTHORIZED,
          {
            cause: USER_LOGIN_NOTFOUND_KO,
            description: USER_LOGIN_NOTFOUND_KO_CODE.toString(),
          },
        );
      }

      if (userdb && userdb.length > 1) {
        throw new HttpException(
          USER_LOGIN_DUPLICATE_KO,
          HttpStatus.UNAUTHORIZED,
          {
            cause: USER_LOGIN_DUPLICATE_KO,
            description: USER_LOGIN_DUPLICATE_KO_CODE.toString(),
          },
        );
      }

      const userRole = userdb[0].role || 'user';

      const payload = {
        sub: userdb[0].id,
        id: userdb[0].id,
        email: loginDto.email,
        phoneNbr: loginDto.phoneNbr,
        role: userRole,
        username: userdb[0].lastName + ' ' + userdb[0].firstName,
      };

      const passwordDto = this.userService.decodePassword(loginDto.password);
      const passwordOk = await this.userService.comparePasswords(
        passwordDto,
        userdb[0].password,
      );

      if (!passwordOk) {
        throw new HttpException(USER_PASSWORD_KO, HttpStatus.UNAUTHORIZED, {
          cause: USER_PASSWORD_KO, // Correction: utilisez USER_PASSWORD_KO au lieu de USER_LOGIN_DUPLICATE_KO
          description: USER_PASSWORD_KO_CODE.toString(), // Correction: utilisez le bon code d'erreur
        });
      }

      const token = this.jwtService.sign(payload, { expiresIn: '1h' });
      const refreshToken = this.jwtService.sign(
        { sub: userdb[0].id, type: 'refresh' },
        { expiresIn: '7d' },
      );

      // Store session in Redis keyed by user ID
      const sessionRedisKey = `session:user:${userdb[0].id}`;
      await this.redis.set(
        sessionRedisKey,
        JSON.stringify({ token, refreshToken, userId: userdb[0].id, email: loginDto.email, phoneNbr: loginDto.phoneNbr }),
        'EX',
        7 * 24 * 3600,
      );

      const sessionData: SessionDto = {
        sub: userdb[0].id,
        id: userdb[0].id,
        phoneNbr: userdb[0].phoneNbr,
        authToken: token,
        username: userdb[0].lastName + '_' + userdb[0].firstName,
        roles: userRole,
      };

      this.sessionService.setSession(req, res, loginDto.phoneNbr, sessionData);

      return {
        access_token: token,
        refreshToken: refreshToken,
      };
    } catch (error) {
      // Si l'erreur est déjà une HttpException, on la relance telle quelle
      if (
        error instanceof HttpException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }
      // Sinon, on lance une exception générique
      throw new UnauthorizedException('Authentication failed');
    }
  }

  async registerUser(registerDto: CreateUserRequestDto): Promise<any> {
    return this.userService.createUser(registerDto);
  }

  async activateUser(
    activateUserRequestDto: ActivateUserRequestDto,
  ): Promise<any> {
    return this.userService.activateUser(activateUserRequestDto);
  }

  async signOut(
    phoneNbr: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const users: User[] = await this.userService.findUserByPhoneNbr(phoneNbr);
    const user = users && users.length > 0 ? users[0] : null;
    if (user && user.password !== password) {
      throw new UnauthorizedException();
    }
    const userRole = user.role || 'user';
    const payload = { sub: user.id, phoneNbr: phoneNbr, email: user.email, role: userRole, username: user.lastName + ' ' + user.firstName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  /**
   * Logout: destroy session, delete all user data from Redis, clear cookies
   */
  async logout(req: any, res: any): Promise<{ message: string }> {
    try {
      const userId = req.user?.id || req.user?.sub;

      // Delete user session from Redis entirely
      if (userId) {
        await this.redis.del(`session:user:${userId}`);
        this.logger.log(`Deleted Redis session for user ${userId}`);

        // Clean up any user-specific cache keys
        const pattern = `app:*:user:${userId}`;
        let cursor = '0';
        do {
          const [nextCursor, keys] = await this.redis.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
          cursor = nextCursor;
          if (keys.length > 0) {
            await this.redis.del(...keys);
          }
        } while (cursor !== '0');
      }

      // Destroy express session
      this.sessionService.clearSession(req, res);

      // Clear cookies
      res.clearCookie('connect.sid', { path: '/' });

      return { message: 'Logged out successfully' };
    } catch (error) {
      this.logger.error('Logout error:', error);
      return { message: 'Logged out successfully' };
    }
  }

  /**
   * Refresh token: issue new access token using a valid refresh token
   */
  async refreshToken(req: any): Promise<{ access_token: string; refreshToken: string }> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, { secret: this.secret });
      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      const userId = decoded.sub;

      // Verify session still exists in Redis (user hasn't logged out)
      const sessionData = await this.redis.get(`session:user:${userId}`);
      if (!sessionData) {
        throw new UnauthorizedException('Session expired, please login again');
      }

      const session = JSON.parse(sessionData);
      if (session.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Build fresh payload
      const users = await this.userService.findUserById(userId);
      const user = Array.isArray(users) ? users[0] : users;
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const userRole = user.role || 'user';

      const payload = {
        sub: user.id,
        id: user.id,
        email: user.email,
        phoneNbr: user.phoneNbr,
        role: userRole,
        username: user.lastName + ' ' + user.firstName,
      };

      const newAccessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
      const newRefreshToken = this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        { expiresIn: '7d' },
      );

      // Update session in Redis with new tokens
      await this.redis.set(
        `session:user:${userId}`,
        JSON.stringify({ ...session, token: newAccessToken, refreshToken: newRefreshToken }),
        'EX',
        7 * 24 * 3600,
      );

      return { access_token: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async verifyToken(@Req() req: any, @Res() res: any, token: string) {
    try {
      // Verify the token and check expiration
      const decoded = await this.jwtService.verify(token, {
        secret: this.secret,
      });
      return decoded;
    } catch (error: any) {
      this.sessionService.clearSession(req, res);
      if (error.name === 'TokenExpiredError') {
        // throw new UnauthorizedException('Token has expired');
        return 'TOKEN_EXPIRED';
      }
      // throw new UnauthorizedException('Invalid token');
      return 'TOKEN_INVALID';
    }
  }
}

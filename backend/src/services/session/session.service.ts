import { Injectable, Logger, Req, Res } from "@nestjs/common";
import { SessionDto } from '../../dtos/login/session.dto';
import { UserService } from "../../user/services/user.service";

@Injectable()
export class SessionService {
  private logger = new Logger(SessionService.name);
  setSession(
    @Req() req: any,
    @Res() res: any,
    token: string,
    tokenData: SessionDto,
  ) {
    try {
      const sessionData = tokenData ? JSON.stringify(tokenData) : null;
      if (sessionData && req.session) {
        req.session[token] = sessionData;
      }
      return req;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return req;
    }
  }

  getSession(@Req() req: any, token: string) {
    const dataSession = req.session ? req.session[token] : null; // Retrieve data from session
    if (dataSession) {
      return JSON.parse(dataSession);
    }
    return null;
  }

  clearSession(@Req() req: any, @Res() res: any) {
    req.session.destroy((err) => {
      if (err) {
        this.logger.error('Could not clear session');
      } else {
        this.logger.warn('Session cleared');
      }
    });
  }
}

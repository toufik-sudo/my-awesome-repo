import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

@Controller('session')
@UseGuards(JwtAuthGuard)
export class SessionController {
  // @Post('login')
  // login(@Req() req: Request | any, @Res() res: Response) {
  //   // Set session data
  //   req.session.user = { id: 1, username: 'example' };
  //   res.send('Logged in!');
  // }

  // @Get('profile')
  // getProfile(@Req() req: Request | any, @Res() res: Response) {
  //   if (req.session.user) {
  //     res.send(`Welcome ${req.session.user.username}`);
  //   } else {
  //     res.send('Not logged in');
  //   }
  // }
}

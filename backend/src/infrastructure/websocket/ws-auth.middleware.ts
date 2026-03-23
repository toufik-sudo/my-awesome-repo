import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthMiddleware {
  private readonly logger = new Logger(WsAuthMiddleware.name);

  constructor(private readonly jwtService: JwtService) {}

  /**
   * Authenticate a Socket.IO connection using JWT from handshake auth or query.
   * Attaches decoded user payload to socket.data.user
   */
  authenticate(socket: Socket): boolean {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.replace('Bearer ', '') ||
        socket.handshake.query?.token;

      if (!token) {
        this.logger.warn(`WS auth failed: no token provided (${socket.id})`);
        return false;
      }

      const decoded = this.jwtService.verify(token);
      socket.data.user = decoded;
      this.logger.debug(`WS authenticated: ${socket.id} → user:${decoded.sub}`);
      return true;
    } catch (error: any) {
      this.logger.warn(`WS auth failed: ${error.message} (${socket.id})`);
      return false;
    }
  }
}

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { WsAuthMiddleware } from './ws-auth.middleware';

interface ChatMessage {
  to: string; // recipient userId
  content: string;
  bookingId?: string;
  propertyId?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  },
  namespace: '/events',
  transports: ['websocket', 'polling'],
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EventsGateway.name);
  /** Map userId → Set of socketIds for multi-device support */
  private readonly userSockets = new Map<string, Set<string>>();

  constructor(private readonly wsAuth: WsAuthMiddleware) {}

  afterInit(server: Server) {
    // Apply JWT authentication middleware
    server.use((socket, next) => {
      const authenticated = this.wsAuth.authenticate(socket);
      if (!authenticated) {
        return next(new Error('Authentication failed'));
      }
      next();
    });
    this.logger.log('WebSocket gateway initialized');
  }

  handleConnection(client: Socket) {
    const userId = client.data.user?.sub;
    if (!userId) {
      client.disconnect();
      return;
    }

    // Track user sockets
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId).add(client.id);

    // Auto-join user's personal room
    client.join(`user:${userId}`);

    this.logger.log(
      `Client connected: ${client.id} (user:${userId}) | Online users: ${this.userSockets.size}`,
    );
  }

  handleDisconnect(client: Socket) {
    const userId = client.data.user?.sub;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId).delete(client.id);
      if (this.userSockets.get(userId).size === 0) {
        this.userSockets.delete(userId);
      }
    }
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // ─── Chat ──────────────────────────────────────────────

  @SubscribeMessage('chat:send')
  handleChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: ChatMessage,
  ) {
    const senderId = client.data.user?.sub;
    const payload = {
      from: senderId,
      content: data.content,
      bookingId: data.bookingId,
      propertyId: data.propertyId,
      timestamp: new Date().toISOString(),
    };

    // Send to recipient
    this.emitToUser(data.to, 'chat:message', payload);
    // Echo back to sender for confirmation
    client.emit('chat:sent', { ...payload, to: data.to });

    this.logger.debug(`Chat: ${senderId} → ${data.to}`);
  }

  @SubscribeMessage('chat:typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; bookingId?: string },
  ) {
    this.emitToUser(data.to, 'chat:typing', {
      from: client.data.user?.sub,
      bookingId: data.bookingId,
    });
  }

  // ─── Room Management ───────────────────────────────────

  @SubscribeMessage('room:join')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    client.join(data.room);
    this.logger.debug(`${client.id} joined room: ${data.room}`);
  }

  @SubscribeMessage('room:leave')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { room: string },
  ) {
    client.leave(data.room);
    this.logger.debug(`${client.id} left room: ${data.room}`);
  }

  // ─── Server-side Emit Helpers ──────────────────────────

  /** Emit to a specific user (all their connected devices) */
  emitToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /** Emit to a room */
  emitToRoom(room: string, event: string, data: any) {
    this.server.to(room).emit(event, data);
  }

  /** Broadcast to all connected clients */
  broadcast(event: string, data: any) {
    this.server.emit(event, data);
  }

  /** Emit a booking status change event */
  emitBookingUpdate(userId: string, booking: any) {
    this.emitToUser(userId, 'booking:updated', {
      bookingId: booking.id,
      status: booking.status,
      propertyId: booking.propertyId,
      timestamp: new Date().toISOString(),
    });
  }

  /** Emit a new notification event */
  emitNotification(userId: number, notification: any) {
    this.emitToUser(String(userId), 'notification:new', {
      id: notification.id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      actionUrl: notification.actionUrl,
      timestamp: new Date().toISOString(),
    });
  }

  /** Check if a user is online */
  isUserOnline(userId: string): boolean {
    return this.userSockets.has(userId) && this.userSockets.get(userId).size > 0;
  }

  /** Get count of online users */
  getOnlineCount(): number {
    return this.userSockets.size;
  }
}

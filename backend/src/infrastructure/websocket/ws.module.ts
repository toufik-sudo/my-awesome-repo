import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EventsGateway } from './events.gateway';
import { WsAuthMiddleware } from './ws-auth.middleware';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'hohoino_bibib!ohi6156445616489745644897456464897',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [EventsGateway, WsAuthMiddleware],
  exports: [EventsGateway],
})
export class WsModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth.module';
import { RolesGuard } from './auth/roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwtAuth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { UserModule } from './user/modules/user.module';
import { RolesModule } from './user/modules/roles.module';
import { CsrfModule } from '@tekuconcept/nestjs-csrf';
import { CustomCsrfInterceptor } from './services/interceptors/custom.csrf.interceptor';
import typeorm from './config/typeorm';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { AppService } from './app.service';
import { NotificationModule } from './notification/modules/notification.module';
import { SSOModule } from './sso/modules/sso.module';
import { SsoEnabledGuard } from './sso/guards/sso-enabled.guard';
import { CommentsModule } from './comments/modules/comments.module';
import { ReactionsModule } from './reactions/modules/reactions.module';
import { RankingsModule } from './rankings/modules/rankings.module';
import { PropertiesModule } from './properties/modules/properties.module';
import { BookingsModule } from './bookings/modules/bookings.module';
import { ReviewsModule } from './reviews/modules/reviews.module';
import { ProfilesModule } from './profiles/modules/profiles.module';
import { FavoritesModule } from './favorites/modules/favorites.module';
import { DashboardModule } from './modules/dashboard.module';
import { PaymentsModule } from './payments/payments.module';
import { SettingsModule } from './settings/modules/settings.module';
import { SupportChatModule } from './support-chat/modules/support-chat.module';
import { TourismServicesModule } from './services/modules/tourism-services.module';
import { PointsModule } from './modules/points/points.module';
import ssoConfig from './sso/config/sso.config';
import { RedisModule } from './infrastructure/redis';
import { JobsModule } from './infrastructure/jobs';
import { WsModule } from './infrastructure/websocket';
import { ObservabilityModule } from './infrastructure/observability';
import { MailerModule } from './infrastructure/mailer';
import { EmailTrackingModule } from './infrastructure/email-tracking';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [typeorm, ssoConfig],
    }),
    CsrfModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'fr-FR',
        loaderOptions: {
          path: 'src/i18n/',
          watch: true,
        },
      }),
      resolvers: [new HeaderResolver(['x-custom-lang'])],
    }),
    // Infrastructure
    RedisModule,
    JobsModule,
    WsModule,
    ObservabilityModule,
    MailerModule,
    EmailTrackingModule,
    // Domain
    UserModule,
    RolesModule,
    AuthModule,
    NotificationModule,
    SSOModule,
    CommentsModule,
    ReactionsModule,
    RankingsModule,
    PropertiesModule,
    BookingsModule,
    ReviewsModule,
    ProfilesModule,
    FavoritesModule,
    DashboardModule,
    SettingsModule,
    PaymentsModule,
    SupportChatModule,
    TourismServicesModule,
    PointsModule,
  ],
  controllers: [AppController],
  providers: [
    // ⚠️ ORDER MATTERS: JwtAuthGuard MUST run before RolesGuard
    // so that request.user is populated when roles are checked.
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CustomCsrfInterceptor,
    AppService,
  ],
  exports: [TypeOrmModule, CustomCsrfInterceptor],
})
export class AppModule {}

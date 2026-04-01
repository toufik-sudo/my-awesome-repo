import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPoints, PointTransaction } from './entity/user-points.entity';
import { Badge, UserBadge } from './entity/badge.entity';
import { PointsService } from './services/points.service';
import { BadgeService } from './services/badge.service';
import { PointsController } from './controllers/points.controller';
import { BadgeController } from './controllers/badge.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserPoints, PointTransaction, Badge, UserBadge])],
  controllers: [PointsController, BadgeController],
  providers: [PointsService, BadgeService],
  exports: [PointsService, BadgeService],
})
export class PointsModule {}

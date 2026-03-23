import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ranking } from '../entity/ranking.entity';
import { RankingsController } from '../controllers/rankings.controller';
import { RankingsService } from '../services/rankings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ranking])],
  controllers: [RankingsController],
  providers: [RankingsService],
  exports: [RankingsService],
})
export class RankingsModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ranking } from '../entity/ranking.entity';

@Injectable()
export class RankingsService {
  constructor(
    @InjectRepository(Ranking)
    private readonly rankingRepo: Repository<Ranking>,
  ) {}

  async getRankings(category: string, page: number, limit: number) {
    const [items, total] = await this.rankingRepo.findAndCount({
      where: { category },
      order: { score: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((item, index) => ({
        ...item,
        rank: (page - 1) * limit + index + 1,
      })),
      total,
      page,
      limit,
    };
  }

  async getUserRank(userId: number, category: string) {
    const userRanking = await this.rankingRepo.findOne({ where: { userId, category } });
    if (!userRanking) return { rank: null, score: 0 };

    const higherCount = await this.rankingRepo
      .createQueryBuilder('r')
      .where('r.category = :category', { category })
      .andWhere('r.score > :score', { score: userRanking.score })
      .getCount();

    return {
      ...userRanking,
      rank: higherCount + 1,
    };
  }

  async updateScore(userId: number, category: string, scoreDelta: number) {
    let ranking = await this.rankingRepo.findOne({ where: { userId, category } });
    if (!ranking) {
      ranking = this.rankingRepo.create({ userId, category, score: 0 });
    }
    ranking.score += scoreDelta;
    return this.rankingRepo.save(ranking);
  }
}

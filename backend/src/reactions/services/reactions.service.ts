import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '../entity/reaction.entity';
import { CreateReactionDto } from '../dtos/reaction.dto';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepo: Repository<Reaction>,
  ) {}

  async getReactionSummary(targetType: string, targetId: string, currentUserId?: number) {
    const reactions = await this.reactionRepo.find({ where: { targetType, targetId } });

    const counts: Record<string, number> = {};
    let userReaction: string | undefined;

    reactions.forEach(r => {
      counts[r.type] = (counts[r.type] || 0) + 1;
      if (r.userId === currentUserId) userReaction = r.type;
    });

    return {
      counts,
      total: reactions.length,
      userReaction,
    };
  }

  async toggle(userId: number, dto: CreateReactionDto) {
    const existing = await this.reactionRepo.findOne({
      where: { userId, targetType: dto.targetType, targetId: dto.targetId },
    });

    if (existing) {
      if (existing.type === dto.type) {
        // Remove reaction (toggle off)
        await this.reactionRepo.remove(existing);
        return { action: 'removed' };
      }
      // Change reaction type
      existing.type = dto.type;
      await this.reactionRepo.save(existing);
      return { action: 'changed', type: dto.type };
    }

    // Add new reaction
    const reaction = this.reactionRepo.create({
      userId,
      type: dto.type,
      targetType: dto.targetType,
      targetId: dto.targetId,
    });
    await this.reactionRepo.save(reaction);
    return { action: 'added', type: dto.type };
  }

  async remove(userId: number, targetType: string, targetId: string): Promise<void> {
    await this.reactionRepo.delete({ userId, targetType, targetId });
  }
}

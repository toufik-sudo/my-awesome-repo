import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reaction } from '../entity/reaction.entity';
import { CreateReactionDto } from '../dtos/reaction.dto';
import { ScopeContext } from '../../rbac/scope-context';

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private readonly reactionRepo: Repository<Reaction>,
  ) {}

  async getReactionSummary(targetType: string, targetId: string, currentUserId?: number, _scopeCtx?: ScopeContext) {
    // Reactions are public data — no scope filtering needed
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

  async toggle(userId: number, dto: CreateReactionDto, scopeCtx?: ScopeContext) {
    // Enforce own-user: can only react as yourself
    if (scopeCtx && scopeCtx.userId !== userId) {
      throw new ForbiddenException('Cannot react as another user');
    }
    const existing = await this.reactionRepo.findOne({
      where: { userId, targetType: dto.targetType, targetId: dto.targetId },
    });

    if (existing) {
      if (existing.type === dto.type) {
        await this.reactionRepo.remove(existing);
        return { action: 'removed' };
      }
      existing.type = dto.type;
      await this.reactionRepo.save(existing);
      return { action: 'changed', type: dto.type };
    }

    const reaction = this.reactionRepo.create({
      userId,
      type: dto.type,
      targetType: dto.targetType,
      targetId: dto.targetId,
    });
    await this.reactionRepo.save(reaction);
    return { action: 'added', type: dto.type };
  }

  async remove(userId: number, targetType: string, targetId: string, scopeCtx?: ScopeContext): Promise<void> {
    if (scopeCtx && scopeCtx.userId !== userId) {
      throw new ForbiddenException('Cannot remove reaction for another user');
    }
    await this.reactionRepo.delete({ userId, targetType, targetId });
  }
}

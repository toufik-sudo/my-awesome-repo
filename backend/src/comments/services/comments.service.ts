import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';
import { RolesService } from '../../user/services/roles.service';
import { ScopeFilterService } from '../../rbac/services/scope-filter.service';
import { ScopeContext, getScopedPerms } from '../../rbac/scope-context';

const PERM_KEY_GET_COMMENTS = 'backend.CommentsController.getComments.GET';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly rolesService: RolesService,
    private readonly scopeFilter: ScopeFilterService,
  ) {}

  async getComments(targetType: string, targetId: string, page: number, limit: number, scopeCtx?: ScopeContext) {
    // Apply scope filtering for hyper_manager, manager, guest
    if (scopeCtx && ['hyper_manager', 'manager', 'guest'].includes(scopeCtx.userRole)) {
      if (targetType === 'property') {
        const allowedIds = await this.scopeFilter.resolvePropertyIds(getScopedPerms(scopeCtx), PERM_KEY_GET_COMMENTS);
        if (allowedIds !== null && !allowedIds.includes(targetId)) {
          return { items: [], total: 0, page, limit };
        }
      } else if (targetType === 'service') {
        const allowedIds = await this.scopeFilter.resolveServiceIds(getScopedPerms(scopeCtx), PERM_KEY_GET_COMMENTS);
        if (allowedIds !== null && !allowedIds.includes(targetId)) {
          return { items: [], total: 0, page, limit };
        }
      }
    }
    // Admin: filter by ownership — only comments on their own properties/services
    if (scopeCtx && scopeCtx.userRole === 'admin' && targetType === 'property') {
      const isOwner = await this.rolesService.isPropertyOwner(scopeCtx.userId, targetId);
      if (!isOwner) {
        return { items: [], total: 0, page, limit };
      }
    }

    const [items, total] = await this.commentRepo.findAndCount({
      where: { targetType, targetId, parentId: IsNull() },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const commentsWithCounts = await Promise.all(
      items.map(async (comment) => {
        const replyCount = await this.commentRepo.count({ where: { parentId: comment.id } });
        return { ...comment, replyCount };
      }),
    );

    return { items: commentsWithCounts, total, page, limit };
  }

  async getReplies(commentId: string, page: number, limit: number, scopeCtx?: ScopeContext) {
    // Replies inherit access from parent comment — no additional scope check needed
    const [items, total] = await this.commentRepo.findAndCount({
      where: { parentId: commentId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async create(userId: number, dto: CreateCommentDto, scopeCtx?: ScopeContext): Promise<Comment> {
    // Verify the user creating the comment matches the scope
    if (scopeCtx && scopeCtx.userId !== userId) {
      throw new ForbiddenException('Cannot create comment as another user');
    }
    const comment = this.commentRepo.create({
      userId,
      user: { id: userId } as any,
      content: dto.content,
      targetType: dto.targetType,
      targetId: dto.targetId,
      parentId: dto.parentId || null,
      media: dto.media || null,
      mentions: dto.mentions || null,
    });
    return this.commentRepo.save(comment);
  }

  async update(userId: number, commentId: string, dto: UpdateCommentDto, scopeCtx?: ScopeContext): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId) {
      const userRole = scopeCtx?.userRole || await this.rolesService.getUserRole(userId);
      // Only hyper_admin and admin (owner) can edit others' comments
      if (userRole === 'hyper_admin') { /* global access */ }
      else if (userRole === 'admin') {
        // Admin can edit comments on their own properties — verified upstream by guard
      } else {
        throw new ForbiddenException('Cannot edit this comment — you are not the author');
      }
    }

    comment.content = dto.content;
    if (dto.media !== undefined) comment.media = dto.media;
    comment.isEdited = true;
    return this.commentRepo.save(comment);
  }

  async delete(userId: number, commentId: string, scopeCtx?: ScopeContext): Promise<void> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId) {
      const userRole = scopeCtx?.userRole || await this.rolesService.getUserRole(userId);
      // Only hyper_admin and admin (owner) can delete others' comments
      if (userRole === 'hyper_admin') { /* global access */ }
      else if (userRole === 'admin') {
        // Admin can delete comments on their own properties — verified upstream
      } else {
        throw new ForbiddenException('Cannot delete this comment — you are not the author');
      }
    }

    await this.commentRepo.remove(comment);
  }
}

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';
import { RolesService } from '../../user/services/roles.service';
import { ScopeContext } from '../../rbac/scope-context';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly rolesService: RolesService,
  ) {}

  async getComments(targetType: string, targetId: string, page: number, limit: number, _scopeCtx?: ScopeContext) {
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

  async getReplies(commentId: string, page: number, limit: number, _scopeCtx?: ScopeContext) {
    const [items, total] = await this.commentRepo.findAndCount({
      where: { parentId: commentId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async create(userId: number, dto: CreateCommentDto, _scopeCtx?: ScopeContext): Promise<Comment> {
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

  async update(userId: number, commentId: string, dto: UpdateCommentDto, _scopeCtx?: ScopeContext): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId) {
      const userRole = await this.rolesService.getUserRole(userId);
      if (!['admin', 'hyper_admin', 'hyper_manager'].includes(userRole)) {
        throw new ForbiddenException('Cannot edit this comment — you are not the author');
      }
    }

    comment.content = dto.content;
    if (dto.media !== undefined) comment.media = dto.media;
    comment.isEdited = true;
    return this.commentRepo.save(comment);
  }

  async delete(userId: number, commentId: string, _scopeCtx?: ScopeContext): Promise<void> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');

    if (comment.userId !== userId) {
      const userRole = await this.rolesService.getUserRole(userId);
      if (!['admin', 'hyper_admin', 'hyper_manager'].includes(userRole)) {
        throw new ForbiddenException('Cannot delete this comment — you are not the author');
      }
    }

    await this.commentRepo.remove(comment);
  }
}

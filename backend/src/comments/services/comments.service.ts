import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Comment } from '../entity/comment.entity';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) {}

  async getComments(targetType: string, targetId: string, page: number, limit: number) {
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

  async getReplies(commentId: string, page: number, limit: number) {
    const [items, total] = await this.commentRepo.findAndCount({
      where: { parentId: commentId },
      relations: ['user'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { items, total, page, limit };
  }

  async create(userId: number, dto: CreateCommentDto): Promise<Comment> {
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

  async update(userId: number, commentId: string, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Cannot edit this comment');

    comment.content = dto.content;
    if (dto.media !== undefined) comment.media = dto.media;
    comment.isEdited = true;
    return this.commentRepo.save(comment);
  }

  async delete(userId: number, commentId: string): Promise<void> {
    const comment = await this.commentRepo.findOne({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.userId !== userId) throw new ForbiddenException('Cannot delete this comment');
    await this.commentRepo.remove(comment);
  }
}

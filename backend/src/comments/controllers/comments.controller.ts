import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Request, UseInterceptors, UploadedFiles, Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';

@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':targetType/:targetId')
  async getComments(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.commentsService.getComments(targetType, targetId, page, limit);
  }

  @Get(':commentId/replies')
  async getReplies(
    @Param('commentId') commentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.commentsService.getReplies(commentId, page, limit);
  }

  @Post()
  async createComment(@Request() req, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(req.user.id, dto);
  }

  @Put(':id')
  async updateComment(@Request() req, @Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  async deleteComment(@Request() req, @Param('id') id: string) {
    return this.commentsService.delete(req.user.id, id);
  }
}

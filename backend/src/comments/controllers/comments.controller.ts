import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
@Controller('comments')
@UseGuards(PermissionGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':targetType/:targetId')
  @ApiOperation({ summary: 'Get comments for a target' })
  async getComments(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.commentsService.getComments(targetType, targetId, page, limit);
  }

  @Get(':commentId/replies')
  @ApiOperation({ summary: 'Get replies for a comment' })
  async getReplies(
    @Param('commentId') commentId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.commentsService.getReplies(commentId, page, limit);
  }

  @Post()
  @ApiOperation({ summary: 'Create a comment' })
  async createComment(@Request() req, @Body() dto: CreateCommentDto) {
    return this.commentsService.create(req.user.id, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update own comment' })
  async updateComment(@Request() req, @Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete own comment' })
  async deleteComment(@Request() req, @Param('id') id: string) {
    return this.commentsService.delete(req.user.id, id);
  }
}

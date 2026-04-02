import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards, Request, UseInterceptors, UploadedFiles, Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';

@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
@Controller('comments')
@UseGuards(AuthGuard('jwt'))
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':targetType/:targetId')
  @ApiOperation({ summary: 'Get comments for a target', description: 'Get comments on a property, service, or post.' })
  @ApiParam({ name: 'targetType', enum: ['property', 'service', 'post'] })
  @ApiParam({ name: 'targetId', type: 'string' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async getComments(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    return this.commentsService.getComments(targetType, targetId, page, limit);
  }

  @Get(':commentId/replies')
  @ApiOperation({ summary: 'Get replies to a comment' })
  @ApiParam({ name: 'commentId', format: 'uuid' })
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
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async updateComment(@Request() req, @Param('id') id: string, @Body() dto: UpdateCommentDto) {
    return this.commentsService.update(req.user.id, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async deleteComment(@Request() req, @Param('id') id: string) {
    return this.commentsService.delete(req.user.id, id);
  }
}

import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CommentsService } from '../services/comments.service';
import { CreateCommentDto, UpdateCommentDto } from '../dtos/comment.dto';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Comments')
@ApiBearerAuth('JWT-auth')
@Controller('comments')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':targetType/:targetId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get comments for a target' })
  async getComments(@Request() req: any, @Param('targetType') targetType: string, @Param('targetId') targetId: string, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    const scopeCtx = extractScopeContext(req);
    return this.commentsService.getComments(targetType, targetId, page, limit, scopeCtx);
  }

  @Get(':commentId/replies')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get replies for a comment' })
  async getReplies(@Request() req: any, @Param('commentId') commentId: string, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    const scopeCtx = extractScopeContext(req);
    return this.commentsService.getReplies(commentId, page, limit, scopeCtx);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create a comment' })
  async createComment(@Request() req: any, @Body() dto: CreateCommentDto) {
    const scopeCtx = extractScopeContext(req);
    return this.commentsService.create(req.user.id, dto, scopeCtx);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update own comment' })
  async updateComment(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateCommentDto) {
    const scopeCtx = extractScopeContext(req);
    return this.commentsService.update(req.user.id, id, dto, scopeCtx);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete own comment' })
  async deleteComment(@Request() req: any, @Param('id') id: string) {
    const scopeCtx = extractScopeContext(req);
    return this.commentsService.delete(req.user.id, id, scopeCtx);
  }
}

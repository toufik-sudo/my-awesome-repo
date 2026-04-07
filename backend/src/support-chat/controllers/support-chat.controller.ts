import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, UseInterceptors, Request, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SupportChatService } from '../services/support-chat.service';
import { CreateSupportThreadDto, SendSupportMessageDto, UpdateThreadStatusDto, AssignThreadDto } from '../dtos/support-chat.dto';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Support Chat')
@ApiBearerAuth('JWT-auth')
@Controller('support')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class SupportChatController {
  constructor(private readonly supportChatService: SupportChatService) {}

  @Post('threads')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create support thread' })
  async createThread(@Request() req: any, @Body() dto: CreateSupportThreadDto) {
    const scopeCtx = extractScopeContext(req);
    return this.supportChatService.createThread(req.user.sub, req.user.role || 'guest', dto, scopeCtx);
  }

  @Get('threads/mine')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my support threads' })
  async getMyThreads(@Request() req: any, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number) {
    const scopeCtx = extractScopeContext(req);
    return this.supportChatService.getUserThreads(req.user.sub, page, limit, scopeCtx);
  }

  @Get('threads')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get all support threads (admin+)' })
  async getAdminThreads(@Request() req: any, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number, @Query('status') status?: string, @Query('category') category?: string) {
    const scopeCtx = extractScopeContext(req);
    return this.supportChatService.getAdminThreads(req.user.sub, req.user.role || 'user', page, limit, status, category, scopeCtx);
  }

  @Get('threads/:threadId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get thread details' })
  async getThread(@Request() req: any, @Param('threadId') threadId: string) {
    const scopeCtx = extractScopeContext(req);
    return this.supportChatService.getThreadById(threadId, req.user.sub, req.user.role || 'user', scopeCtx);
  }

  @Get('threads/:threadId/messages')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get thread messages' })
  async getMessages(@Request() req: any, @Param('threadId') threadId: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number) {
    const scopeCtx = extractScopeContext(req);
    return this.supportChatService.getMessages(threadId, req.user.sub, req.user.role || 'user', page, limit, scopeCtx);
  }

  @Post('threads/:threadId/messages')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Send message in thread' })
  async sendMessage(@Request() req: any, @Param('threadId') threadId: string, @Body() dto: SendSupportMessageDto) {
    const scopeCtx = extractScopeContext(req);
    return this.supportChatService.sendMessage(threadId, req.user.sub, req.user.role || 'guest', dto, scopeCtx);
  }

  @Patch('threads/:threadId/status')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update thread status (admin+)' })
  async updateStatus(@Request() req: any, @Param('threadId') threadId: string, @Body() dto: UpdateThreadStatusDto) {
    const scopeCtx = extractScopeContext(req);
    return this.supportChatService.updateStatus(threadId, dto.status, scopeCtx);
  }

  @Patch('threads/:threadId/assign')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Assign thread to admin (hyper only)' })
  async assignThread(@Request() req: any, @Param('threadId') threadId: string, @Body() dto: AssignThreadDto) {
    const scopeCtx = extractScopeContext(req);
    return this.supportChatService.assignThread(threadId, dto.adminId, scopeCtx);
  }

  @Post('threads/:threadId/read')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Mark thread as read' })
  async markRead(@Request() req: any, @Param('threadId') threadId: string) {
    const scopeCtx = extractScopeContext(req);
    const isAdmin = ['hyper_admin', 'hyper_manager', 'admin'].includes(req.user.role || '');
    return this.supportChatService.markRead(threadId, req.user.sub, isAdmin, scopeCtx);
  }
}

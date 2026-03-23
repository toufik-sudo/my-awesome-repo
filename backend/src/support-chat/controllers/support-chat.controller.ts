import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, Request, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { SupportChatService } from '../services/support-chat.service';
import { CreateSupportThreadDto, SendSupportMessageDto, UpdateThreadStatusDto, AssignThreadDto } from '../dtos/support-chat.dto';
import { RequireRole } from '../../auth/decorators/require-role.decorator';

@Controller('support')
export class SupportChatController {
  constructor(private readonly supportChatService: SupportChatService) {}

  /** Create a new support thread (any authenticated user) */
  @Post('threads')
  async createThread(@Request() req, @Body() dto: CreateSupportThreadDto) {
    const userRole = req.user.roles?.[0] || 'guest';
    return this.supportChatService.createThread(req.user.sub, userRole, dto);
  }

  /** Get my support threads (user view) */
  @Get('threads/mine')
  async getMyThreads(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.supportChatService.getUserThreads(req.user.sub, page, limit);
  }

  /** Admin inbox - all threads */
  @Get('threads')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any, 'admin' as any)
  async getAdminThreads(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.supportChatService.getAdminThreads(page, limit, status, category);
  }

  /** Get a specific thread */
  @Get('threads/:threadId')
  async getThread(@Request() req, @Param('threadId') threadId: string) {
    return this.supportChatService.getThreadById(threadId, req.user.sub);
  }

  /** Get messages for a thread */
  @Get('threads/:threadId/messages')
  async getMessages(
    @Request() req,
    @Param('threadId') threadId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.supportChatService.getMessages(threadId, req.user.sub, page, limit);
  }

  /** Send a message in a thread */
  @Post('threads/:threadId/messages')
  async sendMessage(
    @Request() req,
    @Param('threadId') threadId: string,
    @Body() dto: SendSupportMessageDto,
  ) {
    const userRole = req.user.roles?.[0] || 'guest';
    return this.supportChatService.sendMessage(threadId, req.user.sub, userRole, dto);
  }

  /** Update thread status (admin only) */
  @Patch('threads/:threadId/status')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any, 'admin' as any)
  async updateStatus(
    @Param('threadId') threadId: string,
    @Body() dto: UpdateThreadStatusDto,
  ) {
    return this.supportChatService.updateStatus(threadId, dto.status);
  }

  /** Assign admin to thread */
  @Patch('threads/:threadId/assign')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  async assignThread(
    @Param('threadId') threadId: string,
    @Body() dto: AssignThreadDto,
  ) {
    return this.supportChatService.assignThread(threadId, dto.adminId);
  }

  /** Mark thread as read */
  @Post('threads/:threadId/read')
  async markRead(@Request() req, @Param('threadId') threadId: string) {
    const isAdmin = req.user.roles?.some((r: string) =>
      ['hyper_admin', 'hyper_manager', 'admin'].includes(r),
    );
    return this.supportChatService.markRead(threadId, req.user.sub, isAdmin);
  }
}

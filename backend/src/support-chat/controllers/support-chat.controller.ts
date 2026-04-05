import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, Request, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { SupportChatService } from '../services/support-chat.service';
import { CreateSupportThreadDto, SendSupportMessageDto, UpdateThreadStatusDto, AssignThreadDto } from '../dtos/support-chat.dto';
import { RequireRole } from '../../auth/decorators/require-role.decorator';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Support Chat')
@ApiBearerAuth('JWT-auth')
@Controller('support')
@UseGuards(PermissionGuard)
export class SupportChatController {
  constructor(private readonly supportChatService: SupportChatService) {}

  /** Create a new support thread (any authenticated user) */
  @Post('threads')
  @ApiOperation({ summary: 'Create support thread' })
  async createThread(@Request() req, @Body() dto: CreateSupportThreadDto) {
    const userRole = req.user.role || 'guest';
    return this.supportChatService.createThread(req.user.sub, userRole, dto);
  }

  /** Get my support threads (user view) */
  @Get('threads/mine')
  @ApiOperation({ summary: 'Get my support threads' })
  async getMyThreads(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.supportChatService.getUserThreads(req.user.sub, page, limit);
  }

  /** Admin inbox - all threads (scoped by role) */
  @Get('threads')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any, 'admin' as any, 'manager' as any)
  @ApiOperation({ summary: 'Get all support threads (admin+, scoped)' })
  async getAdminThreads(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    const userRole = req.user.role || 'user';
    return this.supportChatService.getAdminThreads(req.user.sub, userRole, page, limit, status, category);
  }

  /** Get a specific thread (scoped) */
  @Get('threads/:threadId')
  @ApiOperation({ summary: 'Get thread details' })
  async getThread(@Request() req, @Param('threadId') threadId: string) {
    const userRole = req.user.role || 'user';
    return this.supportChatService.getThreadById(threadId, req.user.sub, userRole);
  }

  /** Get messages for a thread (scoped) */
  @Get('threads/:threadId/messages')
  @ApiOperation({ summary: 'Get thread messages' })
  async getMessages(
    @Request() req,
    @Param('threadId') threadId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    const userRole = req.user.role || 'user';
    return this.supportChatService.getMessages(threadId, req.user.sub, userRole, page, limit);
  }

  /** Send a message in a thread */
  @Post('threads/:threadId/messages')
  @ApiOperation({ summary: 'Send message in thread' })
  async sendMessage(
    @Request() req,
    @Param('threadId') threadId: string,
    @Body() dto: SendSupportMessageDto,
  ) {
    const userRole = req.user.role || 'guest';
    return this.supportChatService.sendMessage(threadId, req.user.sub, userRole, dto);
  }

  /** Update thread status (admin only) */
  @Patch('threads/:threadId/status')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any, 'admin' as any)
  @ApiOperation({ summary: 'Update thread status (admin+)' })
  async updateStatus(
    @Param('threadId') threadId: string,
    @Body() dto: UpdateThreadStatusDto,
  ) {
    return this.supportChatService.updateStatus(threadId, dto.status);
  }

  /** Assign admin to thread */
  @Patch('threads/:threadId/assign')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Assign thread to admin (hyper only)' })
  async assignThread(
    @Param('threadId') threadId: string,
    @Body() dto: AssignThreadDto,
  ) {
    return this.supportChatService.assignThread(threadId, dto.adminId);
  }

  /** Mark thread as read */
  @Post('threads/:threadId/read')
  @ApiOperation({ summary: 'Mark thread as read' })
  async markRead(@Request() req, @Param('threadId') threadId: string) {
    const isAdmin = ['hyper_admin', 'hyper_manager', 'admin'].includes(req.user.role || '');
    return this.supportChatService.markRead(threadId, req.user.sub, isAdmin);
  }
}

import {
  Controller, Get, Post, Patch, Param, Body, Query,
  UseGuards, Request, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { SupportChatService } from '../services/support-chat.service';
import { CreateSupportThreadDto, SendSupportMessageDto, UpdateThreadStatusDto, AssignThreadDto } from '../dtos/support-chat.dto';
import { RequireRole } from '../../auth/decorators/require-role.decorator';

@ApiTags('Support')
@ApiBearerAuth('JWT-auth')
@Controller('support')
export class SupportChatController {
  constructor(private readonly supportChatService: SupportChatService) {}

  @Post('threads')
  @ApiOperation({ summary: 'Create support thread', description: 'Any authenticated user can create a support request.' })
  async createThread(@Request() req, @Body() dto: CreateSupportThreadDto) {
    const userRole = req.user.roles?.[0] || 'guest';
    return this.supportChatService.createThread(req.user.sub, userRole, dto);
  }

  @Get('threads/mine')
  @ApiOperation({ summary: 'Get my support threads' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async getMyThreads(
    @Request() req,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.supportChatService.getUserThreads(req.user.sub, page, limit);
  }

  @Get('threads')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any, 'admin' as any)
  @ApiOperation({ summary: 'Admin inbox — all threads', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  @ApiQuery({ name: 'status', required: false, enum: ['open', 'in_progress', 'resolved', 'closed'] })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async getAdminThreads(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('category') category?: string,
  ) {
    return this.supportChatService.getAdminThreads(page, limit, status, category);
  }

  @Get('threads/:threadId')
  @ApiOperation({ summary: 'Get a specific thread' })
  @ApiParam({ name: 'threadId', format: 'uuid' })
  async getThread(@Request() req, @Param('threadId') threadId: string) {
    return this.supportChatService.getThreadById(threadId, req.user.sub);
  }

  @Get('threads/:threadId/messages')
  @ApiOperation({ summary: 'Get messages in thread' })
  @ApiParam({ name: 'threadId', format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, type: 'number' })
  @ApiQuery({ name: 'limit', required: false, type: 'number' })
  async getMessages(
    @Request() req,
    @Param('threadId') threadId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ) {
    return this.supportChatService.getMessages(threadId, req.user.sub, page, limit);
  }

  @Post('threads/:threadId/messages')
  @ApiOperation({ summary: 'Send message in thread' })
  @ApiParam({ name: 'threadId', format: 'uuid' })
  async sendMessage(
    @Request() req,
    @Param('threadId') threadId: string,
    @Body() dto: SendSupportMessageDto,
  ) {
    const userRole = req.user.roles?.[0] || 'guest';
    return this.supportChatService.sendMessage(threadId, req.user.sub, userRole, dto);
  }

  @Patch('threads/:threadId/status')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any, 'admin' as any)
  @ApiOperation({ summary: 'Update thread status', description: '**Roles**: hyper_admin, hyper_manager, admin' })
  @ApiParam({ name: 'threadId', format: 'uuid' })
  async updateStatus(@Param('threadId') threadId: string, @Body() dto: UpdateThreadStatusDto) {
    return this.supportChatService.updateStatus(threadId, dto.status);
  }

  @Patch('threads/:threadId/assign')
  @RequireRole('hyper_admin' as any, 'hyper_manager' as any)
  @ApiOperation({ summary: 'Assign admin to thread', description: '**Roles**: hyper_admin, hyper_manager' })
  @ApiParam({ name: 'threadId', format: 'uuid' })
  async assignThread(@Param('threadId') threadId: string, @Body() dto: AssignThreadDto) {
    return this.supportChatService.assignThread(threadId, dto.adminId);
  }

  @Post('threads/:threadId/read')
  @ApiOperation({ summary: 'Mark thread as read' })
  @ApiParam({ name: 'threadId', format: 'uuid' })
  async markRead(@Request() req, @Param('threadId') threadId: string) {
    const isAdmin = req.user.roles?.some((r: string) =>
      ['hyper_admin', 'hyper_manager', 'admin'].includes(r),
    );
    return this.supportChatService.markRead(threadId, req.user.sub, isAdmin);
  }
}

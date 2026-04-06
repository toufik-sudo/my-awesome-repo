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
  async createThread(@Request() req, @Body() dto: CreateSupportThreadDto) {
    return this.supportChatService.createThread(req.user.sub, req.user.role || 'guest', dto);
  }

  @Get('threads/mine')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my support threads' })
  async getMyThreads(@Request() req, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number) {
    return this.supportChatService.getUserThreads(req.user.sub, page, limit);
  }

  @Get('threads')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get all support threads (admin+)' })
  async getAdminThreads(@Request() req, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number, @Query('status') status?: string, @Query('category') category?: string) {
    return this.supportChatService.getAdminThreads(req.user.sub, req.user.role || 'user', page, limit, status, category);
  }

  @Get('threads/:threadId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get thread details' })
  async getThread(@Request() req, @Param('threadId') threadId: string) {
    return this.supportChatService.getThreadById(threadId, req.user.sub, req.user.role || 'user');
  }

  @Get('threads/:threadId/messages')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get thread messages' })
  async getMessages(@Request() req, @Param('threadId') threadId: string, @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number, @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number) {
    return this.supportChatService.getMessages(threadId, req.user.sub, req.user.role || 'user', page, limit);
  }

  @Post('threads/:threadId/messages')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Send message in thread' })
  async sendMessage(@Request() req, @Param('threadId') threadId: string, @Body() dto: SendSupportMessageDto) {
    return this.supportChatService.sendMessage(threadId, req.user.sub, req.user.role || 'guest', dto);
  }

  @Patch('threads/:threadId/status')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update thread status (admin+)' })
  async updateStatus(@Param('threadId') threadId: string, @Body() dto: UpdateThreadStatusDto) {
    return this.supportChatService.updateStatus(threadId, dto.status);
  }

  @Patch('threads/:threadId/assign')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Assign thread to admin (hyper only)' })
  async assignThread(@Param('threadId') threadId: string, @Body() dto: AssignThreadDto) {
    return this.supportChatService.assignThread(threadId, dto.adminId);
  }

  @Post('threads/:threadId/read')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Mark thread as read' })
  async markRead(@Request() req, @Param('threadId') threadId: string) {
    const isAdmin = ['hyper_admin', 'hyper_manager', 'admin'].includes(req.user.role || '');
    return this.supportChatService.markRead(threadId, req.user.sub, isAdmin);
  }
}

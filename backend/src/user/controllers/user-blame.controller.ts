import {
  Controller, Get, Post, Delete, Param, Body, Query, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { UserBlameService } from '../services/user-blame.service';
import { extractScopeContext } from '../../rbac/scope-context';

@Controller('user-blames')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class UserBlameController {
  constructor(private readonly service: UserBlameService) {}

  /** Public per-user badge data (active blames only). */
  @Get('user/:userId/public')
  @CsrfGenAuth()
  @CsrfCheck(true)
  async getPublic(@Param('userId') userId: string) {
    const list = await this.service.listForUser(Number(userId), false);
    return {
      count: list.length,
      isNonSerious: list.length > 0,
      blames: list.map((b) => ({ id: b.id, type: b.type, createdAt: b.createdAt })),
    };
  }

  /** Bulk active counts: ?ids=1,2,3 */
  @Get('counts')
  @CsrfGenAuth()
  @CsrfCheck(true)
  getCounts(@Query('ids') ids: string) {
    const userIds = (ids || '')
      .split(',').map((s) => Number(s.trim())).filter((n) => Number.isFinite(n));
    return this.service.getActiveCountsBulk(userIds);
  }

  /** My blames (current user). */
  @Get('me')
  @CsrfGenAuth()
  @CsrfCheck(true)
  myBlames(@Request() req: any) {
    return this.service.listForUser(req.user.id, true);
  }

  /** Hyper admin/manager: list all blames with filters. */
  @Get()
  @CsrfGenAuth()
  @CsrfCheck(true)
  list(
    @Request() req: any,
    @Query('userId') userId?: string,
    @Query('type') type?: any,
    @Query('active') active?: string,
  ) {
    const ctx = extractScopeContext(req);
    if (!['hyper_admin', 'hyper_manager'].includes(ctx?.userRole)) {
      return [];
    }
    return this.service.listAll({
      userId: userId ? Number(userId) : undefined,
      type,
      active: active == null ? undefined : active === 'true',
    });
  }

  /** Hyper admin/manager: remove a blame after support contact. */
  @Delete(':id')
  @CsrfGenAuth()
  @CsrfCheck(true)
  remove(@Param('id') id: string, @Body('note') note: string, @Request() req: any) {
    const ctx = extractScopeContext(req);
    return this.service.removeBlame(id, req.user.id, ctx?.userRole, note);
  }

  /** Hyper admin/manager: manually issue a blame. */
  @Post()
  @CsrfGenAuth()
  @CsrfCheck(true)
  create(
    @Body() dto: { userId: number; type: any; reason: string; bookingRef?: string },
    @Request() req: any,
  ) {
    const ctx = extractScopeContext(req);
    if (!['hyper_admin', 'hyper_manager'].includes(ctx?.userRole)) {
      return { error: 'forbidden' };
    }
    return this.service.createBlame({
      userId: dto.userId,
      type: dto.type,
      reason: dto.reason,
      bookingRef: dto.bookingRef,
      createdByUserId: req.user.id,
    });
  }
}

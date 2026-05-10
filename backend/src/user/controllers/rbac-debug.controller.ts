import {
  Controller,
  Get,
  Post,
  Query,
  Delete,
  UseGuards,
  UseInterceptors,
  Request,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import {
  PermissionTraceService,
  TraceResourceKind,
} from '../services/permission-trace.service';
import { scopeFallbackEventsStore } from '../../rbac/utils/scope-fallback-events.store';

@ApiTags('RBAC Debug')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
@Controller('rbac-debug')
export class RbacDebugController {
  constructor(private readonly trace: PermissionTraceService) {}

  /**
   * Permission trace — returns the full scope-resolution path for a given
   * (user, permissionKey, resourceKind[, resourceId]). Designed for ops
   * troubleshooting: shows which branch of the resolver fired, why, and
   * whether inviter-fallback was used.
   *
   * If `userId` is omitted, traces the currently authenticated caller —
   * handy from the frontend "why do I see this list?" debug panel.
   */
  @Get('trace')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Trace scope resolution for a user + resource (debug)' })
  @ApiQuery({ name: 'userId', required: false, type: Number })
  @ApiQuery({ name: 'permissionKey', required: true })
  @ApiQuery({ name: 'resourceKind', required: true, enum: ['property', 'service'] })
  @ApiQuery({ name: 'resourceId', required: false })
  async getTrace(
    @Request() req: any,
    @Query('permissionKey') permissionKey: string,
    @Query('resourceKind') resourceKind: TraceResourceKind,
    @Query('userId') userIdRaw?: string,
    @Query('resourceId') resourceId?: string,
  ) {
    if (!permissionKey) throw new BadRequestException('permissionKey is required');
    if (!resourceKind || !['property', 'service'].includes(resourceKind)) {
      throw new BadRequestException("resourceKind must be 'property' or 'service'");
    }
    const userId = userIdRaw ? Number(userIdRaw) : Number(req.user?.id);
    if (!Number.isFinite(userId)) throw new BadRequestException('userId is required');

    return this.trace.trace({
      userId,
      permissionKey,
      resourceKind,
      resourceId: resourceId ?? null,
    });
  }

  /**
   * List recent scope-fallback events (in-memory ring buffer).
   * Filterable by userId, role, permissionKey and resourceKind.
   */
  @Get('scope-fallbacks')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'List recent scope-fallback events (debug)' })
  async listFallbacks(
    @Query('userId') userId?: string,
    @Query('role') role?: string,
    @Query('permissionKey') permissionKey?: string,
    @Query('resourceKind') resourceKind?: 'property' | 'service',
    @Query('limit') limit?: string,
  ) {
    return {
      total: scopeFallbackEventsStore.size(),
      events: scopeFallbackEventsStore.list({
        userId: userId ? Number(userId) : undefined,
        role,
        permissionKey,
        resourceKind,
        limit: limit ? Number(limit) : undefined,
      }),
    };
  }

  @Delete('scope-fallbacks')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Clear the in-memory scope-fallback event buffer (debug)' })
  async clearFallbacks() {
    const cleared = scopeFallbackEventsStore.clear();
    return { success: true, cleared };
  }
}

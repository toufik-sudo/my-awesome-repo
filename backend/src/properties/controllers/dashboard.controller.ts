import { Controller, Get, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from '../../services/dashboard.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@Controller('dashboard')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get dashboard data for current user' })
  getDashboard(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.dashboardService.getDashboard(req.user.id, scopeCtx);
  }
}

import { Controller, Get, Put, Body, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProfilesService } from '../services/profiles.service';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

@ApiTags('Profiles')
@ApiBearerAuth('JWT-auth')
@Controller('profiles')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my profile' })
  findMyProfile(@Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.profilesService.findByUser(req.user.id, scopeCtx);
  }

  @Put('me')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update my profile' })
  updateMyProfile(@Request() req: any, @Body() updateDto: any) {
    const scopeCtx = extractScopeContext(req);
    return this.profilesService.update(req.user.id, updateDto, scopeCtx);
  }
}

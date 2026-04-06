import { Controller, Post, Get, Delete, Body, Param, UseGuards, UseInterceptors, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReactionsService } from '../services/reactions.service';
import { CreateReactionDto } from '../dtos/reaction.dto';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

@ApiTags('Reactions')
@ApiBearerAuth('JWT-auth')
@Controller('reactions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get(':targetType/:targetId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get reactions for a target' })
  async getReactions(@Param('targetType') targetType: string, @Param('targetId') targetId: string, @Request() req) {
    return this.reactionsService.getReactionSummary(targetType, targetId, req.user.id);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Toggle reaction' })
  async toggleReaction(@Request() req, @Body() dto: CreateReactionDto) {
    return this.reactionsService.toggle(req.user.id, dto);
  }

  @Delete(':targetType/:targetId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Remove own reaction' })
  async removeReaction(@Request() req, @Param('targetType') targetType: string, @Param('targetId') targetId: string) {
    return this.reactionsService.remove(req.user.id, targetType, targetId);
  }
}

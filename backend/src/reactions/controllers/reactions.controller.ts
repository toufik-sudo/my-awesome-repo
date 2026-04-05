import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReactionsService } from '../services/reactions.service';
import { CreateReactionDto } from '../dtos/reaction.dto';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Reactions')
@ApiBearerAuth('JWT-auth')
@Controller('reactions')
@UseGuards(PermissionGuard)
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get(':targetType/:targetId')
  @ApiOperation({ summary: 'Get reactions for a target' })
  async getReactions(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
    @Request() req,
  ) {
    return this.reactionsService.getReactionSummary(targetType, targetId, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Toggle reaction' })
  async toggleReaction(@Request() req, @Body() dto: CreateReactionDto) {
    return this.reactionsService.toggle(req.user.id, dto);
  }

  @Delete(':targetType/:targetId')
  @ApiOperation({ summary: 'Remove own reaction' })
  async removeReaction(
    @Request() req,
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
  ) {
    return this.reactionsService.remove(req.user.id, targetType, targetId);
  }
}

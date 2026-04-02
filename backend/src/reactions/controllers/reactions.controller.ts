import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ReactionsService } from '../services/reactions.service';
import { CreateReactionDto } from '../dtos/reaction.dto';

@ApiTags('Reactions')
@ApiBearerAuth('JWT-auth')
@Controller('reactions')
@UseGuards(AuthGuard('jwt'))
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get(':targetType/:targetId')
  @ApiOperation({ summary: 'Get reaction summary', description: 'Counts + user\'s own reaction for a target.' })
  @ApiParam({ name: 'targetType', enum: ['comment', 'post', 'property', 'review'] })
  @ApiParam({ name: 'targetId', type: 'string' })
  async getReactions(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
    @Request() req,
  ) {
    return this.reactionsService.getReactionSummary(targetType, targetId, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Toggle a reaction', description: 'Add or switch reaction type (like, love, haha, wow, sad, angry).' })
  async toggleReaction(@Request() req, @Body() dto: CreateReactionDto) {
    return this.reactionsService.toggle(req.user.id, dto);
  }

  @Delete(':targetType/:targetId')
  @ApiOperation({ summary: 'Remove reaction' })
  @ApiParam({ name: 'targetType', enum: ['comment', 'post', 'property', 'review'] })
  @ApiParam({ name: 'targetId', type: 'string' })
  async removeReaction(
    @Request() req,
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
  ) {
    return this.reactionsService.remove(req.user.id, targetType, targetId);
  }
}

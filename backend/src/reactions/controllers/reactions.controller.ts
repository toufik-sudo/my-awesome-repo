import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReactionsService } from '../services/reactions.service';
import { CreateReactionDto } from '../dtos/reaction.dto';

@Controller('reactions')
@UseGuards(AuthGuard('jwt'))
export class ReactionsController {
  constructor(private readonly reactionsService: ReactionsService) {}

  @Get(':targetType/:targetId')
  async getReactions(
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
    @Request() req,
  ) {
    return this.reactionsService.getReactionSummary(targetType, targetId, req.user.id);
  }

  @Post()
  async toggleReaction(@Request() req, @Body() dto: CreateReactionDto) {
    return this.reactionsService.toggle(req.user.id, dto);
  }

  @Delete(':targetType/:targetId')
  async removeReaction(
    @Request() req,
    @Param('targetType') targetType: string,
    @Param('targetId') targetId: string,
  ) {
    return this.reactionsService.remove(req.user.id, targetType, targetId);
  }
}

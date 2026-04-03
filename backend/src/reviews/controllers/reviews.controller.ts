import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { Public } from '../../auth/decorators/public.decorator';
import { RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@Controller('reviews')
@UseGuards(PermissionGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Public()
  @Get('property/:propertyId')
  findByProperty(@Param('propertyId') propertyId: string) {
    return this.reviewsService.findByProperty(propertyId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  create(@Body() createDto: any) {
    return this.reviewsService.create(createDto);
  }

  @Post(':id/reply')
  @RequirePermission('reply_reviews', 'propertyId', 'body')
  reply(
    @Param('id') id: string,
    @Body() body: { propertyId: string; reply: string },
  ) {
    // Delegate to service — reply logic
    return this.reviewsService.create({ ...body, id: id });
  }
}

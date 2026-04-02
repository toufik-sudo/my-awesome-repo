import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from '../services/reviews.service';
import { Public } from '../../auth/decorators/public.decorator';
import { RequirePermission } from '../../auth/decorators';
import { PermissionGuard } from '../../auth/guards/permission.guard';

@ApiTags('Reviews')
@ApiBearerAuth('JWT-auth')
@Controller('reviews')
@UseGuards(PermissionGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Public()
  @Get('property/:propertyId')
  @ApiOperation({ summary: 'Get property reviews', description: 'Public — list all reviews for a property.' })
  @ApiParam({ name: 'propertyId', format: 'uuid' })
  findByProperty(@Param('propertyId') propertyId: string) {
    return this.reviewsService.findByProperty(propertyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review details' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a review', description: 'Submit a review for a completed booking.' })
  create(@Body() createDto: any) {
    return this.reviewsService.create(createDto);
  }

  @Post(':id/reply')
  @RequirePermission('reply_reviews', 'propertyId', 'body')
  @ApiOperation({ summary: 'Reply to a review', description: '**Permission**: reply_reviews' })
  @ApiParam({ name: 'id', format: 'uuid' })
  reply(
    @Param('id') id: string,
    @Body() body: { propertyId: string; reply: string },
  ) {
    return this.reviewsService.create({ ...body, id: id });
  }
}

import { Controller, Get, Post, Param, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { Public } from '../../auth/decorators/public.decorator';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

@Controller('reviews')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Public()
  @Get('property/:propertyId')
  findByProperty(@Param('propertyId') propertyId: string) { return this.reviewsService.findByProperty(propertyId); }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  findOne(@Param('id') id: string) { return this.reviewsService.findOne(id); }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  create(@Body() createDto: any) { return this.reviewsService.create(createDto); }

  @Post(':id/reply')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  reply(@Param('id') id: string, @Body() body: { propertyId: string; reply: string }) {
    return this.reviewsService.create({ ...body, id });
  }
}

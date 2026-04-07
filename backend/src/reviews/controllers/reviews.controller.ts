import { Controller, Get, Post, Param, Body, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ReviewsService } from '../services/reviews.service';
import { Public } from '../../auth/decorators/public.decorator';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

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
  findOne(@Param('id') id: string, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.reviewsService.findOne(id, scopeCtx);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  create(@Body() createDto: any, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.reviewsService.create(createDto, scopeCtx);
  }

  @Post(':id/reply')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  reply(@Param('id') id: string, @Body() body: { propertyId: string; reply: string }, @Request() req: any) {
    const scopeCtx = extractScopeContext(req);
    return this.reviewsService.create({ ...body, id }, scopeCtx);
  }
}

import {
  Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RewardsService } from '../services/rewards.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { PointsService } from '../../modules/points/services/points.service';

@ApiTags('Rewards')
@ApiBearerAuth('JWT-auth')
@Controller('rewards')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class RewardsController {
  constructor(
    private readonly service: RewardsService,
    private readonly pointsService: PointsService,
  ) {}

  @Get('shop')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Browse rewards shop' })
  async getShop() {
    return this.service.getShopRewards();
  }

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get all rewards (admin)' })
  async getAll() {
    return this.service.getAll();
  }

  @Get(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get reward details' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async getById(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create a reward' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update a reward' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete a reward' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.service.remove(req.user.id, id);
    return { success: true };
  }

  @Post(':id/redeem')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Redeem a reward' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async redeem(@Request() req, @Param('id') id: string) {
    return this.service.redeem(req.user.id, id, this.pointsService);
  }

  @Get('me/redemptions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get my redemptions' })
  async getMyRedemptions(@Request() req) {
    return this.service.getUserRedemptions(req.user.id);
  }

  @Post('redemptions/:code/use')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Use a redemption code' })
  @ApiParam({ name: 'code', type: 'string' })
  async useRedemption(
    @Request() req,
    @Param('code') code: string,
    @Body() body: { referenceId?: string; referenceType?: string },
  ) {
    return this.service.useRedemption(req.user.id, code, body.referenceId, body.referenceType);
  }

  @Delete('redemptions/:id/cancel')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Cancel a redemption and refund points' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async cancelRedemption(@Request() req, @Param('id') id: string) {
    await this.service.cancelRedemption(req.user.id, id, this.pointsService);
    return { success: true };
  }

  @Get('admin/redemptions')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get all redemptions (admin)' })
  async getAllRedemptions() {
    return this.service.getAllRedemptions();
  }
}

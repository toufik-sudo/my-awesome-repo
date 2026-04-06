import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Request, UseGuards, UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { HostFeeAbsorptionService } from '../services/host-fee-absorption.service';
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';

@ApiTags('Host Fee Absorptions')
@ApiBearerAuth('JWT-auth')
@Controller('host-fee-absorptions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class HostFeeAbsorptionController {
  constructor(private readonly service: HostFeeAbsorptionService) {}

  @Get()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get absorption rules' })
  async getMyAbsorptions(@Request() req) {
    return this.service.getForHost(req.user.id);
  }

  @Get('host/:hostId')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Get absorption rules for a specific host' })
  async getForHost(@Param('hostId') hostId: string) {
    return this.service.getForHost(parseInt(hostId, 10));
  }

  @Post()
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Create absorption rule' })
  async create(@Request() req, @Body() body: any) {
    return this.service.create(req.user.id, body);
  }

  @Put(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Update absorption rule' })
  async update(@Request() req, @Param('id') id: string, @Body() body: any) {
    return this.service.update(req.user.id, id, body);
  }

  @Delete(':id')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @ApiOperation({ summary: 'Delete absorption rule' })
  async remove(@Request() req, @Param('id') id: string) {
    await this.service.remove(req.user.id, id);
    return { success: true };
  }
}

import { Controller, Get, Request } from '@nestjs/common';
import { DashboardService } from '../../services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  getDashboard(@Request() req: any) {
    return this.dashboardService.getDashboard(req.user.id);
  }
}

import { Controller, Get, Put, Param, Body } from '@nestjs/common';
import { ProfilesService } from '../services/profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get(':userId')
  findByUser(@Param('userId') userId: number) {
    return this.profilesService.findByUser(userId);
  }

  @Put(':userId')
  update(@Param('userId') userId: number, @Body() updateDto: any) {
    return this.profilesService.update(userId, updateDto);
  }
}

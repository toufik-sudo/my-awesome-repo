import { IsOptional, IsBoolean, IsString, Matches } from 'class-validator';

export class UpdateNotificationsDto {
  @IsOptional() @IsBoolean() emailNotifications?: boolean;
  @IsOptional() @IsBoolean() pushNotifications?: boolean;
  @IsOptional() @IsBoolean() marketingEmails?: boolean;
  @IsOptional() @IsBoolean() securityAlerts?: boolean;
  @IsOptional() @IsBoolean() weeklyDigest?: boolean;

  @IsOptional() @IsBoolean() commentReplies?: boolean;
  @IsOptional() @IsBoolean() commentRepliesPush?: boolean;
  @IsOptional() @IsBoolean() rankingUpdates?: boolean;
  @IsOptional() @IsBoolean() rankingUpdatesPush?: boolean;
  @IsOptional() @IsBoolean() newFollowers?: boolean;
  @IsOptional() @IsBoolean() newFollowersPush?: boolean;
  @IsOptional() @IsBoolean() systemAnnouncements?: boolean;
  @IsOptional() @IsBoolean() systemAnnouncementsPush?: boolean;

  @IsOptional() @IsBoolean() quietHoursEnabled?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Must be in HH:mm format' })
  quietHoursStart?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'Must be in HH:mm format' })
  quietHoursEnd?: string;
}

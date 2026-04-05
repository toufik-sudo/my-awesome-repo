import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Profile } from '../../profiles/entity/profile.entity';
import { JwtAuthGuard } from '../../auth/jwtAuth.guard';

const AVATAR_UPLOAD_DIR = './uploads/avatars';

if (!fs.existsSync(AVATAR_UPLOAD_DIR)) {
  fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });
}

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  @Put('language')
  async updateLanguage(@Request() req, @Body('language') language: string) {
    // Always use authenticated user's ID — no external userId accepted
    const userId = req.user.id;
    const profile = await this.getOrCreateProfile(userId);
    profile.preferredLanguage = language;
    await this.profileRepo.save(profile);
    return { message: 'Language updated', language };
  }

  @Post('avatar')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: AVATAR_UPLOAD_DIR,
        filename: (req, file, callback) => {
          const userId = (req as any).user?.id || 'unknown';
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `avatar-${userId}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return callback(
            new HttpException('Only image files are allowed', HttpStatus.BAD_REQUEST),
            false,
          );
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadAvatar(
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    // Always use authenticated user's ID — ignore any body userId
    const userId = req.user.id;
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    const profile = await this.getOrCreateProfile(userId);

    if (profile.avatarUrl) {
      const oldPath = `.${profile.avatarUrl}`;
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    profile.avatarUrl = avatarUrl;
    await this.profileRepo.save(profile);

    return { url: avatarUrl, message: 'Avatar uploaded successfully' };
  }

  @Delete('avatar')
  async deleteAvatar(@Request() req) {
    const profile = await this.profileRepo.findOne({ where: { userId: req.user.id } });
    if (profile?.avatarUrl) {
      const filePath = `.${profile.avatarUrl}`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      profile.avatarUrl = null;
      await this.profileRepo.save(profile);
    }
    return { message: 'Avatar removed' };
  }

  @Post('profile/complete')
  async completeProfile(@Request() req, @Body() profileData: Record<string, any>) {
    // Always use authenticated user's ID — ignore any body userId
    const userId = req.user.id;
    const profile = await this.getOrCreateProfile(userId);

    const allowedFields = [
      'displayName', 'bio', 'phoneNumber', 'city', 'wilaya',
      'country', 'languages', 'preferredLanguage', 'preferredCurrency',
    ];

    for (const field of allowedFields) {
      if (profileData[field] !== undefined) {
        profile[field] = profileData[field];
      }
    }

    await this.profileRepo.save(profile);
    return { message: 'Profile completed', profile };
  }

  /**
   * Get or create a profile for the user.
   * Sets both FK column and relation reference to prevent MySQL 'no default value' errors.
   */
  private async getOrCreateProfile(userId: number): Promise<Profile> {
    let profile = await this.profileRepo.findOne({ where: { userId } });

    if (!profile) {
      profile = new Profile();
      profile.userId = userId;
      profile = await this.profileRepo.save(profile);
    }

    return profile;
  }
}

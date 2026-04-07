import {
  Controller, Get, Put, Post, Delete, Body, Param, Request,
  UseGuards, UseInterceptors, UploadedFile, HttpException, HttpStatus, Logger,
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
import { PermissionGuard } from '../../auth/guards/permission.guard';
import { CustomCsrfInterceptor } from '../../services/interceptors/custom.csrf.interceptor';
import { CsrfGenAuth, CsrfCheck } from '@tekuconcept/nestjs-csrf';
import { extractScopeContext } from '../../rbac/scope-context';

const AVATAR_UPLOAD_DIR = './uploads/avatars';
if (!fs.existsSync(AVATAR_UPLOAD_DIR)) { fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true }); }

@Controller('user')
@UseGuards(JwtAuthGuard)
@UseInterceptors(CustomCsrfInterceptor)
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>, @InjectRepository(Profile) private readonly profileRepo: Repository<Profile>) {}

  @Put('language')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async updateLanguage(@Request() req, @Body('language') language: string) {
    const scopeCtx = extractScopeContext(req);
    const profile = await this.getOrCreateProfile(req.user.id);
    profile.preferredLanguage = language;
    await this.profileRepo.save(profile);
    return { message: 'Language updated', language };
  }

  @Post('avatar')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({ destination: AVATAR_UPLOAD_DIR, filename: (req, file, cb) => { cb(null, `avatar-${(req as any).user?.id || 'unknown'}-${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`); } }),
    fileFilter: (req, file, cb) => { cb(file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? null : new HttpException('Only image files are allowed', HttpStatus.BAD_REQUEST), !!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)); },
    limits: { fileSize: 5 * 1024 * 1024 },
  }))
  async uploadAvatar(@Request() req, @UploadedFile() file: Express.Multer.File) {
    const scopeCtx = extractScopeContext(req);
    if (!file) throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    const avatarUrl = `/uploads/avatars/${file.filename}`;
    const profile = await this.getOrCreateProfile(req.user.id);
    if (profile.avatarUrl) { const oldPath = `.${profile.avatarUrl}`; if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath); }
    profile.avatarUrl = avatarUrl;
    await this.profileRepo.save(profile);
    return { url: avatarUrl, message: 'Avatar uploaded successfully' };
  }

  @Delete('avatar')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async deleteAvatar(@Request() req) {
    const scopeCtx = extractScopeContext(req);
    const profile = await this.profileRepo.findOne({ where: { userId: req.user.id } });
    if (profile?.avatarUrl) { const filePath = `.${profile.avatarUrl}`; if (fs.existsSync(filePath)) fs.unlinkSync(filePath); profile.avatarUrl = null; await this.profileRepo.save(profile); }
    return { message: 'Avatar removed' };
  }

  @Post('profile/complete')
  @UseGuards(PermissionGuard)
  @CsrfGenAuth()
  @CsrfCheck(true)
  async completeProfile(@Request() req, @Body() profileData: Record<string, any>) {
    const scopeCtx = extractScopeContext(req);
    const profile = await this.getOrCreateProfile(req.user.id);
    const allowedFields = ['displayName', 'bio', 'phoneNumber', 'city', 'wilaya', 'country', 'languages', 'preferredLanguage', 'preferredCurrency'];
    for (const field of allowedFields) { if (profileData[field] !== undefined) profile[field] = profileData[field]; }
    await this.profileRepo.save(profile);
    return { message: 'Profile completed', profile };
  }

  private async getOrCreateProfile(userId: number): Promise<Profile> {
    let profile = await this.profileRepo.findOne({ where: { userId } });
    if (!profile) { profile = new Profile(); profile.userId = userId; profile = await this.profileRepo.save(profile); }
    return profile;
  }
}

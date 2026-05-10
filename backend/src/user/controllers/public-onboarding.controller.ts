import {
  Controller, Get, Post, Param, Body, BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { InvitationService } from '../services/invitation.service';
import { Public } from '../../auth/decorators/public.decorator';
import { CreateUserRequestDto } from '../dtos/requests/create.user.request.dto';

/**
 * Public, unauthenticated endpoints used by the onboarding flow.
 * - Verify an invitation token
 * - Sign up a brand new user via invitation
 * - Sign up a brand new user without invitation (default 'user' role)
 *
 * IMPORTANT: every endpoint in this controller is annotated `@Public()` —
 * no JWT, no CSRF, no permission guard. Validation is done in the service
 * using the invitation token as the proof of authorization.
 */
@ApiTags('Public Onboarding')
@Controller('onboarding')
export class PublicOnboardingController {
  constructor(private readonly invitationService: InvitationService) {}

  @Public()
  @Get('invitation/:token')
  @ApiOperation({ summary: 'Verify an invitation token (public)' })
  @ApiParam({ name: 'token' })
  async verify(@Param('token') token: string) {
    if (!token) throw new BadRequestException('Missing token');
    return this.invitationService.verifyInvitationToken(token);
  }

  @Public()
  @Post('signup/invitation/:token')
  @ApiOperation({ summary: 'Complete signup using an invitation token (public)' })
  @ApiParam({ name: 'token' })
  async signupFromInvitation(
    @Param('token') token: string,
    @Body() body: CreateUserRequestDto,
  ) {
    return this.invitationService.signupFromInvitation(token, body);
  }

  @Public()
  @Post('signup')
  @ApiOperation({ summary: 'Self-signup without invitation — defaults role to "user"' })
  async selfSignup(@Body() body: CreateUserRequestDto) {
    return this.invitationService.selfSignup(body);
  }
}

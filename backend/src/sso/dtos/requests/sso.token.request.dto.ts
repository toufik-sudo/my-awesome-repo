import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SSOTokenRequestDto {
  @IsNotEmpty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsString()
  codeVerifier: string;

  @IsNotEmpty()
  @IsString()
  redirectUri: string;

  @IsNotEmpty()
  @IsString()
  provider: string;
}

export class SSORefreshRequestDto {
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsOptional()
  @IsString()
  provider?: string;
}

export class SSOLogoutRequestDto {
  @IsOptional()
  @IsString()
  idToken?: string;

  @IsOptional()
  @IsString()
  provider?: string;
}

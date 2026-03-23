export class SSOTokenResponseDto {
  access_token: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  scope?: string;
}

export class SSOUserInfoResponseDto {
  sub: string;
  id?: string | number;
  email?: string;
  phoneNbr?: string;
  username?: string;
  phone_number?: string;
  roles?: string[];
  picture?: string;
  email_verified?: boolean;
}

export class SSOLogoutResponseDto {
  message: string;
  code: number;
}

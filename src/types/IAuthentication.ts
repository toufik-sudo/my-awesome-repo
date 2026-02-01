/**
 * Activation URL props interface
 */
export interface IActivationUrlProps {
  uuid: string;
  token: string;
}

/**
 * Decoded JWT token interface
 */
export interface IDecodedToken {
  uuid: string;
  step: number;
  platformId?: number;
  email?: string;
  role?: number;
  exp?: number;
  iat?: number;
}

/**
 * User session data interface
 */
export interface IUserSession {
  uuid: string;
  token: string;
  step: number;
  platformId?: number;
}

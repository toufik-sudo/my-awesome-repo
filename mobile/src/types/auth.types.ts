export type AppRole = 'hyper_admin' | 'hyper_manager' | 'admin' | 'manager' | 'user' | 'guest';

export interface User {
  id: string;
  email: string;
  name?: string;
  language?: string;
  role?: AppRole;
  /** @deprecated Use role instead */
  roles?: AppRole[];
  [key: string]: any;
}

export interface AuthResponse {
  user?: User;
  access_token?: string;
  refreshToken?: string;
  message?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

// ─── Invitation Rules (synced with backend) ────────────────────────────────

export const INVITATION_ALLOWED_ROLES: Record<AppRole, AppRole[]> = {
  hyper_admin: ['hyper_manager', 'admin', 'user', 'guest'],
  hyper_manager: ['admin', 'guest'],
  admin: ['manager', 'guest'],
  manager: ['guest'],
  user: [],
  guest: [],
};

export function getAllowedInvitationRoles(inviterRole: AppRole): AppRole[] {
  return INVITATION_ALLOWED_ROLES[inviterRole] || [];
}

// ─── Booking Restrictions (synced with backend) ────────────────────────────

export const BOOKING_ALLOWED_ROLES: AppRole[] = ['manager', 'guest', 'user'];

export function canMakeBooking(role: AppRole): boolean {
  return BOOKING_ALLOWED_ROLES.includes(role);
}

// ─── Role Helpers ──────────────────────────────────────────────────────────

export function isHost(role: AppRole): boolean {
  return role === 'admin' || role === 'manager';
}

export function isHyper(role: AppRole): boolean {
  return role === 'hyper_admin' || role === 'hyper_manager';
}

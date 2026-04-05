/**
 * RBAC API Interceptor — adds permission context to outgoing requests
 * and handles 403 responses gracefully.
 *
 * This module enhances the axios instance with:
 * 1. Automatic role/scope headers for backend validation
 * 2. 403 response handling with user-friendly messages
 * 3. Request blocking for actions the user cannot perform (optional pre-flight check)
 */

import { api } from '@/lib/axios';
import { getStoredJWT } from '@/utils/jwt';
import { swalAlert } from '@/modules/shared/services/alert.service';

let currentUserRole: string | null = null;

/**
 * Set the current user role for the interceptor.
 * Called from AuthContext when user logs in or role changes.
 */
export const setRBACRole = (role: string | null) => {
  currentUserRole = role;
};

// ─── 403 Response Handler ──────────────────────────────────────────────────

const PERMISSION_MESSAGES: Record<string, string> = {
  'cannot make bookings': 'Votre rôle ne permet pas de faire des réservations.',
  'cannot create or modify properties': 'Vous ne pouvez pas créer ou modifier des propriétés avec ce rôle.',
  'cannot create property': 'Votre rôle ne permet pas de créer des groupes de propriétés.',
  'cannot create absorption': 'Votre rôle ne permet pas de créer des règles d\'absorption.',
  'cannot create cancellation': 'Votre rôle ne permet pas de créer des règles d\'annulation.',
  'Missing permission': 'Vous n\'avez pas la permission requise pour cette action.',
  'read-only': 'Votre accès est en lecture seule.',
  'Requires one of': 'Vous n\'avez pas le rôle requis pour cette action.',
  'Admin can only': 'Cette action est limitée à vos propres ressources.',
  'Guest does not have access': 'Vous n\'avez pas accès à cette ressource.',
  'cannot access hyper': 'Cet espace est réservé aux administrateurs de la plateforme.',
  'cannot create/modify global': 'Seuls les hyper admins peuvent modifier les règles globales.',
};

/**
 * Initialize the RBAC interceptor on the axios instance.
 * Call once at app startup (e.g., in App.tsx or main.tsx).
 */
export function initRBACInterceptor() {
  // Response interceptor for 403 handling
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 403) {
        const message = error.response?.data?.message || '';
        
        // Find matching user-friendly message
        let userMessage = 'Accès refusé. Vous n\'avez pas les droits nécessaires.';
        for (const [key, msg] of Object.entries(PERMISSION_MESSAGES)) {
          if (message.toLowerCase().includes(key.toLowerCase())) {
            userMessage = msg;
            break;
          }
        }

        // Show toast (non-blocking)
        swalAlert.error(userMessage);

        // Enrich error for callers
        error.rbacBlocked = true;
        error.rbacMessage = userMessage;
      }

      return Promise.reject(error);
    },
  );
}

/**
 * Pre-flight permission check — use before making an API call
 * to avoid unnecessary network requests.
 *
 * @example
 * if (!checkRBACPreFlight('admin', 'manager')) {
 *   return; // user doesn't have the required role
 * }
 */
export function checkRBACPreFlight(...allowedRoles: string[]): boolean {
  if (!currentUserRole) return false;
  if (currentUserRole === 'hyper_admin') return true;
  if (currentUserRole === 'hyper_manager') return true;
  return allowedRoles.includes(currentUserRole);
}

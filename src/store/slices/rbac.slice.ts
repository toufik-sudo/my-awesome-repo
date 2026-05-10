import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const STORAGE_KEY = 'app-rbac-cache-v1';

export interface FrontendPermEntry {
  allowed: boolean;
  user_roles: string[];
}

export interface BackendPermEntry {
  allowed: boolean;
  scope: string;
}

export interface BindingMapEntry {
  backendKey: string;
  roles: string[];
}

export interface RbacState {
  /** ui.<key> → role-resolved boolean (rbac_frontend_permissions for current role) */
  rbacConfig: Record<string, boolean>;
  /** backend.<key> → { allowed, scope } for current role */
  backendPermsCache: Record<string, BackendPermEntry>;
  /** frontendApiKey → bindings */
  bindingMap: Record<string, BindingMapEntry[]>;
  /** Full ui permissions table indexed by key */
  frontendPermByKey: Record<string, FrontendPermEntry>;
  /** Role for which this cache was populated */
  role: string | null;
  /** User ID for which this cache was populated */
  userId: string | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

function loadFromStorage(): Partial<RbacState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function persist(state: RbacState) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        rbacConfig: state.rbacConfig,
        backendPermsCache: state.backendPermsCache,
        bindingMap: state.bindingMap,
        frontendPermByKey: state.frontendPermByKey,
        role: state.role,
        userId: state.userId,
        loaded: state.loaded,
      }),
    );
  } catch {
    /* quota exceeded — ignore */
  }
}

const persisted = loadFromStorage();

const initialState: RbacState = {
  rbacConfig: persisted.rbacConfig || {},
  backendPermsCache: persisted.backendPermsCache || {},
  bindingMap: persisted.bindingMap || {},
  frontendPermByKey: persisted.frontendPermByKey || {},
  role: persisted.role || null,
  userId: persisted.userId || null,
  loaded: persisted.loaded || false,
  loading: false,
  error: null,
};

export const rbacSlice = createSlice({
  name: 'rbac',
  initialState,
  reducers: {
    rbacLoadStart(state) {
      state.loading = true;
      state.error = null;
    },
    rbacLoadSuccess(
      state,
      action: PayloadAction<{
        rbacConfig: Record<string, boolean>;
        backendPermsCache: Record<string, BackendPermEntry>;
        bindingMap: Record<string, BindingMapEntry[]>;
        frontendPermByKey: Record<string, FrontendPermEntry>;
        role: string;
        userId: string;
      }>,
    ) {
      state.rbacConfig = action.payload.rbacConfig;
      state.backendPermsCache = action.payload.backendPermsCache;
      state.bindingMap = action.payload.bindingMap;
      state.frontendPermByKey = action.payload.frontendPermByKey;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
      state.loaded = true;
      state.loading = false;
      state.error = null;
      persist(state);
    },
    rbacLoadError(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    rbacClear(state) {
      state.rbacConfig = {};
      state.backendPermsCache = {};
      state.bindingMap = {};
      state.frontendPermByKey = {};
      state.role = null;
      state.userId = null;
      state.loaded = false;
      state.loading = false;
      state.error = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* ignore */
      }
    },
  },
});

export const { rbacLoadStart, rbacLoadSuccess, rbacLoadError, rbacClear } = rbacSlice.actions;

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectRbac = (s: { rbac: RbacState }) => s.rbac;
export const selectRbacLoaded = (s: { rbac: RbacState }) => s.rbac.loaded;
export const selectRbacLoading = (s: { rbac: RbacState }) => s.rbac.loading;
export const selectRbacError = (s: { rbac: RbacState }) => s.rbac.error;

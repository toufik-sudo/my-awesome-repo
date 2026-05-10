import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Alert, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { api } from '@/lib/axios';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'rbac-cache-v1';

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
  rbacConfig: Record<string, boolean>;
  backendPermsCache: Record<string, BackendPermEntry>;
  bindingMap: Record<string, BindingMapEntry[]>;
  frontendPermByKey: Record<string, FrontendPermEntry>;
  role: string | null;
  userId: string | null;
  loaded: boolean;
  loading: boolean;
  error: string | null;
}

interface RbacContextType extends RbacState {
  reload: () => Promise<void>;
  clear: () => Promise<void>;
}

const initialState: RbacState = {
  rbacConfig: {},
  backendPermsCache: {},
  bindingMap: {},
  frontendPermByKey: {},
  role: null,
  userId: null,
  loaded: false,
  loading: false,
  error: null,
};

const RbacContext = createContext<RbacContextType | undefined>(undefined);

export const useRbac = () => {
  const ctx = useContext(RbacContext);
  if (!ctx) throw new Error('useRbac must be used within RbacProvider');
  return ctx;
};

async function loadFromStorage(): Promise<Partial<RbacState> | null> {
  try {
    const raw = await SecureStore.getItemAsync(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function persist(state: RbacState) {
  try {
    await SecureStore.setItemAsync(
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
    /* ignore */
  }
}

async function clearStorage() {
  try {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export const RbacProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading: authLoading, logout } = useAuth();
  const [state, setState] = useState<RbacState>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [attempt, setAttempt] = useState(0);

  // Hydrate from SecureStore
  useEffect(() => {
    loadFromStorage().then(persisted => {
      if (persisted) {
        setState(s => ({ ...s, ...persisted, loading: false, error: null }));
      }
      setHydrated(true);
    });
  }, []);

  const fetchAll = useCallback(async (userId: string, role: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const [frontendConfigRes, backendConfigRes, bindingsRes, frontendPermsRes] = await Promise.all([
        api.get<Record<string, boolean>>(`/rbac-config/frontend/role/${role}`),
        api.get<Record<string, BackendPermEntry>>(`/rbac-config/backend/role/${role}`).catch(() => ({ data: {} })),
        api.get<Record<string, BindingMapEntry[]>>(`/permission-bindings/map`).catch(() => ({ data: {} })),
        api.get<Array<{ permission_key: string; allowed: boolean; user_roles: string[] }>>(`/rbac-config/frontend`).catch(() => ({ data: [] })),
      ]);

      const frontendPermByKey: Record<string, FrontendPermEntry> = {};
      for (const fp of frontendPermsRes.data) {
        frontendPermByKey[fp.permission_key] = { allowed: fp.allowed, user_roles: fp.user_roles };
      }

      const next: RbacState = {
        rbacConfig: frontendConfigRes.data || {},
        backendPermsCache: backendConfigRes.data || {},
        bindingMap: bindingsRes.data || {},
        frontendPermByKey,
        role,
        userId,
        loaded: true,
        loading: false,
        error: null,
      };
      setState(next);
      await persist(next);
    } catch (err: any) {
      const msg = err?.message || 'Unable to load permissions';
      setState(s => ({ ...s, loading: false, error: msg }));
      Alert.alert(
        'Permissions Loading Failed',
        'We could not load your permissions. You will be logged out. Please try again.',
        [
          { text: 'Retry', onPress: () => setAttempt(a => a + 1) },
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              await clearStorage();
              setState(initialState);
              await logout();
            },
          },
        ],
        { cancelable: false },
      );
    }
  }, [logout]);

  // Trigger fetch when auth ready
  useEffect(() => {
    if (!hydrated || authLoading) return;
    if (!user) {
      if (state.loaded) {
        clearStorage();
        setState(initialState);
      }
      return;
    }
    const role = user.role || 'user';
    const stale = state.userId !== user.id || state.role !== role;
    if (stale || !state.loaded) {
      fetchAll(user.id, role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, authLoading, user?.id, user?.role, attempt]);

  const reload = useCallback(async () => {
    if (!user?.id) return;
    await fetchAll(user.id, user.role || 'user');
  }, [user, fetchAll]);

  const clear = useCallback(async () => {
    await clearStorage();
    setState(initialState);
  }, []);

  // Show full-screen spinner while auth or RBAC loading (when authenticated)
  const blocking =
    !hydrated ||
    authLoading ||
    (!!user && (state.loading || (!state.loaded && !state.error)));

  if (blocking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>
          {authLoading ? 'Initializing session…' : 'Loading permissions…'}
        </Text>
      </View>
    );
  }

  return (
    <RbacContext.Provider value={{ ...state, reload, clear }}>
      {children}
    </RbacContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
  text: { marginTop: 8, fontSize: 14, opacity: 0.7 },
});

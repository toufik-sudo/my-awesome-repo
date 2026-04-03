import { useState, useEffect, useCallback } from 'react';
import { rolesApi, groupsApi } from '../admin.api';
import { propertiesApi } from '@/modules/properties/properties.api';
import { tourismServicesApi } from '@/modules/services/services.api';
import { serviceGroupsApi } from '@/modules/services/service-bookings.api';

export interface ScopeEntity {
  id: string;
  label: string;
}

/**
 * Fetches the list of entities corresponding to the selected scope.
 * Used in PointsRuleFormDialog, ServiceFeeFormDialog, etc.
 * Supports both single and multi-select modes.
 */
export function useScopeEntities(scope: string) {
  const [entities, setEntities] = useState<ScopeEntity[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (scope === 'global') {
      setEntities([]);
      return;
    }
    setLoading(true);
    try {
      let items: ScopeEntity[] = [];
      switch (scope) {
        case 'host':
        case 'admin': {
          const users = await rolesApi.getAllUsers();
          items = users
            .filter(u => u.role === 'admin' || u.role === 'hyper_admin')
            .map(u => ({ id: String(u.id), label: `${u.firstName || ''} ${u.lastName || ''} (${u.email})`.trim() }));
          break;
        }
        case 'property_group': {
          const groups = await groupsApi.getAll();
          items = groups.map(g => ({ id: g.id, label: g.name }));
          break;
        }
        case 'service_group': {
          const sGroups = await serviceGroupsApi.getAll();
          items = sGroups.map(g => ({ id: g.id, label: g.name }));
          break;
        }
        case 'property': {
          const res = await propertiesApi.getAll({ limit: 200 });
          const props = Array.isArray(res) ? res : (res as any).data || [];
          items = props.map((p: any) => ({ id: p.id, label: `${p.title} — ${p.city || ''}` }));
          break;
        }
        case 'service': {
          const svcs = await tourismServicesApi.getAll({ limit: 200 });
          const list = Array.isArray(svcs) ? svcs : (svcs as any).data || [];
          items = list.map((s: any) => ({
            id: s.id,
            label: `${typeof s.title === 'object' ? (s.title.fr || s.title.en || '') : s.title} — ${s.city || ''}`,
          }));
          break;
        }
      }
      setEntities(items);
    } catch {
      setEntities([]);
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => { load(); }, [load]);

  return { entities, loading };
}

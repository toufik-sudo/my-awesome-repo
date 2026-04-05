import React, { useState, useCallback, useMemo, memo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Pencil, Trash2, Building2, Compass, FolderPlus, X, Search } from 'lucide-react';
import { groupsApi } from '../admin.api';
import { serviceGroupsApi } from '@/modules/services/service-bookings.api';
import { propertiesApi } from '@/modules/properties/properties.api';
import { tourismServicesApi } from '@/modules/services/services.api';
import { MultiScopeSelector } from '../components/MultiScopeSelector';
import type { PropertyGroup } from '../admin.types';
import type { ServiceGroupResponse } from '@/modules/services/service-bookings.api';
import type { GridColumn } from '@/types/component.types';

type GroupType = 'property' | 'service';

interface GroupsManagementProps {
  readOnly?: boolean;
}

export const GroupsManagement: React.FC<GroupsManagementProps> = memo(({ readOnly = false }) => {
  const [tab, setTab] = useState<GroupType>('property');
  const [propGroups, setPropGroups] = useState<PropertyGroup[]>([]);
  const [svcGroups, setSvcGroups] = useState<ServiceGroupResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<any>(null);
  const [detailGroup, setDetailGroup] = useState<any>(null);
  const [groupItems, setGroupItems] = useState<any[]>([]);
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [availableItems, setAvailableItems] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Create form
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createSelectedIds, setCreateSelectedIds] = useState<string[]>([]);

  const loadPropGroups = useCallback(async () => {
    setLoading(true);
    try { setPropGroups(await groupsApi.getAll()); } catch { toast.error('Erreur chargement groupes'); }
    finally { setLoading(false); }
  }, []);

  const loadSvcGroups = useCallback(async () => {
    setLoading(true);
    try { setSvcGroups(await serviceGroupsApi.getAll()); } catch { toast.error('Erreur chargement groupes'); }
    finally { setLoading(false); }
  }, []);

  React.useEffect(() => { loadPropGroups(); loadSvcGroups(); }, [loadPropGroups, loadSvcGroups]);

  const loadGroupItems = useCallback(async (groupId: string, type: GroupType) => {
    try {
      const items = type === 'property'
        ? await groupsApi.getProperties(groupId)
        : await serviceGroupsApi.getServices(groupId);
      setGroupItems(items);
    } catch { toast.error('Erreur chargement éléments'); }
  }, []);

  const loadAvailableItems = useCallback(async (type: GroupType) => {
    try {
      if (type === 'property') {
        const res = await propertiesApi.getAll({ limit: 200 });
        setAvailableItems(Array.isArray(res) ? res : (res as any).data || []);
      } else {
        const svcs = await tourismServicesApi.getAll({ limit: 200 });
        setAvailableItems(Array.isArray(svcs) ? svcs : (svcs as any).data || []);
      }
    } catch { setAvailableItems([]); }
  }, []);

  const handleOpenDetail = useCallback((group: any, type: GroupType) => {
    setDetailGroup({ ...group, _type: type });
    loadGroupItems(group.id, type);
  }, [loadGroupItems]);

  const handleOpenAddItem = useCallback(() => {
    loadAvailableItems(detailGroup?._type || tab);
    setAddItemOpen(true);
    setSearchQuery('');
  }, [detailGroup, tab, loadAvailableItems]);

  const handleCreate = useCallback(async () => {
    if (!createName.trim()) return;
    try {
      let newGroup: any;
      if (tab === 'property') {
        newGroup = await groupsApi.create({ name: createName, description: createDesc });
        // Add selected properties to the group
        for (const propId of createSelectedIds) {
          try { await groupsApi.addProperty(newGroup.id, propId); } catch {}
        }
        loadPropGroups();
      } else {
        newGroup = await serviceGroupsApi.create({ name: createName, description: createDesc });
        // Add selected services to the group
        for (const svcId of createSelectedIds) {
          try { await serviceGroupsApi.addService(newGroup.id, svcId); } catch {}
        }
        loadSvcGroups();
      }
      toast.success('Groupe créé');
      setCreateOpen(false);
      setCreateName('');
      setCreateDesc('');
      setCreateSelectedIds([]);
    } catch { toast.error('Erreur création'); }
  }, [tab, createName, createDesc, createSelectedIds, loadPropGroups, loadSvcGroups]);

  const handleUpdate = useCallback(async (name: string, desc: string) => {
    if (!editGroup) return;
    try {
      if (editGroup._type === 'property' || tab === 'property') {
        await groupsApi.update(editGroup.id, { name, description: desc });
        loadPropGroups();
      } else {
        await serviceGroupsApi.update(editGroup.id, { name, description: desc });
        loadSvcGroups();
      }
      toast.success('Groupe mis à jour');
      setEditGroup(null);
    } catch { toast.error('Erreur mise à jour'); }
  }, [editGroup, tab, loadPropGroups, loadSvcGroups]);

  const handleDelete = useCallback(async (id: string, type: GroupType) => {
    const confirmed = await toast.confirm('Supprimer ce groupe ?');
    if (!confirmed) return;
    try {
      if (type === 'property') { await groupsApi.remove(id); loadPropGroups(); }
      else { await serviceGroupsApi.remove(id); loadSvcGroups(); }
      toast.success('Groupe supprimé');
    } catch { toast.error('Erreur suppression'); }
  }, [loadPropGroups, loadSvcGroups]);

  const handleAddItem = useCallback(async (itemId: string) => {
    if (!detailGroup) return;
    try {
      if (detailGroup._type === 'property') {
        await groupsApi.addProperty(detailGroup.id, itemId);
      } else {
        await serviceGroupsApi.addService(detailGroup.id, itemId);
      }
      toast.success('Élément ajouté');
      loadGroupItems(detailGroup.id, detailGroup._type);
      setAddItemOpen(false);
    } catch { toast.error("Erreur d'ajout"); }
  }, [detailGroup, loadGroupItems]);

  const handleRemoveItem = useCallback(async (itemId: string) => {
    if (!detailGroup) return;
    try {
      if (detailGroup._type === 'property') {
        await groupsApi.removeProperty(detailGroup.id, itemId);
      } else {
        await serviceGroupsApi.removeService(detailGroup.id, itemId);
      }
      toast.success('Élément retiré');
      loadGroupItems(detailGroup.id, detailGroup._type);
    } catch { toast.error('Erreur retrait'); }
  }, [detailGroup, loadGroupItems]);

  const getItemLabel = (item: any) => {
    if (item.title && typeof item.title === 'object') return item.title.fr || item.title.en || item.id;
    return item.title || item.name || item.id;
  };

  const filteredAvailable = useMemo(() => {
    const existingIds = new Set(groupItems.map(i => i.id));
    return availableItems
      .filter(i => !existingIds.has(i.id))
      .filter(i => {
        if (!searchQuery) return true;
        const label = getItemLabel(i).toLowerCase();
        return label.includes(searchQuery.toLowerCase());
      });
  }, [availableItems, groupItems, searchQuery]);

  /** Format selected count: show names if ≤2, otherwise "Type (N)" */
  const formatSelectedCount = (items: any[], type: GroupType) => {
    if (items.length === 0) return '—';
    if (items.length <= 2) return items.map(i => getItemLabel(i)).join(', ');
    const label = type === 'property' ? 'propriétés' : 'services';
    return `${label} (${items.length})`;
  };

  const makeColumns = (type: GroupType): GridColumn[] => [
    { key: 'name', title: 'Nom du groupe', sortable: true, filterable: true, filterType: 'text' },
    { key: 'description', title: 'Description', render: (v: string) => v || '—' },
    { key: 'isActive', title: 'Statut', width: '100px', render: (v: boolean) => <Badge variant={v ? 'default' : 'secondary'}>{v ? 'Actif' : 'Inactif'}</Badge> },
    { key: 'createdAt', title: 'Créé le', width: '140px', render: (v: string) => new Date(v).toLocaleDateString() },
    ...(!readOnly ? [{
      key: 'actions', title: 'Actions', width: '220px', render: (_: any, row: any) => (
        <div className="flex gap-1">
          <DynamicButton variant="ghost" size="sm" icon={type === 'property' ? <Building2 className="h-3.5 w-3.5" /> : <Compass className="h-3.5 w-3.5" />}
            onClick={() => handleOpenDetail(row, type)}>
            Éléments
          </DynamicButton>
          <DynamicButton variant="ghost" size="sm" icon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => setEditGroup({ ...row, _type: type })} />
          <DynamicButton variant="ghost" size="sm" icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
            onClick={() => handleDelete(row.id, type)} />
        </div>
    ) }] : []),
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Tabs value={tab} onValueChange={v => setTab(v as GroupType)}>
          <TabsList>
            <TabsTrigger value="property" className="gap-1.5"><Building2 className="h-4 w-4" />Propriétés</TabsTrigger>
            <TabsTrigger value="service" className="gap-1.5"><Compass className="h-4 w-4" />Services</TabsTrigger>
          </TabsList>
        </Tabs>
        {!readOnly && (
          <DynamicButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => { setCreateOpen(true); setCreateName(''); setCreateDesc(''); setCreateSelectedIds([]); }}>
            Nouveau Groupe
          </DynamicButton>
        )}
      </div>

      {tab === 'property' && (
        <DynamicGrid columns={makeColumns('property')} data={propGroups} loading={loading} striped hoverable emptyMessage="Aucun groupe de propriétés" />
      )}
      {tab === 'service' && (
        <DynamicGrid columns={makeColumns('service')} data={svcGroups} loading={loading} striped hoverable emptyMessage="Aucun groupe de services" />
      )}

      {/* Create Modal with multiselect */}
      <DynamicModal open={createOpen} onOpenChange={setCreateOpen} title={`Créer un groupe de ${tab === 'property' ? 'propriétés' : 'services'}`} size="md">
        <div className="space-y-4">
          <div>
            <Label>Nom du groupe</Label>
            <Input value={createName} onChange={e => setCreateName(e.target.value)} placeholder="ex. Propriétés côtières" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea value={createDesc} onChange={e => setCreateDesc(e.target.value)} placeholder="Décrivez ce groupe..." rows={3} />
          </div>
          <MultiScopeSelector
            scope={tab === 'property' ? 'property' : 'service'}
            selectedIds={createSelectedIds}
            onSelectionChange={setCreateSelectedIds}
            label={tab === 'property' ? 'Propriétés à inclure' : 'Services à inclure'}
            placeholder={tab === 'property' ? 'Sélectionner des propriétés...' : 'Sélectionner des services...'}
          />
          {createSelectedIds.length > 0 && (
            <p className="text-xs text-muted-foreground">
              {createSelectedIds.length > 2
                ? `${tab === 'property' ? 'Propriétés' : 'Services'} (${createSelectedIds.length})`
                : `${createSelectedIds.length} sélectionné(s)`
              }
            </p>
          )}
          <div className="flex justify-end gap-2">
            <DynamicButton variant="outline" onClick={() => setCreateOpen(false)}>Annuler</DynamicButton>
            <DynamicButton variant="primary" onClick={handleCreate}>Créer</DynamicButton>
          </div>
        </div>
      </DynamicModal>

      {/* Edit Modal */}
      <DynamicModal open={!!editGroup} onOpenChange={o => !o && setEditGroup(null)} title="Modifier le groupe" size="md">
        {editGroup && <EditGroupForm group={editGroup} onSave={handleUpdate} onCancel={() => setEditGroup(null)} />}
      </DynamicModal>

      {/* Detail Modal: items in group */}
      <DynamicModal
        open={!!detailGroup}
        onOpenChange={o => { if (!o) { setDetailGroup(null); setGroupItems([]); } }}
        title={`Éléments dans "${detailGroup?.name || ''}"`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {groupItems.length > 2
                ? `${detailGroup?._type === 'property' ? 'Propriétés' : 'Services'} (${groupItems.length})`
                : `${groupItems.length} élément(s)`
              }
            </p>
            <DynamicButton variant="outline" size="sm" icon={<FolderPlus className="h-3.5 w-3.5" />} onClick={handleOpenAddItem}>
              Ajouter
            </DynamicButton>
          </div>
          {groupItems.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun élément dans ce groupe</p>
          ) : (
            <div className="space-y-2">
              {groupItems.map((item: any) => (
                <Card key={item.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium text-sm">{getItemLabel(item)}</p>
                    <p className="text-xs text-muted-foreground">{item.city || ''}{item.wilaya ? `, ${item.wilaya}` : ''}{item.category ? ` — ${item.category}` : ''}</p>
                  </div>
                  <DynamicButton variant="ghost" size="sm" icon={<X className="h-3.5 w-3.5 text-destructive" />} onClick={() => handleRemoveItem(item.id)} />
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add item sub-modal with searchable list */}
        <DynamicModal open={addItemOpen} onOpenChange={setAddItemOpen} title={`Ajouter ${detailGroup?._type === 'property' ? 'une propriété' : 'un service'}`} size="md">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9"
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto space-y-1">
              {filteredAvailable.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Aucun élément disponible</p>
              ) : (
                filteredAvailable.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleAddItem(item.id)}
                  >
                    <div>
                      <p className="text-sm font-medium">{getItemLabel(item)}</p>
                      <p className="text-xs text-muted-foreground">{item.city || ''}{item.wilaya ? `, ${item.wilaya}` : ''}</p>
                    </div>
                    <Plus className="h-4 w-4 text-primary" />
                  </div>
                ))
              )}
            </div>
          </div>
        </DynamicModal>
      </DynamicModal>
    </div>
  );
});

GroupsManagement.displayName = 'GroupsManagement';

// Small edit form component
const EditGroupForm: React.FC<{ group: any; onSave: (name: string, desc: string) => void; onCancel: () => void }> = ({ group, onSave, onCancel }) => {
  const [name, setName] = useState(group.name || '');
  const [desc, setDesc] = useState(group.description || '');
  return (
    <div className="space-y-4">
      <div><Label>Nom</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
      <div><Label>Description</Label><Textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} /></div>
      <div className="flex justify-end gap-2">
        <DynamicButton variant="outline" onClick={onCancel}>Annuler</DynamicButton>
        <DynamicButton variant="primary" onClick={() => onSave(name, desc)}>Sauvegarder</DynamicButton>
      </div>
    </div>
  );
};

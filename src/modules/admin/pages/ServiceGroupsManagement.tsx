import React, { useState, useCallback, useMemo } from 'react';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicForm } from '@/modules/shared/components/DynamicForm';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { Plus, Pencil, Trash2, Compass, FolderPlus, X } from 'lucide-react';
import { serviceGroupsApi } from '@/modules/services/service-bookings.api';
import type { ServiceGroupResponse } from '@/modules/services/service-bookings.api';
import type { GridColumn, DynamicFormField } from '@/types/component.types';

export const ServiceGroupsManagement: React.FC = React.memo(() => {
  const [groups, setGroups] = useState<ServiceGroupResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<ServiceGroupResponse | null>(null);
  const [detailGroup, setDetailGroup] = useState<ServiceGroupResponse | null>(null);
  const [groupServices, setGroupServices] = useState<any[]>([]);
  const [addServiceOpen, setAddServiceOpen] = useState(false);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await serviceGroupsApi.getAll();
      setGroups(data);
    } catch {
      toast.error('Échec du chargement des groupes');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadGroups(); }, [loadGroups]);

  const loadGroupServices = useCallback(async (groupId: string) => {
    try {
      const svcs = await serviceGroupsApi.getServices(groupId);
      setGroupServices(svcs);
    } catch {
      toast.error('Échec du chargement des services');
    }
  }, []);

  const columns = useMemo<GridColumn[]>(() => [
    { key: 'name', title: 'Nom du groupe', sortable: true, filterable: true, filterType: 'text' },
    { key: 'description', title: 'Description', render: (v: string) => v || '—' },
    { key: 'isActive', title: 'Statut', width: '100px', render: (v: boolean) => <Badge variant={v ? 'default' : 'secondary'}>{v ? 'Actif' : 'Inactif'}</Badge> },
    { key: 'createdAt', title: 'Créé le', width: '140px', render: (v: string) => new Date(v).toLocaleDateString() },
    { key: 'actions', title: 'Actions', width: '200px', render: (_: any, row: ServiceGroupResponse) => (
      <div className="flex gap-1">
        <DynamicButton variant="ghost" size="sm" icon={<Compass className="h-3.5 w-3.5" />} onClick={() => { setDetailGroup(row); loadGroupServices(row.id); }}>Services</DynamicButton>
        <DynamicButton variant="ghost" size="sm" icon={<Pencil className="h-3.5 w-3.5" />} onClick={() => setEditGroup(row)} />
        <DynamicButton variant="ghost" size="sm" icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />} onClick={() => handleDelete(row.id)} />
      </div>
    ) },
  ], []);

  const formFields = useMemo<DynamicFormField[]>(() => [
    { fieldType: 'input', name: 'name', label: 'Nom du groupe', placeholder: 'ex. Tours culturels', validation: { required: true, minLength: 2 } },
    { fieldType: 'textarea', name: 'description', label: 'Description', placeholder: 'Décrivez ce groupe...' },
  ], []);

  const addServiceFields = useMemo<DynamicFormField[]>(() => [
    { fieldType: 'input', name: 'serviceId', label: 'ID du service', placeholder: 'Entrez l\'ID du service', validation: { required: true } },
  ], []);

  const handleCreate = useCallback(async (values: Record<string, any>) => {
    try {
      await serviceGroupsApi.create({ name: values.name, description: values.description });
      toast.success('Groupe créé');
      setCreateOpen(false);
      loadGroups();
    } catch { toast.error('Échec de la création'); }
  }, [loadGroups]);

  const handleUpdate = useCallback(async (values: Record<string, any>) => {
    if (!editGroup) return;
    try {
      await serviceGroupsApi.update(editGroup.id, { name: values.name, description: values.description });
      toast.success('Groupe mis à jour');
      setEditGroup(null);
      loadGroups();
    } catch { toast.error('Échec de la mise à jour'); }
  }, [editGroup, loadGroups]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await serviceGroupsApi.remove(id);
      toast.success('Groupe supprimé');
      loadGroups();
    } catch { toast.error('Échec de la suppression'); }
  }, [loadGroups]);

  const handleAddService = useCallback(async (values: Record<string, any>) => {
    if (!detailGroup) return;
    try {
      await serviceGroupsApi.addService(detailGroup.id, values.serviceId);
      toast.success('Service ajouté au groupe');
      setAddServiceOpen(false);
      loadGroupServices(detailGroup.id);
    } catch { toast.error('Échec de l\'ajout'); }
  }, [detailGroup, loadGroupServices]);

  const handleRemoveService = useCallback(async (serviceId: string) => {
    if (!detailGroup) return;
    try {
      await serviceGroupsApi.removeService(detailGroup.id, serviceId);
      toast.success('Service retiré du groupe');
      loadGroupServices(detailGroup.id);
    } catch { toast.error('Échec du retrait'); }
  }, [detailGroup, loadGroupServices]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DynamicButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          Nouveau Groupe
        </DynamicButton>
      </div>

      <DynamicGrid columns={columns} data={groups} loading={loading} striped hoverable emptyMessage="Aucun groupe de services" />

      <DynamicModal open={createOpen} onOpenChange={setCreateOpen} title="Créer un groupe de services" size="md">
        <DynamicForm fields={formFields} onSubmit={handleCreate} submitButtonText="Créer" onCancel={() => setCreateOpen(false)} />
      </DynamicModal>

      <DynamicModal open={!!editGroup} onOpenChange={(o) => !o && setEditGroup(null)} title="Modifier le groupe" size="md">
        {editGroup && (
          <DynamicForm fields={formFields.map(f => ({ ...f, defaultValue: (editGroup as any)[f.name] || '' }))} onSubmit={handleUpdate} submitButtonText="Sauvegarder" onCancel={() => setEditGroup(null)} />
        )}
      </DynamicModal>

      <DynamicModal open={!!detailGroup} onOpenChange={(o) => { if (!o) { setDetailGroup(null); setGroupServices([]); } }} title={`Services dans "${detailGroup?.name || ''}"`} size="lg">
        <div className="space-y-4">
          <div className="flex justify-end">
            <DynamicButton variant="outline" size="sm" icon={<FolderPlus className="h-3.5 w-3.5" />} onClick={() => setAddServiceOpen(true)}>
              Ajouter Service
            </DynamicButton>
          </div>
          {groupServices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aucun service dans ce groupe</p>
          ) : (
            <div className="space-y-2">
              {groupServices.map((svc: any) => (
                <Card key={svc.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium text-sm">{svc.title?.fr || svc.title?.en || svc.id}</p>
                    <p className="text-xs text-muted-foreground">{svc.city}, {svc.wilaya} — {svc.category}</p>
                  </div>
                  <DynamicButton variant="ghost" size="sm" icon={<X className="h-3.5 w-3.5 text-destructive" />} onClick={() => handleRemoveService(svc.id)} />
                </Card>
              ))}
            </div>
          )}
          <DynamicModal open={addServiceOpen} onOpenChange={setAddServiceOpen} title="Ajouter un service au groupe" size="sm">
            <DynamicForm fields={addServiceFields} onSubmit={handleAddService} submitButtonText="Ajouter" onCancel={() => setAddServiceOpen(false)} />
          </DynamicModal>
        </div>
      </DynamicModal>
    </div>
  );
});

ServiceGroupsManagement.displayName = 'ServiceGroupsManagement';

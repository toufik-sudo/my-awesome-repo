import React, { useState, useCallback, useMemo } from 'react';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { DynamicForm } from '@/modules/shared/components/DynamicForm';
import { DynamicButton } from '@/modules/shared/components/DynamicButton';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Building2, FolderPlus, X } from 'lucide-react';
import { groupsApi } from '../admin.api';
import type { PropertyGroup } from '../admin.types';
import type { GridColumn, DynamicFormField } from '@/types/component.types';

export const PropertyGroupsManagement: React.FC = React.memo(() => {
  const [groups, setGroups] = useState<PropertyGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<PropertyGroup | null>(null);
  const [detailGroup, setDetailGroup] = useState<PropertyGroup | null>(null);
  const [groupProperties, setGroupProperties] = useState<any[]>([]);
  const [addPropertyOpen, setAddPropertyOpen] = useState(false);

  const loadGroups = useCallback(async () => {
    setLoading(true);
    try {
      const data = await groupsApi.getAll();
      setGroups(data);
    } catch {
      toast.error('Failed to load property groups');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => { loadGroups(); }, [loadGroups]);

  const loadGroupProperties = useCallback(async (groupId: string) => {
    try {
      const props = await groupsApi.getProperties(groupId);
      setGroupProperties(props);
    } catch {
      toast.error('Failed to load group properties');
    }
  }, []);

  const columns = useMemo<GridColumn[]>(() => [
    { key: 'name', title: 'Group Name', sortable: true, filterable: true, filterType: 'text' },
    { key: 'description', title: 'Description', render: (v: string) => v || '—' },
    {
      key: 'isActive', title: 'Status', width: '100px',
      render: (v: boolean) => (
        <Badge variant={v ? 'default' : 'secondary'}>{v ? 'Active' : 'Inactive'}</Badge>
      ),
    },
    {
      key: 'createdAt', title: 'Created', width: '140px',
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      key: 'actions', title: 'Actions', width: '200px',
      render: (_: any, row: PropertyGroup) => (
        <div className="flex gap-1">
          <DynamicButton variant="ghost" size="sm" icon={<Building2 className="h-3.5 w-3.5" />}
            onClick={() => { setDetailGroup(row); loadGroupProperties(row.id); }}>
            Properties
          </DynamicButton>
          <DynamicButton variant="ghost" size="sm" icon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => setEditGroup(row)} />
          <DynamicButton variant="ghost" size="sm" icon={<Trash2 className="h-3.5 w-3.5 text-destructive" />}
            onClick={() => handleDelete(row.id)} />
        </div>
      ),
    },
  ], []);

  const formFields = useMemo<DynamicFormField[]>(() => [
    { fieldType: 'input', name: 'name', label: 'Group Name', placeholder: 'e.g. Beach Properties', validation: { required: true, minLength: 2 } },
    { fieldType: 'textarea', name: 'description', label: 'Description', placeholder: 'Describe this group...' },
  ], []);

  const addPropertyFields = useMemo<DynamicFormField[]>(() => [
    { fieldType: 'input', name: 'propertyId', label: 'Property ID', placeholder: 'Enter property ID', validation: { required: true } },
  ], []);

  const handleCreate = useCallback(async (values: Record<string, any>) => {
    try {
      await groupsApi.create({ name: values.name, description: values.description });
      toast.success('Group created');
      setCreateOpen(false);
      loadGroups();
    } catch {
      toast.error('Failed to create group');
    }
  }, [loadGroups]);

  const handleUpdate = useCallback(async (values: Record<string, any>) => {
    if (!editGroup) return;
    try {
      await groupsApi.update(editGroup.id, { name: values.name, description: values.description });
      toast.success('Group updated');
      setEditGroup(null);
      loadGroups();
    } catch {
      toast.error('Failed to update group');
    }
  }, [editGroup, loadGroups]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await groupsApi.remove(id);
      toast.success('Group deleted');
      loadGroups();
    } catch {
      toast.error('Failed to delete group');
    }
  }, [loadGroups]);

  const handleAddProperty = useCallback(async (values: Record<string, any>) => {
    if (!detailGroup) return;
    try {
      await groupsApi.addProperty(detailGroup.id, values.propertyId);
      toast.success('Property added to group');
      setAddPropertyOpen(false);
      loadGroupProperties(detailGroup.id);
    } catch {
      toast.error('Failed to add property');
    }
  }, [detailGroup, loadGroupProperties]);

  const handleRemoveProperty = useCallback(async (propertyId: string) => {
    if (!detailGroup) return;
    try {
      await groupsApi.removeProperty(detailGroup.id, propertyId);
      toast.success('Property removed from group');
      loadGroupProperties(detailGroup.id);
    } catch {
      toast.error('Failed to remove property');
    }
  }, [detailGroup, loadGroupProperties]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <DynamicButton variant="primary" icon={<Plus className="h-4 w-4" />} onClick={() => setCreateOpen(true)}>
          New Group
        </DynamicButton>
      </div>

      <DynamicGrid columns={columns} data={groups} loading={loading} striped hoverable emptyMessage="No property groups yet" />

      {/* Create Modal */}
      <DynamicModal open={createOpen} onOpenChange={setCreateOpen} title="Create Property Group" size="md">
        <DynamicForm fields={formFields} onSubmit={handleCreate} submitButtonText="Create" onCancel={() => setCreateOpen(false)} />
      </DynamicModal>

      {/* Edit Modal */}
      <DynamicModal open={!!editGroup} onOpenChange={(o) => !o && setEditGroup(null)} title="Edit Property Group" size="md">
        {editGroup && (
          <DynamicForm
            fields={formFields.map(f => ({ ...f, defaultValue: (editGroup as any)[f.name] || '' }))}
            onSubmit={handleUpdate}
            submitButtonText="Save"
            onCancel={() => setEditGroup(null)}
          />
        )}
      </DynamicModal>

      {/* Group Properties Detail Modal */}
      <DynamicModal
        open={!!detailGroup}
        onOpenChange={(o) => { if (!o) { setDetailGroup(null); setGroupProperties([]); } }}
        title={`Properties in "${detailGroup?.name || ''}"`}
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-end">
            <DynamicButton variant="outline" size="sm" icon={<FolderPlus className="h-3.5 w-3.5" />}
              onClick={() => setAddPropertyOpen(true)}>
              Add Property
            </DynamicButton>
          </div>

          {groupProperties.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No properties in this group</p>
          ) : (
            <div className="space-y-2">
              {groupProperties.map((prop: any) => (
                <Card key={prop.id} className="flex items-center justify-between p-3">
                  <div>
                    <p className="font-medium text-sm">{prop.title || prop.id}</p>
                    <p className="text-xs text-muted-foreground">{prop.city}, {prop.wilaya}</p>
                  </div>
                  <DynamicButton variant="ghost" size="sm" icon={<X className="h-3.5 w-3.5 text-destructive" />}
                    onClick={() => handleRemoveProperty(prop.id)} />
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add property sub-modal */}
        <DynamicModal open={addPropertyOpen} onOpenChange={setAddPropertyOpen} title="Add Property to Group" size="sm">
          <DynamicForm fields={addPropertyFields} onSubmit={handleAddProperty} submitButtonText="Add" onCancel={() => setAddPropertyOpen(false)} />
        </DynamicModal>
      </DynamicModal>
    </div>
  );
});

PropertyGroupsManagement.displayName = 'PropertyGroupsManagement';

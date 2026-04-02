import React, { useState, useCallback, useEffect, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { DynamicGrid } from '@/modules/shared/components/DynamicGrid';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { hyperManagementApi } from '@/modules/admin/hyper-management.api';
import { metricsApi, type MetricProperty, type MetricService } from '@/modules/admin/metrics.api';
import type { GridColumn } from '@/types/component.types';
import {
  Pause, Play, Archive, Trash2, Building2, Compass,
  AlertTriangle, Loader2, RefreshCw,
} from 'lucide-react';

const STATUS_BADGES: Record<string, { variant: any; label: string }> = {
  published: { variant: 'default', label: 'Publié' },
  draft: { variant: 'outline', label: 'Brouillon' },
  suspended: { variant: 'secondary', label: 'En pause' },
  archived: { variant: 'destructive', label: 'Archivé' },
};

export const HyperEntityManager: React.FC = memo(() => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'properties' | 'services'>('properties');
  const [properties, setProperties] = useState<MetricProperty[]>([]);
  const [services, setServices] = useState<MetricService[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [confirmModal, setConfirmModal] = useState<{
    action: string;
    entityType: string;
    entityId: string;
    entityTitle: string;
  } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const result = await metricsApi.getProperties(params);
      setProperties(result.data);
    } catch { toast.error('Erreur chargement propriétés'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  const loadServices = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      const result = await metricsApi.getServices(params);
      setServices(result.data);
    } catch { toast.error('Erreur chargement services'); }
    finally { setLoading(false); }
  }, [statusFilter]);

  useEffect(() => {
    if (activeTab === 'properties') loadProperties();
    else loadServices();
  }, [activeTab, loadProperties, loadServices]);

  const handleAction = useCallback(async () => {
    if (!confirmModal) return;
    setActionLoading(true);
    try {
      const { action, entityType, entityId } = confirmModal;
      if (entityType === 'property') {
        if (action === 'pause') await hyperManagementApi.pauseProperty(entityId);
        else if (action === 'resume') await hyperManagementApi.resumeProperty(entityId);
        else if (action === 'archive') await hyperManagementApi.archiveProperty(entityId);
        else if (action === 'delete') await hyperManagementApi.deleteProperty(entityId);
      } else {
        if (action === 'pause') await hyperManagementApi.pauseService(entityId);
        else if (action === 'resume') await hyperManagementApi.resumeService(entityId);
        else if (action === 'archive') await hyperManagementApi.archiveService(entityId);
        else if (action === 'delete') await hyperManagementApi.deleteService(entityId);
      }
      toast.success('Action effectuée avec succès');
      setConfirmModal(null);
      if (activeTab === 'properties') loadProperties();
      else loadServices();
    } catch {
      toast.error('Erreur lors de l\'action');
    } finally { setActionLoading(false); }
  }, [confirmModal, activeTab, loadProperties, loadServices]);

  const actionButtons = useCallback((id: string, title: string, status: string, entityType: 'property' | 'service') => (
    <div className="flex items-center gap-1">
      {status !== 'suspended' && status !== 'archived' && (
        <Button variant="ghost" size="sm" onClick={() => setConfirmModal({ action: 'pause', entityType, entityId: id, entityTitle: title })} title="Mettre en pause">
          <Pause className="h-3.5 w-3.5 text-amber-600" />
        </Button>
      )}
      {status === 'suspended' && (
        <Button variant="ghost" size="sm" onClick={() => setConfirmModal({ action: 'resume', entityType, entityId: id, entityTitle: title })} title="Reprendre">
          <Play className="h-3.5 w-3.5 text-emerald-600" />
        </Button>
      )}
      {status !== 'archived' && (
        <Button variant="ghost" size="sm" onClick={() => setConfirmModal({ action: 'archive', entityType, entityId: id, entityTitle: title })} title="Archiver">
          <Archive className="h-3.5 w-3.5 text-orange-600" />
        </Button>
      )}
      <Button variant="ghost" size="sm" onClick={() => setConfirmModal({ action: 'delete', entityType, entityId: id, entityTitle: title })} title="Supprimer définitivement">
        <Trash2 className="h-3.5 w-3.5 text-destructive" />
      </Button>
    </div>
  ), []);

  const propertyColumns = useMemo<GridColumn[]>(() => [
    { key: 'title', title: 'Titre', sortable: true, filterable: true, filterType: 'text' },
    { key: 'city', title: 'Ville', sortable: true },
    { key: 'hostName', title: 'Hôte', sortable: true },
    { key: 'status', title: 'Statut', width: '120px', render: (v: string) => {
      const cfg = STATUS_BADGES[v] || { variant: 'outline', label: v };
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
    }},
    { key: 'pricePerNight', title: 'Prix/nuit', width: '100px', render: (v: number) => `${Number(v).toLocaleString()} DA` },
    { key: 'trustStars', title: 'Trust', width: '60px' },
    { key: 'actions', title: 'Actions', width: '160px', render: (_: any, row: MetricProperty) =>
      actionButtons(row.id, row.title, row.status, 'property')
    },
  ], [actionButtons]);

  const serviceColumns = useMemo<GridColumn[]>(() => [
    { key: 'title', title: 'Titre', sortable: true, render: (v: any) => typeof v === 'object' ? (v.fr || v.en || '—') : String(v) },
    { key: 'category', title: 'Catégorie', sortable: true },
    { key: 'city', title: 'Ville', sortable: true },
    { key: 'providerName', title: 'Fournisseur', sortable: true },
    { key: 'status', title: 'Statut', width: '120px', render: (v: string) => {
      const cfg = STATUS_BADGES[v] || { variant: 'outline', label: v };
      return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
    }},
    { key: 'price', title: 'Prix', width: '100px', render: (v: number) => `${Number(v).toLocaleString()} DA` },
    { key: 'actions', title: 'Actions', width: '160px', render: (_: any, row: MetricService) =>
      actionButtons(row.id, typeof row.title === 'object' ? (row.title.fr || '') : '', row.status, 'service')
    },
  ], [actionButtons]);

  const ACTION_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pause: { label: 'Mettre en pause', color: 'text-amber-600', icon: <Pause className="h-5 w-5" /> },
    resume: { label: 'Reprendre', color: 'text-emerald-600', icon: <Play className="h-5 w-5" /> },
    archive: { label: 'Archiver', color: 'text-orange-600', icon: <Archive className="h-5 w-5" /> },
    delete: { label: 'Supprimer définitivement', color: 'text-destructive', icon: <Trash2 className="h-5 w-5" /> },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'properties' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('properties')}
            className="gap-1.5"
          >
            <Building2 className="h-4 w-4" /> Propriétés
          </Button>
          <Button
            variant={activeTab === 'services' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveTab('services')}
            className="gap-1.5"
          >
            <Compass className="h-4 w-4" /> Services
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="published">Publiés</SelectItem>
              <SelectItem value="draft">Brouillons</SelectItem>
              <SelectItem value="suspended">En pause</SelectItem>
              <SelectItem value="archived">Archivés</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" size="sm" onClick={() => activeTab === 'properties' ? loadProperties() : loadServices()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <DynamicGrid
        columns={activeTab === 'properties' ? propertyColumns : serviceColumns}
        data={activeTab === 'properties' ? properties : services}
        loading={loading}
        hoverable
        striped
        pageSize={20}
        emptyMessage={`Aucun${activeTab === 'services' ? ' service' : 'e propriété'}`}
      />

      {/* Confirmation Modal */}
      <DynamicModal
        open={!!confirmModal}
        onOpenChange={(o) => !o && setConfirmModal(null)}
        title="Confirmer l'action"
        size="sm"
      >
        {confirmModal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className={ACTION_LABELS[confirmModal.action]?.color}>
                {ACTION_LABELS[confirmModal.action]?.icon}
              </div>
              <div>
                <p className="font-medium">{ACTION_LABELS[confirmModal.action]?.label}</p>
                <p className="text-sm text-muted-foreground">
                  {confirmModal.entityType === 'property' ? 'Propriété' : 'Service'}: <strong>{confirmModal.entityTitle}</strong>
                </p>
              </div>
            </div>
            {confirmModal.action === 'delete' && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">Cette action est irréversible. Toutes les données associées seront supprimées définitivement.</p>
              </div>
            )}
            {confirmModal.action === 'archive' && (
              <p className="text-sm text-muted-foreground">L'entité sera archivée et automatiquement supprimée après la période configurée.</p>
            )}
            {confirmModal.action === 'pause' && (
              <p className="text-sm text-muted-foreground">L'entité sera invisible pour les utilisateurs et aucune réservation ne sera possible.</p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setConfirmModal(null)}>Annuler</Button>
              <Button
                variant={confirmModal.action === 'delete' ? 'destructive' : 'default'}
                onClick={handleAction}
                disabled={actionLoading}
              >
                {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Confirmer
              </Button>
            </div>
          </div>
        )}
      </DynamicModal>
    </div>
  );
});

HyperEntityManager.displayName = 'HyperEntityManager';

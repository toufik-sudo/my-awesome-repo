import React, { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Search, AlertTriangle, CheckCircle2, XCircle, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import type { RbacBackendPermission, RbacFrontendPermission, RbacScope } from '../rbac-config.api';

const SCOPE_OPTIONS: RbacScope[] = ['global', 'admin', 'assigned', 'own', 'inherited'];

const ACCESS_TYPES = [
  { value: 'read', labelKey: 'rbac.create.accessRead' },
  { value: 'create', labelKey: 'rbac.create.accessCreate' },
  { value: 'update', labelKey: 'rbac.create.accessUpdate' },
  { value: 'delete', labelKey: 'rbac.create.accessDelete' },
  { value: 'manage', labelKey: 'rbac.create.accessManage' },
  { value: 'export', labelKey: 'rbac.create.accessExport' },
  { value: 'import', labelKey: 'rbac.create.accessImport' },
  { value: 'validate', labelKey: 'rbac.create.accessValidate' },
  { value: 'answer', labelKey: 'rbac.create.accessAnswer' },
  { value: 'decline', labelKey: 'rbac.create.accessDecline' },
  { value: 'accept', labelKey: 'rbac.create.accessAccept' },
  { value: 'pause', labelKey: 'rbac.create.accessPause' },
  { value: 'invite', labelKey: 'rbac.create.accessInvite' },
];

const ROLE_LABELS: Record<string, string> = {
  hyper_admin: 'Hyper Admin',
  hyper_manager: 'Hyper Manager',
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
  guest: 'Guest',
};

// Known UI categories for grouping
const UI_CATEGORIES: Record<string, string[]> = {
  'Properties': ['show_add_property_button', 'show_edit_property_button', 'show_duplicate_property_button', 'show_delete_property_button', 'show_pause_property_button'],
  'Services': ['show_add_service_button', 'show_edit_service_button', 'show_duplicate_service_button', 'show_delete_service_button', 'show_pause_service_button'],
  'Bookings': ['show_booking_button', 'show_accept_booking_button', 'show_reject_booking_button', 'show_bookings_tab'],
  'Demands': ['show_answer_demand_button', 'show_decline_demand_button', 'show_accept_demand_button'],
  'Groups': ['show_create_group_button', 'show_edit_group_button'],
  'Dashboard': ['show_dashboard_analytics', 'show_user_management', 'show_payment_validation', 'show_document_verification', 'show_rbac_settings', 'show_rbac_settings_edit'],
  'Fees & Rules': ['show_fee_rules_management', 'show_points_rules_management', 'show_create_absorption_button', 'show_create_cancellation_button'],
  'Communication': ['show_chat_panel', 'show_review_form', 'show_comment_section'],
  'Invitations': ['show_invite_manager_option', 'show_invite_guest_option'],
};

type CreateMode = 'unconfigured' | 'new';

interface CreatePermissionModalProps {
  open: boolean;
  onClose: () => void;
  roles: string[];
  existingBackendPerms: RbacBackendPermission[];
  existingFrontendPerms: RbacFrontendPermission[];
  onCreateBackend: (data: {
    role: string;
    resource: string;
    action: string;
    permission_key: string;
    scope: RbacScope;
    allowed: boolean;
  }) => Promise<void>;
  onCreateFrontend: (data: {
    role: string;
    ui_key: string;
    permission_key: string;
    allowed: boolean;
  }) => Promise<void>;
  /** Current user's role — restricts what roles/columns are visible */
  currentUserRole?: string;
}

export const CreatePermissionModal: React.FC<CreatePermissionModalProps> = ({
  open, onClose, roles, existingBackendPerms, existingFrontendPerms,
  onCreateBackend, onCreateFrontend, currentUserRole = 'hyper_admin',
}) => {
  const { t } = useTranslation();
  const [permType, setPermType] = useState<'backend' | 'frontend'>('frontend');
  const [createMode, setCreateMode] = useState<CreateMode>('unconfigured');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Backend fields (new mode)
  const [resource, setResource] = useState('');
  const [customResource, setCustomResource] = useState('');
  const [action, setAction] = useState('');
  const [scope, setScope] = useState<RbacScope>('global');
  const [allowed, setAllowed] = useState(true);

  // Frontend fields (new mode)
  const [uiKey, setUiKey] = useState('');
  const [customUiKey, setCustomUiKey] = useState('');

  // Permission key
  const [permKeyMode, setPermKeyMode] = useState<'existing' | 'new'>('new');
  const [existingPermKey, setExistingPermKey] = useState('');
  const [permKeySearch, setPermKeySearch] = useState('');
  const [customPermKey, setCustomPermKey] = useState('');

  // Multi-select for unconfigured permissions
  const [selectedUnconfigured, setSelectedUnconfigured] = useState<string[]>([]);

  // ─── Role filtering based on current user ─────────────────────────
  const visibleRoles = useMemo(() => {
    if (currentUserRole === 'hyper_admin') return roles;
    if (currentUserRole === 'hyper_manager') return roles.filter(r => !['hyper_admin'].includes(r));
    if (currentUserRole === 'admin') return roles.filter(r => ['manager', 'guest'].includes(r));
    return [];
  }, [roles, currentUserRole]);

  // ─── Unconfigured permissions detection ────────────────────────────
  const unconfiguredBackendPerms = useMemo(() => {
    if (selectedRoles.length === 0) return [];
    // Get all unique permission_keys from ALL roles
    const allPermKeys = [...new Set(existingBackendPerms.map(p => p.permission_key))];
    const result: Array<{ permission_key: string; resource: string; action: string; missingRoles: string[] }> = [];

    for (const pk of allPermKeys) {
      const existing = existingBackendPerms.filter(p => p.permission_key === pk);
      const existingRoles = existing.map(p => p.role);
      const missingRoles = selectedRoles.filter(r => !existingRoles.includes(r));
      if (missingRoles.length > 0) {
        const ref = existing[0];
        result.push({ permission_key: pk, resource: ref.resource, action: ref.action, missingRoles });
      }
    }
    return result.filter(r =>
      !searchQuery || r.permission_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.resource.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedRoles, existingBackendPerms, searchQuery]);

  const unconfiguredFrontendPerms = useMemo(() => {
    if (selectedRoles.length === 0) return [];
    // Get all unique ui_keys
    const allUiKeys = [...new Set(existingFrontendPerms.map(p => p.ui_key))];
    // Also add known UI keys that may not exist at all
    const knownKeys = Object.values(UI_CATEGORIES).flat();
    const combined = [...new Set([...allUiKeys, ...knownKeys])];

    const result: Array<{ ui_key: string; permission_key: string; missingRoles: string[]; category: string }> = [];

    for (const uk of combined) {
      const existing = existingFrontendPerms.filter(p => p.ui_key === uk);
      const existingRoles = existing.map(p => p.role);
      const missingRoles = selectedRoles.filter(r => !existingRoles.includes(r));
      if (missingRoles.length > 0) {
        const ref = existing[0];
        const category = Object.entries(UI_CATEGORIES).find(([, keys]) => keys.includes(uk))?.[0] || 'Other';
        result.push({
          ui_key: uk,
          permission_key: ref?.permission_key || `show_${uk.replace(/^show_/, '')}`,
          missingRoles,
          category,
        });
      }
    }
    return result.filter(r =>
      !searchQuery || r.ui_key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [selectedRoles, existingFrontendPerms, searchQuery]);

  // Group unconfigured frontend by category
  const groupedUnconfiguredFrontend = useMemo(() => {
    const groups: Record<string, typeof unconfiguredFrontendPerms> = {};
    for (const item of unconfiguredFrontendPerms) {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [unconfiguredFrontendPerms]);

  // ─── Sync validation ──────────────────────────────────────────────
  const syncErrors = useMemo(() => {
    const errors: string[] = [];
    if (createMode === 'new' && permType === 'backend') {
      const effResource = resource === '__custom__' ? customResource : resource;
      const effAction = action;
      const pk = permKeyMode === 'existing' ? existingPermKey : (customPermKey || (effResource && effAction ? `${effAction}_${effResource}` : ''));
      if (pk) {
        // Check if this perm_key exists for backend but not frontend (or vice versa)
        const hasBackend = existingBackendPerms.some(p => p.permission_key === pk);
        const hasFrontend = existingFrontendPerms.some(p => p.permission_key === pk);
        if (hasBackend && !hasFrontend) {
          errors.push(t('rbac.create.syncWarningNoFrontend', 'This permission key exists in backend but has no frontend UI mapping. Consider adding a frontend entry too.'));
        }
      }
    }
    if (createMode === 'new' && permType === 'frontend') {
      const effUiKey = uiKey === '__custom__' ? customUiKey : uiKey;
      const pk = permKeyMode === 'existing' ? existingPermKey : (customPermKey || (effUiKey ? `show_${effUiKey.replace(/^show_/, '')}` : ''));
      if (pk) {
        const hasFrontend = existingFrontendPerms.some(p => p.permission_key === pk);
        const hasBackend = existingBackendPerms.some(p => p.permission_key === pk);
        if (hasFrontend && !hasBackend) {
          errors.push(t('rbac.create.syncWarningNoBackend', 'This permission key exists in frontend but has no backend API mapping. The UI element may display but API calls will be rejected.'));
        }
      }
    }
    return errors;
  }, [createMode, permType, resource, customResource, action, permKeyMode, existingPermKey, customPermKey, uiKey, customUiKey, existingBackendPerms, existingFrontendPerms, t]);

  // ─── Derived lists ─────────────────────────────────────────────────
  const existingResources = useMemo(() =>
    [...new Set(existingBackendPerms.map(p => p.resource))].sort(),
    [existingBackendPerms]
  );

  const existingUiKeys = useMemo(() =>
    [...new Set(existingFrontendPerms.map(p => p.ui_key))].sort(),
    [existingFrontendPerms]
  );

  const existingPermKeys = useMemo(() => {
    const keys = permType === 'backend'
      ? existingBackendPerms.map(p => p.permission_key)
      : existingFrontendPerms.map(p => p.permission_key);
    return [...new Set(keys)].sort();
  }, [permType, existingBackendPerms, existingFrontendPerms]);

  const filteredPermKeys = useMemo(() =>
    existingPermKeys.filter(k => k.toLowerCase().includes(permKeySearch.toLowerCase())),
    [existingPermKeys, permKeySearch]
  );

  const effectiveResource = resource === '__custom__' ? customResource : resource;
  const effectiveUiKey = uiKey === '__custom__' ? customUiKey : uiKey;

  const generatedPermKey = useMemo(() => {
    if (permKeyMode === 'existing') return existingPermKey;
    if (customPermKey) return customPermKey;
    if (permType === 'backend') {
      return effectiveResource && action ? `${action}_${effectiveResource}` : '';
    }
    return effectiveUiKey ? `show_${effectiveUiKey.replace(/^show_/, '')}` : '';
  }, [permKeyMode, existingPermKey, customPermKey, permType, effectiveResource, action, effectiveUiKey]);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
    setSelectedUnconfigured([]);
  };

  const toggleUnconfigured = useCallback((key: string) => {
    setSelectedUnconfigured(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  }, []);

  const selectAllUnconfigured = useCallback(() => {
    const allKeys = permType === 'frontend'
      ? unconfiguredFrontendPerms.map(p => p.ui_key)
      : unconfiguredBackendPerms.map(p => p.permission_key);
    setSelectedUnconfigured(allKeys);
  }, [permType, unconfiguredFrontendPerms, unconfiguredBackendPerms]);

  const isValid = () => {
    if (createMode === 'unconfigured') {
      return selectedRoles.length > 0 && selectedUnconfigured.length > 0;
    }
    if (selectedRoles.length === 0) return false;
    if (!generatedPermKey) return false;
    if (permType === 'backend') return !!effectiveResource && !!action;
    return !!effectiveUiKey;
  };

  const resetForm = () => {
    setSelectedRoles([]);
    setResource('');
    setCustomResource('');
    setAction('');
    setScope('global');
    setAllowed(true);
    setUiKey('');
    setCustomUiKey('');
    setPermKeyMode('new');
    setExistingPermKey('');
    setPermKeySearch('');
    setCustomPermKey('');
    setSelectedUnconfigured([]);
    setSearchQuery('');
    setCreateMode('unconfigured');
  };

  const handleSubmit = async () => {
    if (!isValid()) return;

    // Sync validation check
    if (syncErrors.length > 0 && createMode === 'new') {
      const syncResult = await Swal.fire({
        title: t('rbac.create.syncWarningTitle', 'Sync Warning'),
        html: `<div style="text-align:left;font-size:14px"><ul>${syncErrors.map(e => `<li>⚠️ ${e}</li>`).join('')}</ul><p style="margin-top:12px">${t('rbac.create.syncWarningContinue', 'Do you want to continue anyway?')}</p></div>`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: t('rbac.create.continueAnyway', 'Continue Anyway'),
        cancelButtonText: t('rbac.confirm.cancel'),
      });
      if (!syncResult.isConfirmed) return;
    }

    setSaving(true);
    try {
      const errors: string[] = [];

      if (createMode === 'unconfigured') {
        // Batch create for unconfigured permissions
        for (const key of selectedUnconfigured) {
          if (permType === 'frontend') {
            const item = unconfiguredFrontendPerms.find(p => p.ui_key === key);
            if (!item) continue;
            for (const role of item.missingRoles) {
              try {
                await onCreateFrontend({
                  role,
                  ui_key: item.ui_key,
                  permission_key: item.permission_key,
                  allowed,
                });
              } catch (e: any) {
                errors.push(`${ROLE_LABELS[role] || role}:${item.ui_key}: ${e?.response?.data?.message || e.message}`);
              }
            }
          } else {
            const item = unconfiguredBackendPerms.find(p => p.permission_key === key);
            if (!item) continue;
            for (const role of item.missingRoles) {
              try {
                await onCreateBackend({
                  role,
                  resource: item.resource,
                  action: item.action,
                  permission_key: item.permission_key,
                  scope,
                  allowed,
                });
              } catch (e: any) {
                errors.push(`${ROLE_LABELS[role] || role}:${item.permission_key}: ${e?.response?.data?.message || e.message}`);
              }
            }
          }
        }
      } else {
        // New permission creation
        for (const role of selectedRoles) {
          try {
            if (permType === 'backend') {
              await onCreateBackend({
                role,
                resource: effectiveResource,
                action,
                permission_key: generatedPermKey,
                scope,
                allowed,
              });
            } else {
              await onCreateFrontend({
                role,
                ui_key: effectiveUiKey,
                permission_key: generatedPermKey,
                allowed,
              });
            }
          } catch (e: any) {
            errors.push(`${ROLE_LABELS[role] || role}: ${e?.response?.data?.message || e.message}`);
          }
        }
      }

      if (errors.length > 0) {
        Swal.fire({
          title: t('rbac.create.partialSuccess'),
          html: `<p>${t('rbac.create.someErrors')}</p><ul style="text-align:left">${errors.map(e => `<li>• ${e}</li>`).join('')}</ul>`,
          icon: 'warning',
        });
      } else {
        const count = createMode === 'unconfigured' ? selectedUnconfigured.length : selectedRoles.length;
        Swal.fire({
          title: t('rbac.create.success'),
          text: t('rbac.create.successDesc', { count }),
          icon: 'success',
          timer: 2500,
          showConfirmButton: false,
        });
        resetForm();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  const unconfiguredCount = permType === 'frontend' ? unconfiguredFrontendPerms.length : unconfiguredBackendPerms.length;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { resetForm(); onClose(); } }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            {t('rbac.create.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Permission Type */}
          <Tabs value={permType} onValueChange={(v) => { setPermType(v as 'backend' | 'frontend'); setSelectedUnconfigured([]); }}>
            <TabsList className="w-full">
              <TabsTrigger value="frontend" className="flex-1">{t('rbac.create.frontendUi')}</TabsTrigger>
              <TabsTrigger value="backend" className="flex-1">{t('rbac.create.backendApi')}</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('rbac.create.selectRoles')}</Label>
            <div className="flex flex-wrap gap-2">
              {visibleRoles.map(role => (
                <Badge
                  key={role}
                  variant={selectedRoles.includes(role) ? 'default' : 'outline'}
                  className="cursor-pointer transition-colors hover:opacity-80"
                  onClick={() => toggleRole(role)}
                >
                  {ROLE_LABELS[role] || role}
                </Badge>
              ))}
            </div>
            {currentUserRole === 'admin' && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                {t('rbac.create.adminOnlyManagerGuest', 'As admin, you can only manage permissions for your managers and guests.')}
              </p>
            )}
          </div>

          {/* Mode Selection */}
          {selectedRoles.length > 0 && (
            <Tabs value={createMode} onValueChange={(v) => { setCreateMode(v as CreateMode); setSelectedUnconfigured([]); }}>
              <TabsList className="w-full h-9">
                <TabsTrigger value="unconfigured" className="flex-1 text-xs gap-1">
                  {t('rbac.create.unconfiguredMode', 'Unconfigured Permissions')}
                  {unconfiguredCount > 0 && (
                    <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">{unconfiguredCount}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="new" className="flex-1 text-xs">
                  {t('rbac.create.newMode', 'Create New')}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* ─── Unconfigured Mode ───────────────────────────────────── */}
          {createMode === 'unconfigured' && selectedRoles.length > 0 && (
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={t('rbac.create.searchUnconfigured', 'Search unconfigured permissions...')}
                  className="pl-8"
                />
              </div>

              {/* Select all / count */}
              {unconfiguredCount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t('rbac.create.unconfiguredCount', '{{count}} permission(s) not yet configured for selected roles', { count: unconfiguredCount })}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={selectAllUnconfigured} className="text-xs h-7">
                      {t('rbac.create.selectAll', 'Select All')}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedUnconfigured([])} className="text-xs h-7">
                      {t('rbac.create.deselectAll', 'Deselect All')}
                    </Button>
                  </div>
                </div>
              )}

              {/* Frontend unconfigured list (grouped by category) */}
              {permType === 'frontend' && (
                <ScrollArea className="h-[300px] border rounded-md">
                  <div className="p-3 space-y-4">
                    {groupedUnconfiguredFrontend.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-8 w-8 mb-2 text-green-500" />
                        <p className="text-sm font-medium">{t('rbac.create.allConfigured', 'All permissions are configured!')}</p>
                        <p className="text-xs">{t('rbac.create.allConfiguredDesc', 'Switch to "Create New" to add a custom permission.')}</p>
                      </div>
                    ) : (
                      groupedUnconfiguredFrontend.map(([category, items]) => (
                        <div key={category}>
                          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{category}</h4>
                          <div className="space-y-1">
                            {items.map(item => (
                              <label
                                key={item.ui_key}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                                  selectedUnconfigured.includes(item.ui_key)
                                    ? 'bg-primary/10 border border-primary/30'
                                    : 'hover:bg-muted/50 border border-transparent'
                                }`}
                              >
                                <Checkbox
                                  checked={selectedUnconfigured.includes(item.ui_key)}
                                  onCheckedChange={() => toggleUnconfigured(item.ui_key)}
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{item.ui_key}</p>
                                  <p className="text-[11px] text-muted-foreground">
                                    {t('rbac.create.missingFor', 'Missing for')}: {item.missingRoles.map(r => ROLE_LABELS[r] || r).join(', ')}
                                  </p>
                                </div>
                                <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.permission_key}</code>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}

              {/* Backend unconfigured list */}
              {permType === 'backend' && (
                <ScrollArea className="h-[300px] border rounded-md">
                  <div className="p-3 space-y-1">
                    {unconfiguredBackendPerms.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <CheckCircle2 className="h-8 w-8 mb-2 text-green-500" />
                        <p className="text-sm font-medium">{t('rbac.create.allConfigured')}</p>
                      </div>
                    ) : (
                      unconfiguredBackendPerms.map(item => (
                        <label
                          key={item.permission_key}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                            selectedUnconfigured.includes(item.permission_key)
                              ? 'bg-primary/10 border border-primary/30'
                              : 'hover:bg-muted/50 border border-transparent'
                          }`}
                        >
                          <Checkbox
                            checked={selectedUnconfigured.includes(item.permission_key)}
                            onCheckedChange={() => toggleUnconfigured(item.permission_key)}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{item.resource} → {item.action}</p>
                            <p className="text-[11px] text-muted-foreground">
                              {t('rbac.create.missingFor')}: {item.missingRoles.map(r => ROLE_LABELS[r] || r).join(', ')}
                            </p>
                          </div>
                          <code className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{item.permission_key}</code>
                        </label>
                      ))
                    )}
                  </div>
                </ScrollArea>
              )}

              {/* Default status + scope for batch */}
              {selectedUnconfigured.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-md">
                    <div>
                      <Label>{t('rbac.create.defaultStatus')}</Label>
                      <p className="text-xs text-muted-foreground">{t('rbac.create.defaultStatusDesc')}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{allowed ? t('rbac.confirm.allowed') : t('rbac.confirm.denied')}</span>
                      <Switch checked={allowed} onCheckedChange={setAllowed} />
                    </div>
                  </div>
                  {permType === 'backend' && (
                    <div className="space-y-2">
                      <Label>{t('rbac.create.scope')}</Label>
                      <Select value={scope} onValueChange={v => setScope(v as RbacScope)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SCOPE_OPTIONS.map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ─── New Permission Mode ─────────────────────────────────── */}
          {createMode === 'new' && selectedRoles.length > 0 && (
            <div className="space-y-4">
              {/* Backend Fields */}
              {permType === 'backend' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('rbac.create.resource')}</Label>
                    <Select value={resource} onValueChange={setResource}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('rbac.create.selectResource')} />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="max-h-[200px]">
                          {existingResources.map(r => (
                            <SelectItem key={r} value={r}>{r}</SelectItem>
                          ))}
                          <SelectItem value="__custom__">
                            ➕ {t('rbac.create.newResource')}
                          </SelectItem>
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    {resource === '__custom__' && (
                      <Input value={customResource} onChange={e => setCustomResource(e.target.value)} placeholder={t('rbac.create.resourcePlaceholder')} />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>{t('rbac.create.accessType')}</Label>
                    <Select value={action} onValueChange={setAction}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('rbac.create.selectAccess')} />
                      </SelectTrigger>
                      <SelectContent>
                        {ACCESS_TYPES.map(a => (
                          <SelectItem key={a.value} value={a.value}>{t(a.labelKey, a.value)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('rbac.create.scope')}</Label>
                    <Select value={scope} onValueChange={v => setScope(v as RbacScope)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SCOPE_OPTIONS.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Frontend Fields */}
              {permType === 'frontend' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('rbac.create.uiKey')}</Label>
                    <Select value={uiKey} onValueChange={setUiKey}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('rbac.create.selectUiKey')} />
                      </SelectTrigger>
                      <SelectContent>
                        <ScrollArea className="max-h-[200px]">
                          {existingUiKeys.map(k => (
                            <SelectItem key={k} value={k}>{k}</SelectItem>
                          ))}
                          <SelectItem value="__custom__">
                            ➕ {t('rbac.create.newUiKey')}
                          </SelectItem>
                        </ScrollArea>
                      </SelectContent>
                    </Select>
                    {uiKey === '__custom__' && (
                      <Input value={customUiKey} onChange={e => setCustomUiKey(e.target.value)} placeholder={t('rbac.create.uiKeyPlaceholder')} />
                    )}
                  </div>
                </div>
              )}

              {/* Permission Key */}
              <div className="space-y-2">
                <Label>{t('rbac.create.permKey')}</Label>
                <Tabs value={permKeyMode} onValueChange={v => setPermKeyMode(v as 'existing' | 'new')}>
                  <TabsList className="w-full h-8">
                    <TabsTrigger value="new" className="flex-1 text-xs">{t('rbac.create.autoGenerate')}</TabsTrigger>
                    <TabsTrigger value="existing" className="flex-1 text-xs">{t('rbac.create.fromExisting')}</TabsTrigger>
                  </TabsList>
                </Tabs>
                {permKeyMode === 'new' ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-muted/50 rounded-md border">
                      <code className="text-sm text-foreground">{generatedPermKey || t('rbac.create.fillFields')}</code>
                    </div>
                    <Input
                      value={customPermKey}
                      onChange={e => setCustomPermKey(e.target.value)}
                      placeholder={t('rbac.create.customPermKeyPlaceholder', 'Override auto-generated key (optional)...')}
                      className="text-xs"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input value={permKeySearch} onChange={e => setPermKeySearch(e.target.value)} placeholder={t('rbac.create.searchPermKey')} className="pl-8" />
                    </div>
                    <ScrollArea className="h-[150px] border rounded-md">
                      <div className="p-2 space-y-1">
                        {filteredPermKeys.map(key => (
                          <button
                            key={key}
                            onClick={() => setExistingPermKey(key)}
                            className={`w-full text-left px-3 py-1.5 rounded text-sm transition-colors ${
                              existingPermKey === key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                            }`}
                          >
                            {key}
                          </button>
                        ))}
                        {filteredPermKeys.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">{t('rbac.create.noKeysFound')}</p>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>

              {/* Default Status */}
              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <Label>{t('rbac.create.defaultStatus')}</Label>
                  <p className="text-xs text-muted-foreground">{t('rbac.create.defaultStatusDesc')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{allowed ? t('rbac.confirm.allowed') : t('rbac.confirm.denied')}</span>
                  <Switch checked={allowed} onCheckedChange={setAllowed} />
                </div>
              </div>

              {/* Sync warnings */}
              {syncErrors.length > 0 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <div className="space-y-1">
                    {syncErrors.map((err, i) => (
                      <p key={i} className="text-xs text-amber-700 dark:text-amber-400">{err}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onClose(); }} disabled={saving}>
            {t('rbac.confirm.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid() || saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
            {createMode === 'unconfigured'
              ? t('rbac.create.addSelected', 'Add Selected ({{count}})', { count: selectedUnconfigured.length })
              : t('rbac.create.createBtn')
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

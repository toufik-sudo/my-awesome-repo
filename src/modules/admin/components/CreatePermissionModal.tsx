import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Info, Link2, Loader2, Plus, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import type { BackendCatalogController, RbacBackendPermission, RbacFrontendPermission } from '../rbac-config.api';
import type { PermissionBinding } from '../permission-bindings.api';
import { permissionBindingsApi } from '../permission-bindings.api';
import { FRONTEND_API_CATALOG } from '../frontend-api-catalog.generated';

const METHOD_OPTIONS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const ROLE_LABELS: Record<string, string> = {
  hyper_admin: 'Hyper Admin',
  hyper_manager: 'Hyper Manager',
  admin: 'Admin',
  manager: 'Manager',
  user: 'User',
  guest: 'Guest',
};

export interface CreatePermissionPrefill {
  type: 'backend' | 'binding';
  /** Backend prefill */
  controller?: string;
  endpoint?: string;
  method?: string;
  endpoint_url?: string;
  module?: string;
  permission_key?: string;
  /** Binding prefill — orphan/missing frontend API key */
  frontendApiKey?: string;
}

interface CreatePermissionModalProps {
  open: boolean;
  onClose: () => void;
  roles: string[];
  existingBackendPerms: RbacBackendPermission[];
  existingFrontendPerms: RbacFrontendPermission[];
  existingBindings: PermissionBinding[];
  backendCatalog: BackendCatalogController[];
  prefill?: CreatePermissionPrefill | null;
  onCreateBackend: (data: {
    controller: string;
    endpoint: string;
    method: string;
    endpoint_url?: string;
    user_roles: string[];
    allowed?: boolean;
    module?: string;
    description?: string;
  }) => Promise<void>;
  onCreateFrontend: (data: {
    component: string;
    sub_view?: string;
    element_type?: string;
    action_name?: string;
    user_roles: string[];
    allowed?: boolean;
    module?: string;
    description?: string;
  }) => Promise<void>;
  onCreated?: () => Promise<void> | void;
  currentUserRole?: string;
}

export const CreatePermissionModal: React.FC<CreatePermissionModalProps> = ({
  open,
  onClose,
  roles,
  existingBackendPerms,
  existingFrontendPerms,
  existingBindings,
  backendCatalog,
  prefill,
  onCreateBackend,
  onCreateFrontend,
  onCreated,
}) => {
  const { t } = useTranslation();
  const [permType, setPermType] = useState<'backend' | 'frontend' | 'binding'>('frontend');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const [controller, setController] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('GET');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [allowed, setAllowed] = useState(true);
  const [module, setModule] = useState('');
  const [description, setDescription] = useState('');

  const [component, setComponent] = useState('');
  const [subView, setSubView] = useState('');
  const [elementType, setElementType] = useState('');
  const [actionName, setActionName] = useState('');

  const [bindingController, setBindingController] = useState('');
  const [bindingEndpoint, setBindingEndpoint] = useState('');
  const [bindingMethod, setBindingMethod] = useState('GET');
  const [bindingApiService, setBindingApiService] = useState('');
  const [bindingApiAction, setBindingApiAction] = useState('');
  const [bindingApiMethod, setBindingApiMethod] = useState('GET');
  const [bindingModule, setBindingModule] = useState('');
  const [bindingEndpointUrl, setBindingEndpointUrl] = useState('');
  const [bindingFrontendUrl, setBindingFrontendUrl] = useState('');

  const controllerOptions = useMemo(
    () => backendCatalog.map((item) => item.controller).sort((a, b) => a.localeCompare(b)),
    [backendCatalog],
  );

  const endpointOptions = useMemo(() => {
    const entry = backendCatalog.find((item) => item.controller === controller);
    if (!entry) return [];
    return [...new Set(entry.endpoints.map((item) => item.endpoint))].sort((a, b) => a.localeCompare(b));
  }, [backendCatalog, controller]);

  const methodOptions = useMemo(() => {
    const entry = backendCatalog.find((item) => item.controller === controller);
    if (!entry || !endpoint) return METHOD_OPTIONS;
    return entry.endpoints
      .filter((item) => item.endpoint === endpoint)
      .map((item) => item.method)
      .sort((a, b) => a.localeCompare(b));
  }, [backendCatalog, controller, endpoint]);

  const selectedBackendCatalogEndpoint = useMemo(() => {
    const entry = backendCatalog.find((item) => item.controller === controller);
    return entry?.endpoints.find((item) => item.endpoint === endpoint && item.method === method) ?? null;
  }, [backendCatalog, controller, endpoint, method]);

  const availableBindingBackendCatalog = useMemo(() => {
    const allowedKeys = new Set(existingBackendPerms.map((item) => item.permission_key));
    return backendCatalog
      .map((item) => ({
        controller: item.controller,
        endpoints: item.endpoints.filter((endpointItem) => allowedKeys.has(endpointItem.permission_key)),
      }))
      .filter((item) => item.endpoints.length > 0);
  }, [backendCatalog, existingBackendPerms]);

  const bindingControllerOptions = useMemo(
    () => availableBindingBackendCatalog.map((item) => item.controller).sort((a, b) => a.localeCompare(b)),
    [availableBindingBackendCatalog],
  );

  const bindingEndpointOptions = useMemo(() => {
    const entry = availableBindingBackendCatalog.find((item) => item.controller === bindingController);
    if (!entry) return [];
    return [...new Set(entry.endpoints.map((item) => item.endpoint))].sort((a, b) => a.localeCompare(b));
  }, [availableBindingBackendCatalog, bindingController]);

  const bindingMethodOptions = useMemo(() => {
    const entry = availableBindingBackendCatalog.find((item) => item.controller === bindingController);
    if (!entry || !bindingEndpoint) return METHOD_OPTIONS;
    return entry.endpoints
      .filter((item) => item.endpoint === bindingEndpoint)
      .map((item) => item.method)
      .sort((a, b) => a.localeCompare(b));
  }, [availableBindingBackendCatalog, bindingController, bindingEndpoint]);

  const selectedBindingBackendEndpoint = useMemo(() => {
    const entry = availableBindingBackendCatalog.find((item) => item.controller === bindingController);
    return entry?.endpoints.find((item) => item.endpoint === bindingEndpoint && item.method === bindingMethod) ?? null;
  }, [availableBindingBackendCatalog, bindingController, bindingEndpoint, bindingMethod]);

  const bindingBackendPermission = useMemo(
    () => existingBackendPerms.find((item) => item.permission_key === selectedBindingBackendEndpoint?.permission_key) ?? null,
    [existingBackendPerms, selectedBindingBackendEndpoint],
  );

  const frontendServiceOptions = useMemo(
    () => [...new Set(FRONTEND_API_CATALOG.map((item) => item.service))].sort((a, b) => a.localeCompare(b)),
    [],
  );

  const frontendActionOptions = useMemo(() => {
    return FRONTEND_API_CATALOG.filter((item) => item.service === bindingApiService)
      .map((item) => item.fn)
      .sort((a, b) => a.localeCompare(b));
  }, [bindingApiService]);

  const frontendMethodOptions = useMemo(() => {
    return FRONTEND_API_CATALOG.filter((item) => item.service === bindingApiService && item.fn === bindingApiAction)
      .map((item) => item.method)
      .sort((a, b) => a.localeCompare(b));
  }, [bindingApiService, bindingApiAction]);

  const selectedFrontendApiCatalogEntry = useMemo(() => {
    return (
      FRONTEND_API_CATALOG.find(
        (item) => item.service === bindingApiService && item.fn === bindingApiAction && item.method === bindingApiMethod,
      ) ?? null
    );
  }, [bindingApiAction, bindingApiMethod, bindingApiService]);

  const generatedBackendKey = useMemo(() => {
    if (selectedBackendCatalogEndpoint?.permission_key) return selectedBackendCatalogEndpoint.permission_key;
    if (!controller || !endpoint || !method) return '';
    return `backend.${controller}.${endpoint}.${method}`;
  }, [controller, endpoint, method, selectedBackendCatalogEndpoint]);

  const generatedFrontendKey = useMemo(() => {
    const parts = ['ui', component];
    if (subView) parts.push(subView);
    if (elementType) parts.push(elementType);
    if (actionName) parts.push(actionName);
    return component ? parts.join('.') : '';
  }, [actionName, component, elementType, subView]);

  const generatedFrontendApiKey = useMemo(() => {
    if (selectedFrontendApiCatalogEntry?.frontendPermissionApi) return selectedFrontendApiCatalogEntry.frontendPermissionApi;
    if (!bindingApiService || !bindingApiAction || !bindingApiMethod) return '';
    return `${bindingApiService}.${bindingApiAction}.${bindingApiMethod}`;
  }, [bindingApiAction, bindingApiMethod, bindingApiService, selectedFrontendApiCatalogEntry]);

  const bindingAlreadyExists = useMemo(() => {
    if (!selectedBindingBackendEndpoint || !generatedFrontendApiKey) return false;
    return existingBindings.some(
      (item) =>
        item.backendPermissionKey === selectedBindingBackendEndpoint.permission_key &&
        item.frontendPermissionApi === generatedFrontendApiKey,
    );
  }, [existingBindings, generatedFrontendApiKey, selectedBindingBackendEndpoint]);

  useEffect(() => {
    if (!selectedBackendCatalogEndpoint) return;
    setEndpointUrl(selectedBackendCatalogEndpoint.endpoint_url ?? '');
    setModule((current) => current || selectedBackendCatalogEndpoint.module || 'general');
  }, [selectedBackendCatalogEndpoint]);

  useEffect(() => {
    if (!selectedBindingBackendEndpoint) return;
    setBindingEndpointUrl(selectedBindingBackendEndpoint.endpoint_url ?? '');
    setBindingModule((current) => current || selectedBindingBackendEndpoint.module || 'general');
  }, [selectedBindingBackendEndpoint]);

  useEffect(() => {
    if (!selectedFrontendApiCatalogEntry) return;
    setBindingFrontendUrl(selectedFrontendApiCatalogEntry.endpoint_url ?? '');
  }, [selectedFrontendApiCatalogEntry]);

  // Apply prefill from Diff panel quick-create actions when the modal opens
  useEffect(() => {
    if (!open || !prefill) return;
    if (prefill.type === 'backend') {
      setPermType('backend');
      if (prefill.controller) setController(prefill.controller);
      if (prefill.endpoint) setEndpoint(prefill.endpoint);
      if (prefill.method) setMethod(prefill.method);
      if (prefill.endpoint_url) setEndpointUrl(prefill.endpoint_url);
      if (prefill.module) setModule(prefill.module);
    } else if (prefill.type === 'binding') {
      setPermType('binding');
      const key = prefill.frontendApiKey || '';
      const parts = key.split('.');
      if (parts.length >= 3) {
        setBindingApiService(parts[0]);
        setBindingApiAction(parts[1]);
        setBindingApiMethod(parts[parts.length - 1]);
      }
      if (prefill.module) setBindingModule(prefill.module);
    }
  }, [open, prefill]);

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) => (prev.includes(role) ? prev.filter((item) => item !== role) : [...prev, role]));
  };

  const isValid = () => {
    if (permType === 'binding') {
      return !!selectedBindingBackendEndpoint && !!bindingApiService && !!bindingApiAction && !!bindingApiMethod && !bindingAlreadyExists;
    }
    if (selectedRoles.length === 0) return false;
    if (permType === 'backend') return !!controller && !!endpoint && !!method && !!endpointUrl;
    return !!component;
  };

  const resetForm = () => {
    setSelectedRoles([]);
    setController('');
    setEndpoint('');
    setMethod('GET');
    setEndpointUrl('');
    setAllowed(true);
    setModule('');
    setDescription('');
    setComponent('');
    setSubView('');
    setElementType('');
    setActionName('');
    setBindingController('');
    setBindingEndpoint('');
    setBindingMethod('GET');
    setBindingApiService('');
    setBindingApiAction('');
    setBindingApiMethod('GET');
    setBindingModule('');
    setBindingEndpointUrl('');
    setBindingFrontendUrl('');
    setPermType('frontend');
  };

  const handleSubmit = async () => {
    if (!isValid()) return;
    setSaving(true);
    try {
      if (permType === 'binding') {
        await permissionBindingsApi.createByKeys({
          backendPermissionKey: selectedBindingBackendEndpoint!.permission_key,
          frontendPermissionApi: generatedFrontendApiKey,
          endpoint_url: bindingEndpointUrl || selectedBindingBackendEndpoint?.endpoint_url || undefined,
          module: bindingModule || selectedBindingBackendEndpoint?.module || 'general',
        });
        toast.success(t('rbac.create.bindingCreated', 'Binding created successfully'));
      } else if (permType === 'backend') {
        const exists = existingBackendPerms.find((item) => item.permission_key === generatedBackendKey);
        if (exists) {
          toast.error(t('rbac.create.backendExists', 'This backend permission already exists. Use the API Binding tab.'));
          setSaving(false);
          return;
        }
        await onCreateBackend({
          controller,
          endpoint,
          method,
          endpoint_url: endpointUrl,
          user_roles: selectedRoles,
          allowed,
          module: module || selectedBackendCatalogEndpoint?.module || 'general',
          description: description || selectedBackendCatalogEndpoint?.description || undefined,
        });
      } else {
        const exists = existingFrontendPerms.find((item) => item.permission_key === generatedFrontendKey);
        if (exists) {
          toast.error(t('rbac.create.frontendExists', 'This frontend permission already exists.'));
          setSaving(false);
          return;
        }
        await onCreateFrontend({
          component,
          sub_view: subView || undefined,
          element_type: elementType || undefined,
          action_name: actionName || undefined,
          user_roles: selectedRoles,
          allowed,
          module: module || 'general',
          description: description || undefined,
        });
      }

      await onCreated?.();
      toast.success(t('rbac.create.success'));
      resetForm();
      onClose();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || t('rbac.errors.createFailed', 'Creation failed'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) {
        resetForm();
        onClose();
      }
    }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            {t('rbac.create.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <Tabs value={permType} onValueChange={(value) => setPermType(value as 'backend' | 'frontend' | 'binding')}>
            <TabsList className="w-full">
              <TabsTrigger value="frontend" className="flex-1">{t('rbac.create.frontendUi')}</TabsTrigger>
              <TabsTrigger value="backend" className="flex-1">{t('rbac.create.backendApi')}</TabsTrigger>
              <TabsTrigger value="binding" className="flex-1 flex items-center gap-1">
                <Link2 className="h-3.5 w-3.5" />
                {t('rbac.create.apiBinding', 'API Binding')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="binding" className="space-y-4 mt-4">
              <div className="p-3 rounded-lg border bg-muted/30 text-sm text-muted-foreground flex items-start gap-2">
                <Info className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{t('rbac.create.bindingDescription', 'Link an existing backend permission to a frontend API request.')}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Controller *</Label>
                  <Select value={bindingController} onValueChange={(value) => {
                    setBindingController(value);
                    setBindingEndpoint('');
                    setBindingMethod('GET');
                    setBindingEndpointUrl('');
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select controller" /></SelectTrigger>
                    <SelectContent>
                      {bindingControllerOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Endpoint *</Label>
                  <Select value={bindingEndpoint} onValueChange={(value) => {
                    setBindingEndpoint(value);
                    setBindingMethod('GET');
                    setBindingEndpointUrl('');
                  }} disabled={!bindingController}>
                    <SelectTrigger><SelectValue placeholder="Select endpoint" /></SelectTrigger>
                    <SelectContent>
                      {bindingEndpointOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Method *</Label>
                  <Select value={bindingMethod} onValueChange={setBindingMethod} disabled={!bindingEndpoint}>
                    <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      {bindingMethodOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Backend Permission Key</Label>
                  <Input value={selectedBindingBackendEndpoint?.permission_key || ''} readOnly />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Backend API URL</Label>
                  <Input value={bindingEndpointUrl} onChange={(e) => setBindingEndpointUrl(e.target.value)} placeholder="/api/properties" />
                </div>
              </div>

              {bindingBackendPermission && (
                <div className="p-2 rounded border bg-muted/30">
                  <div className="text-xs text-muted-foreground mb-2">Roles</div>
                  <div className="flex flex-wrap gap-1">
                    {bindingBackendPermission.user_roles.map((role) => (
                      <Badge key={role} variant="outline" className="text-[10px] px-1 py-0">{ROLE_LABELS[role] || role}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Frontend API Service *</Label>
                  <Select value={bindingApiService} onValueChange={(value) => {
                    setBindingApiService(value);
                    setBindingApiAction('');
                    setBindingApiMethod('GET');
                    setBindingFrontendUrl('');
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                    <SelectContent>
                      {frontendServiceOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Function *</Label>
                  <Select value={bindingApiAction} onValueChange={(value) => {
                    setBindingApiAction(value);
                    setBindingApiMethod('GET');
                    setBindingFrontendUrl('');
                  }} disabled={!bindingApiService}>
                    <SelectTrigger><SelectValue placeholder="Select function" /></SelectTrigger>
                    <SelectContent>
                      {frontendActionOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">HTTP Method *</Label>
                  <Select value={bindingApiMethod} onValueChange={setBindingApiMethod} disabled={!bindingApiAction}>
                    <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      {frontendMethodOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Frontend API Key</Label>
                  <Input value={generatedFrontendApiKey} readOnly />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Frontend API URL</Label>
                  <Input value={bindingFrontendUrl} onChange={(e) => setBindingFrontendUrl(e.target.value)} placeholder="/bookings" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Module</Label>
                  <Input value={bindingModule} onChange={(e) => setBindingModule(e.target.value)} placeholder="general" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Preview</Label>
                  <div className="min-h-10 rounded-md border bg-muted/30 px-3 py-2 text-xs font-mono flex items-center gap-2 overflow-x-auto">
                    <span className="text-primary">{generatedFrontendApiKey || 'frontendApi.method.HTTP'}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span>{selectedBindingBackendEndpoint?.permission_key || 'backend.Controller.endpoint.METHOD'}</span>
                  </div>
                </div>
              </div>

              {bindingAlreadyExists && (
                <div className="p-3 rounded-lg border bg-muted/30 text-sm text-destructive">
                  {t('rbac.create.bindingExists', 'This binding already exists.')}
                </div>
              )}
            </TabsContent>

            <TabsContent value="backend" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('rbac.create.selectRoles')}</Label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Controller *</Label>
                  <Select value={controller} onValueChange={(value) => {
                    setController(value);
                    setEndpoint('');
                    setMethod('GET');
                    setEndpointUrl('');
                  }}>
                    <SelectTrigger><SelectValue placeholder="Select controller" /></SelectTrigger>
                    <SelectContent>
                      {controllerOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Endpoint *</Label>
                  <Select value={endpoint} onValueChange={(value) => {
                    setEndpoint(value);
                    setMethod('GET');
                    setEndpointUrl('');
                  }} disabled={!controller}>
                    <SelectTrigger><SelectValue placeholder="Select endpoint" /></SelectTrigger>
                    <SelectContent>
                      {endpointOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Method *</Label>
                  <Select value={method} onValueChange={setMethod} disabled={!endpoint}>
                    <SelectTrigger><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      {methodOptions.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Permission Key</Label>
                  <Input value={generatedBackendKey} readOnly />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Backend API URL *</Label>
                  <Input value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} placeholder="/properties" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Module</Label>
                  <Input value={module} onChange={(e) => setModule(e.target.value)} placeholder="properties" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Create a property" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label>{t('rbac.create.defaultStatus')}</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{allowed ? '✅ Allowed' : '❌ Denied'}</span>
                  <Switch checked={allowed} onCheckedChange={setAllowed} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="frontend" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t('rbac.create.selectRoles')}</Label>
                <div className="flex flex-wrap gap-2">
                  {roles.map((role) => (
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Component *</Label>
                  <Input value={component} onChange={(e) => setComponent(e.target.value)} placeholder="PropertyListPage" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Sub View</Label>
                  <Input value={subView} onChange={(e) => setSubView(e.target.value)} placeholder="Header" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Element Type</Label>
                  <Input value={elementType} onChange={(e) => setElementType(e.target.value)} placeholder="Button" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Action Name</Label>
                  <Input value={actionName} onChange={(e) => setActionName(e.target.value)} placeholder="Add" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Permission Key</Label>
                  <Input value={generatedFrontendKey} readOnly />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Module</Label>
                  <Input value={module} onChange={(e) => setModule(e.target.value)} placeholder="properties" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Open add property wizard" />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <Label>{t('rbac.create.defaultStatus')}</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{allowed ? '✅ Allowed' : '❌ Denied'}</span>
                    <Switch checked={allowed} onCheckedChange={setAllowed} />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => {
            resetForm();
            onClose();
          }}>
            {t('rbac.confirm.cancel')}
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid() || saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
            {permType === 'binding' ? t('rbac.create.createBinding', 'Create Binding') : t('rbac.create.btn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

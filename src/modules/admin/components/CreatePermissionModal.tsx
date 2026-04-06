import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Plus, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { RbacBackendPermission, RbacFrontendPermission, RbacScope } from '../rbac-config.api';

const SCOPE_OPTIONS: RbacScope[] = ['global', 'admin', 'assigned', 'own', 'inherited'];
const METHOD_OPTIONS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const ROLE_LABELS: Record<string, string> = {
  hyper_admin: 'Hyper Admin', hyper_manager: 'Hyper Manager', admin: 'Admin',
  manager: 'Manager', user: 'User', guest: 'Guest',
};

interface CreatePermissionModalProps {
  open: boolean;
  onClose: () => void;
  roles: string[];
  existingBackendPerms: RbacBackendPermission[];
  existingFrontendPerms: RbacFrontendPermission[];
  onCreateBackend: (data: {
    controller: string;
    endpoint: string;
    method: string;
    user_roles: string[];
    scope?: RbacScope;
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
  currentUserRole?: string;
}

export const CreatePermissionModal: React.FC<CreatePermissionModalProps> = ({
  open, onClose, roles, existingBackendPerms, existingFrontendPerms,
  onCreateBackend, onCreateFrontend, currentUserRole = 'hyper_admin',
}) => {
  const { t } = useTranslation();
  const [permType, setPermType] = useState<'backend' | 'frontend'>('frontend');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Backend fields
  const [controller, setController] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [method, setMethod] = useState('GET');
  const [scope, setScope] = useState<RbacScope>('global');
  const [allowed, setAllowed] = useState(true);
  const [module, setModule] = useState('');
  const [description, setDescription] = useState('');

  // Frontend fields
  const [component, setComponent] = useState('');
  const [subView, setSubView] = useState('');
  const [elementType, setElementType] = useState('');
  const [actionName, setActionName] = useState('');

  const generatedBackendKey = useMemo(() => {
    if (!controller || !endpoint || !method) return '';
    return `backend.${controller}.${endpoint}.${method}`;
  }, [controller, endpoint, method]);

  const generatedFrontendKey = useMemo(() => {
    const parts = ['ui', component];
    if (subView) parts.push(subView);
    if (elementType) parts.push(elementType);
    if (actionName) parts.push(actionName);
    return component ? parts.join('.') : '';
  }, [component, subView, elementType, actionName]);

  const toggleRole = (role: string) => {
    setSelectedRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
  };

  const isValid = () => {
    if (selectedRoles.length === 0) return false;
    if (permType === 'backend') return !!controller && !!endpoint && !!method;
    return !!component;
  };

  const resetForm = () => {
    setSelectedRoles([]);
    setController('');
    setEndpoint('');
    setMethod('GET');
    setScope('global');
    setAllowed(true);
    setModule('');
    setDescription('');
    setComponent('');
    setSubView('');
    setElementType('');
    setActionName('');
  };

  const handleSubmit = async () => {
    if (!isValid()) return;
    setSaving(true);
    try {
      if (permType === 'backend') {
        await onCreateBackend({
          controller,
          endpoint,
          method,
          user_roles: selectedRoles,
          scope,
          allowed,
          module: module || 'general',
          description: description || undefined,
        });
      } else {
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
    <Dialog open={open} onOpenChange={(v) => { if (!v) { resetForm(); onClose(); } }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            {t('rbac.create.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Type */}
          <Tabs value={permType} onValueChange={(v) => setPermType(v as 'backend' | 'frontend')}>
            <TabsList className="w-full">
              <TabsTrigger value="frontend" className="flex-1">{t('rbac.create.frontendUi')}</TabsTrigger>
              <TabsTrigger value="backend" className="flex-1">{t('rbac.create.backendApi')}</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">{t('rbac.create.selectRoles')}</Label>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
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

          {/* Backend Fields */}
          {permType === 'backend' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Controller</Label>
                  <Input value={controller} onChange={e => setController(e.target.value)} placeholder="PropertiesController" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Endpoint</Label>
                  <Input value={endpoint} onChange={e => setEndpoint(e.target.value)} placeholder="create" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Method</Label>
                  <Select value={method} onValueChange={setMethod}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{METHOD_OPTIONS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Scope</Label>
                <Select value={scope} onValueChange={v => setScope(v as RbacScope)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SCOPE_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {generatedBackendKey && (
                <div className="p-2 bg-muted/50 rounded border">
                  <span className="text-xs text-muted-foreground">Permission Key: </span>
                  <code className="text-xs font-mono text-foreground">{generatedBackendKey}</code>
                </div>
              )}
            </div>
          )}

          {/* Frontend Fields */}
          {permType === 'frontend' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Component *</Label>
                  <Input value={component} onChange={e => setComponent(e.target.value)} placeholder="PropertyListPage" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Sub View</Label>
                  <Input value={subView} onChange={e => setSubView(e.target.value)} placeholder="Header" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Element Type</Label>
                  <Input value={elementType} onChange={e => setElementType(e.target.value)} placeholder="Button" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Action Name</Label>
                  <Input value={actionName} onChange={e => setActionName(e.target.value)} placeholder="Add" />
                </div>
              </div>
              {generatedFrontendKey && (
                <div className="p-2 bg-muted/50 rounded border">
                  <span className="text-xs text-muted-foreground">Permission Key: </span>
                  <code className="text-xs font-mono text-foreground">{generatedFrontendKey}</code>
                </div>
              )}
            </div>
          )}

          {/* Common fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Module</Label>
              <Input value={module} onChange={e => setModule(e.target.value)} placeholder="properties" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Description</Label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Create a property" />
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-md">
            <Label>{t('rbac.create.defaultStatus')}</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{allowed ? '✅ Allowed' : '❌ Denied'}</span>
              <Switch checked={allowed} onCheckedChange={setAllowed} />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => { resetForm(); onClose(); }}>{t('rbac.confirm.cancel')}</Button>
          <Button onClick={handleSubmit} disabled={!isValid() || saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
            {t('rbac.create.btn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

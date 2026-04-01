import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  Search,
  Mail,
  Smartphone,
  Clock,
  MapPin,
  Filter,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { DynamicModal } from '@/modules/shared/components/DynamicModal';
import { swalAlert as toast } from '@/modules/shared/services/alert.service';
import { savedSearchAlertsApi, type SavedSearchAlert, type SavedSearchAlertPayload } from '@/modules/properties/properties.api';

const FREQUENCY_OPTIONS = [
  { value: 'instant', label: 'Instantané' },
  { value: 'daily', label: 'Quotidien' },
  { value: 'weekly', label: 'Hebdomadaire' },
];

const CHANNEL_OPTIONS = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'push', label: 'Push', icon: Smartphone },
  { value: 'sms', label: 'SMS', icon: Smartphone },
];

export const AlertsSettings: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [createOpen, setCreateOpen] = useState(false);
  const [editingAlert, setEditingAlert] = useState<SavedSearchAlert | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formType, setFormType] = useState('');
  const [formMinPrice, setFormMinPrice] = useState('');
  const [formMaxPrice, setFormMaxPrice] = useState('');
  const [formGuests, setFormGuests] = useState('');
  const [formBedrooms, setFormBedrooms] = useState('');
  const [formMinTrust, setFormMinTrust] = useState('');
  const [formAllowPets, setFormAllowPets] = useState(false);
  const [formFrequency, setFormFrequency] = useState<string>('daily');
  const [formChannels, setFormChannels] = useState<string[]>(['email']);

  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['saved-search-alerts'],
    queryFn: savedSearchAlertsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: savedSearchAlertsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-search-alerts'] });
      toast.success('Alerte créée avec succès');
      resetForm();
      setCreateOpen(false);
    },
    onError: () => toast.error('Erreur lors de la création'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      savedSearchAlertsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-search-alerts'] });
      toast.success('Alerte mise à jour');
      setEditingAlert(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: savedSearchAlertsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-search-alerts'] });
      toast.success('Alerte supprimée');
    },
  });

  const resetForm = () => {
    setFormName('');
    setFormCity('');
    setFormType('');
    setFormMinPrice('');
    setFormMaxPrice('');
    setFormGuests('');
    setFormBedrooms('');
    setFormMinTrust('');
    setFormAllowPets(false);
    setFormFrequency('daily');
    setFormChannels(['email']);
  };

  const populateForm = (alert: SavedSearchAlert) => {
    const c = alert.criteria;
    setFormName(alert.name);
    setFormCity(c.city || '');
    setFormType(c.type || '');
    setFormMinPrice(c.minPrice ? String(c.minPrice) : '');
    setFormMaxPrice(c.maxPrice ? String(c.maxPrice) : '');
    setFormGuests(c.guests ? String(c.guests) : '');
    setFormBedrooms(c.bedrooms ? String(c.bedrooms) : '');
    setFormMinTrust(c.minTrustStars ? String(c.minTrustStars) : '');
    setFormAllowPets(c.allowPets || false);
    setFormFrequency(alert.frequency);
    setFormChannels(alert.channels);
    setEditingAlert(alert);
    setCreateOpen(true);
  };

  const buildPayload = (): SavedSearchAlertPayload => ({
    name: formName,
    criteria: {
      ...(formCity && { city: formCity }),
      ...(formType && { type: formType }),
      ...(formMinPrice && { minPrice: parseFloat(formMinPrice) }),
      ...(formMaxPrice && { maxPrice: parseFloat(formMaxPrice) }),
      ...(formGuests && { guests: parseInt(formGuests) }),
      ...(formBedrooms && { bedrooms: parseInt(formBedrooms) }),
      ...(formMinTrust && { minTrustStars: parseInt(formMinTrust) }),
      ...(formAllowPets && { allowPets: true }),
    },
    frequency: formFrequency as any,
    channels: formChannels as any,
  });

  const handleSubmit = () => {
    if (!formName.trim()) {
      toast.error('Veuillez donner un nom à votre alerte');
      return;
    }
    const payload = buildPayload();
    if (editingAlert) {
      updateMutation.mutate({ id: editingAlert.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const toggleChannel = (channel: string) => {
    setFormChannels(prev =>
      prev.includes(channel) ? prev.filter(c => c !== channel) : [...prev, channel]
    );
  };

  const toggleAlertActive = (alert: SavedSearchAlert) => {
    updateMutation.mutate({
      id: alert.id,
      data: { isActive: !alert.isActive },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Alertes de recherche
              </CardTitle>
              <CardDescription>
                Soyez notifié lorsque de nouvelles propriétés correspondent à vos critères de recherche.
              </CardDescription>
            </div>
            <Button
              onClick={() => { resetForm(); setEditingAlert(null); setCreateOpen(true); }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Nouvelle alerte
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Alert List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : alerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <BellOff className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">Aucune alerte configurée</p>
            <p className="text-sm text-muted-foreground mt-1">
              Créez une alerte pour être notifié des nouvelles propriétés
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {alerts.map(alert => (
            <Card key={alert.id} className={!alert.isActive ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground truncate">{alert.name}</h3>
                      <Badge variant={alert.isActive ? 'default' : 'secondary'} className="text-[10px]">
                        {alert.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        {FREQUENCY_OPTIONS.find(f => f.value === alert.frequency)?.label || alert.frequency}
                      </Badge>
                    </div>

                    {/* Criteria badges */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {alert.criteria.city && (
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <MapPin className="h-3 w-3" /> {alert.criteria.city}
                        </Badge>
                      )}
                      {alert.criteria.type && (
                        <Badge variant="outline" className="text-[10px]">{alert.criteria.type}</Badge>
                      )}
                      {(alert.criteria.minPrice || alert.criteria.maxPrice) && (
                        <Badge variant="outline" className="text-[10px]">
                          {alert.criteria.minPrice || 0} - {alert.criteria.maxPrice || '∞'} DA
                        </Badge>
                      )}
                      {alert.criteria.guests && (
                        <Badge variant="outline" className="text-[10px]">{alert.criteria.guests}+ guests</Badge>
                      )}
                      {alert.criteria.allowPets && (
                        <Badge variant="outline" className="text-[10px]">🐾 Animaux</Badge>
                      )}
                    </div>

                    {/* Channels & stats */}
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.matchCount} résultat(s)
                      </span>
                      {alert.channels.includes('email') && (
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> Email</span>
                      )}
                      {alert.channels.includes('push') && (
                        <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> Push</span>
                      )}
                      {alert.channels.includes('sms') && (
                        <span className="flex items-center gap-1"><Smartphone className="h-3 w-3" /> SMS</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => toggleAlertActive(alert)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => populateForm(alert)}>
                      <Filter className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer l'alerte ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            L'alerte "{alert.name}" sera supprimée définitivement.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMutation.mutate(alert.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <DynamicModal
        open={createOpen}
        onOpenChange={(o) => { if (!o) { setCreateOpen(false); setEditingAlert(null); } }}
        title={editingAlert ? 'Modifier l\'alerte' : 'Nouvelle alerte de recherche'}
        size="md"
      >
        <div className="space-y-5 py-2">
          {/* Name */}
          <div className="space-y-2">
            <Label>Nom de l'alerte *</Label>
            <Input
              value={formName}
              onChange={e => setFormName(e.target.value)}
              placeholder="ex: Appartements Alger centre"
              maxLength={100}
            />
          </div>

          <Separator />

          {/* Criteria */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Search className="h-4 w-4" /> Critères de recherche
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Ville / Wilaya</Label>
                <Input value={formCity} onChange={e => setFormCity(e.target.value)} placeholder="Alger" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Type</Label>
                <Select value={formType} onValueChange={setFormType}>
                  <SelectTrigger><SelectValue placeholder="Tous" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem value="apartment">Appartement</SelectItem>
                    <SelectItem value="house">Maison</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="studio">Studio</SelectItem>
                    <SelectItem value="chalet">Chalet</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Prix min (DA)</Label>
                <Input type="number" value={formMinPrice} onChange={e => setFormMinPrice(e.target.value)} placeholder="0" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Prix max (DA)</Label>
                <Input type="number" value={formMaxPrice} onChange={e => setFormMaxPrice(e.target.value)} placeholder="∞" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Voyageurs min</Label>
                <Input type="number" value={formGuests} onChange={e => setFormGuests(e.target.value)} placeholder="1" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Chambres min</Label>
                <Input type="number" value={formBedrooms} onChange={e => setFormBedrooms(e.target.value)} placeholder="1" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={formAllowPets} onCheckedChange={c => setFormAllowPets(!!c)} id="alert-pets" />
              <Label htmlFor="alert-pets" className="text-sm cursor-pointer">Accepte les animaux</Label>
            </div>
          </div>

          <Separator />

          {/* Frequency */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Fréquence</Label>
            <Select value={formFrequency} onValueChange={setFormFrequency}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {FREQUENCY_OPTIONS.map(f => (
                  <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Channels */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Canaux de notification</Label>
            <div className="flex gap-3">
              {CHANNEL_OPTIONS.map(ch => (
                <label key={ch.value} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={formChannels.includes(ch.value)}
                    onCheckedChange={() => toggleChannel(ch.value)}
                  />
                  <ch.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{ch.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => { setCreateOpen(false); setEditingAlert(null); }}>
              Annuler
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Bell className="h-4 w-4" />
              {editingAlert ? 'Mettre à jour' : 'Créer l\'alerte'}
            </Button>
          </div>
        </div>
      </DynamicModal>
    </div>
  );
};

export default AlertsSettings;

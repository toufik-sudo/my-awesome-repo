import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, Smartphone, Shield, Megaphone, Calendar, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { settingsService } from './settings.service';
import { NotificationSettings } from './settings.types';

interface NotificationCategory {
  key: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  emailKey: keyof NotificationSettings;
  pushKey: keyof NotificationSettings;
  critical?: boolean;
}

export const NotificationPreferences: React.FC<{
  notifications: NotificationSettings | null;
  onUpdate: (settings: NotificationSettings) => void;
}> = ({ notifications, onUpdate }) => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<NotificationSettings>(
    notifications ?? {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      securityAlerts: true,
      weeklyDigest: false,
      commentReplies: true,
      commentRepliesPush: true,
      rankingUpdates: true,
      rankingUpdatesPush: false,
      newFollowers: true,
      newFollowersPush: true,
      systemAnnouncements: true,
      systemAnnouncementsPush: true,
      quietHoursEnabled: false,
      quietHoursStart: '22:00',
      quietHoursEnd: '08:00',
    }
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (notifications) {
      setSettings(prev => ({ ...prev, ...notifications }));
    }
  }, [notifications]);

  const toggle = (key: keyof NotificationSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const categories: NotificationCategory[] = [
    {
      key: 'security',
      icon: <Shield className="h-5 w-5 text-destructive" />,
      title: t('settings.notificationPrefs.categories.security'),
      description: t('settings.notificationPrefs.categories.securityDesc'),
      emailKey: 'securityAlerts',
      pushKey: 'securityAlerts',
      critical: true,
    },
    {
      key: 'comments',
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      title: t('settings.notificationPrefs.categories.comments'),
      description: t('settings.notificationPrefs.categories.commentsDesc'),
      emailKey: 'commentReplies',
      pushKey: 'commentRepliesPush',
    },
    {
      key: 'rankings',
      icon: <TrendingUp className="h-5 w-5 text-accent-foreground" />,
      title: t('settings.notificationPrefs.categories.rankings'),
      description: t('settings.notificationPrefs.categories.rankingsDesc'),
      emailKey: 'rankingUpdates',
      pushKey: 'rankingUpdatesPush',
    },
    {
      key: 'social',
      icon: <Bell className="h-5 w-5 text-primary" />,
      title: t('settings.notificationPrefs.categories.social'),
      description: t('settings.notificationPrefs.categories.socialDesc'),
      emailKey: 'newFollowers',
      pushKey: 'newFollowersPush',
    },
    {
      key: 'system',
      icon: <Megaphone className="h-5 w-5 text-muted-foreground" />,
      title: t('settings.notificationPrefs.categories.system'),
      description: t('settings.notificationPrefs.categories.systemDesc'),
      emailKey: 'systemAnnouncements',
      pushKey: 'systemAnnouncementsPush',
    },
    {
      key: 'marketing',
      icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
      title: t('settings.notificationPrefs.categories.marketing'),
      description: t('settings.notificationPrefs.categories.marketingDesc'),
      emailKey: 'marketingEmails',
      pushKey: 'marketingEmails',
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsService.updateNotifications(settings);
      onUpdate(settings);
      toast.success(t('settings.notificationPrefs.saveSuccess'));
    } catch {
      toast.error(t('settings.notificationPrefs.saveError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Global toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t('settings.notificationPrefs.globalTitle')}
          </CardTitle>
          <CardDescription>{t('settings.notificationPrefs.globalDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">{t('settings.notificationPrefs.emailAll')}</Label>
                <p className="text-xs text-muted-foreground">{t('settings.notificationPrefs.emailAllDesc')}</p>
              </div>
            </div>
            <Switch
              checked={!!settings.emailNotifications}
              onCheckedChange={() => toggle('emailNotifications')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">{t('settings.notificationPrefs.pushAll')}</Label>
                <p className="text-xs text-muted-foreground">{t('settings.notificationPrefs.pushAllDesc')}</p>
              </div>
            </div>
            <Switch
              checked={!!settings.pushNotifications}
              onCheckedChange={() => toggle('pushNotifications')}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <Label className="text-sm font-medium">{t('settings.notificationPrefs.weeklyDigest')}</Label>
                <p className="text-xs text-muted-foreground">{t('settings.notificationPrefs.weeklyDigestDesc')}</p>
              </div>
            </div>
            <Switch
              checked={!!settings.weeklyDigest}
              onCheckedChange={() => toggle('weeklyDigest')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Per-category settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings.notificationPrefs.categoriesTitle')}</CardTitle>
          <CardDescription>{t('settings.notificationPrefs.categoriesDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 gap-y-1 items-center mb-3">
            <div />
            <span className="text-xs font-medium text-muted-foreground text-center px-2">
              <Mail className="h-3.5 w-3.5 mx-auto" />
            </span>
            <span className="text-xs font-medium text-muted-foreground text-center px-2">
              <Smartphone className="h-3.5 w-3.5 mx-auto" />
            </span>
          </div>
          <div className="space-y-1">
            {categories.map((cat, i) => (
              <React.Fragment key={cat.key}>
                <div className="grid grid-cols-[1fr_auto_auto] gap-x-4 items-center py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {cat.icon}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium">{cat.title}</Label>
                        {cat.critical && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            {t('settings.notificationPrefs.critical')}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{cat.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={!!settings[cat.emailKey]}
                    onCheckedChange={() => toggle(cat.emailKey)}
                    disabled={cat.critical}
                  />
                  <Switch
                    checked={!!settings[cat.pushKey]}
                    onCheckedChange={() => toggle(cat.pushKey)}
                    disabled={cat.critical}
                  />
                </div>
                {i < categories.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            {t('settings.notificationPrefs.quietHours')}
          </CardTitle>
          <CardDescription>{t('settings.notificationPrefs.quietHoursDesc')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">{t('settings.notificationPrefs.enableQuietHours')}</Label>
            <Switch
              checked={!!settings.quietHoursEnabled}
              onCheckedChange={() => toggle('quietHoursEnabled')}
            />
          </div>
          {settings.quietHoursEnabled && (
            <div className="flex items-center gap-4 pt-2">
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">{t('settings.notificationPrefs.from')}</Label>
                <Select
                  value={String(settings.quietHoursStart)}
                  onValueChange={(v) => setSettings(prev => ({ ...prev, quietHoursStart: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const h = String(i).padStart(2, '0') + ':00';
                      return <SelectItem key={h} value={h}>{h}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground mb-1 block">{t('settings.notificationPrefs.to')}</Label>
                <Select
                  value={String(settings.quietHoursEnd)}
                  onValueChange={(v) => setSettings(prev => ({ ...prev, quietHoursEnd: v }))}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const h = String(i).padStart(2, '0') + ':00';
                      return <SelectItem key={h} value={h}>{h}</SelectItem>;
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? t('settings.saving') : t('settings.save')}
        </Button>
      </div>
    </div>
  );
};

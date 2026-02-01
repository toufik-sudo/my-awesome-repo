// -----------------------------------------------------------------------------
// Settings Page Component
// Main settings page with tabs for different settings sections
// -----------------------------------------------------------------------------

import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { User, Lock, CreditCard, Shield, Bell } from 'lucide-react';

interface SettingsTab {
  id: string;
  labelId: string;
  defaultLabel: string;
  icon: React.ReactNode;
}

const SETTINGS_TABS: SettingsTab[] = [
  { id: 'account', labelId: 'settings.tab.account', defaultLabel: 'Account', icon: <User className="h-4 w-4" /> },
  { id: 'password', labelId: 'settings.tab.password', defaultLabel: 'Password', icon: <Lock className="h-4 w-4" /> },
  { id: 'payment', labelId: 'settings.tab.payment', defaultLabel: 'Payment', icon: <CreditCard className="h-4 w-4" /> },
  { id: 'notifications', labelId: 'settings.tab.notifications', defaultLabel: 'Notifications', icon: <Bell className="h-4 w-4" /> },
  { id: 'gdpr', labelId: 'settings.tab.gdpr', defaultLabel: 'GDPR', icon: <Shield className="h-4 w-4" /> },
];

const SettingsPage: React.FC = () => {
  const { formatMessage } = useIntl();
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {formatMessage({ id: 'settings.title', defaultMessage: 'Settings' })}
        </h1>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'settings.subtitle', defaultMessage: 'Manage your account settings and preferences' })}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          {SETTINGS_TABS.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              {tab.icon}
              <span className="hidden sm:inline">
                {formatMessage({ id: tab.labelId, defaultMessage: tab.defaultLabel })}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{formatMessage({ id: 'settings.account.title', defaultMessage: 'Account Information' })}</CardTitle>
              <CardDescription>
                {formatMessage({ id: 'settings.account.description', defaultMessage: 'Update your personal information' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{formatMessage({ id: 'settings.account.firstName', defaultMessage: 'First Name' })}</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{formatMessage({ id: 'settings.account.lastName', defaultMessage: 'Last Name' })}</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{formatMessage({ id: 'settings.account.email', defaultMessage: 'Email' })}</Label>
                <Input id="email" type="email" placeholder="john.doe@example.com" />
              </div>
              <Button>{formatMessage({ id: 'settings.account.save', defaultMessage: 'Save Changes' })}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Settings */}
        <TabsContent value="password" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{formatMessage({ id: 'settings.password.title', defaultMessage: 'Change Password' })}</CardTitle>
              <CardDescription>
                {formatMessage({ id: 'settings.password.description', defaultMessage: 'Update your password to keep your account secure' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{formatMessage({ id: 'settings.password.current', defaultMessage: 'Current Password' })}</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{formatMessage({ id: 'settings.password.new', defaultMessage: 'New Password' })}</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{formatMessage({ id: 'settings.password.confirm', defaultMessage: 'Confirm Password' })}</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button>{formatMessage({ id: 'settings.password.update', defaultMessage: 'Update Password' })}</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{formatMessage({ id: 'settings.payment.title', defaultMessage: 'Payment Methods' })}</CardTitle>
              <CardDescription>
                {formatMessage({ id: 'settings.payment.description', defaultMessage: 'Manage your payment methods and billing information' })}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                {formatMessage({ id: 'settings.payment.noMethods', defaultMessage: 'No payment methods configured' })}
              </div>
              <Button variant="outline" className="w-full">
                {formatMessage({ id: 'settings.payment.add', defaultMessage: 'Add Payment Method' })}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{formatMessage({ id: 'settings.notifications.title', defaultMessage: 'Notification Preferences' })}</CardTitle>
              <CardDescription>
                {formatMessage({ id: 'settings.notifications.description', defaultMessage: 'Choose what notifications you receive' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{formatMessage({ id: 'settings.notifications.email', defaultMessage: 'Email Notifications' })}</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatMessage({ id: 'settings.notifications.emailDesc', defaultMessage: 'Receive email updates about your activity' })}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>{formatMessage({ id: 'settings.notifications.push', defaultMessage: 'Push Notifications' })}</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatMessage({ id: 'settings.notifications.pushDesc', defaultMessage: 'Receive push notifications in your browser' })}
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GDPR Settings */}
        <TabsContent value="gdpr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{formatMessage({ id: 'settings.gdpr.title', defaultMessage: 'Privacy & Data' })}</CardTitle>
              <CardDescription>
                {formatMessage({ id: 'settings.gdpr.description', defaultMessage: 'Manage your data and privacy preferences' })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline">
                {formatMessage({ id: 'settings.gdpr.download', defaultMessage: 'Download My Data' })}
              </Button>
              <Button variant="destructive">
                {formatMessage({ id: 'settings.gdpr.delete', defaultMessage: 'Delete My Account' })}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;

// -----------------------------------------------------------------------------
// Notifications Page Component
// Page displaying user notifications
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Check, Trash2 } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

// Mock notifications for display
const MOCK_NOTIFICATIONS: Notification[] = [];

const NotificationsPage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="h-8 w-8 text-primary" />
            {formatMessage({ id: 'notifications.title', defaultMessage: 'Notifications' })}
          </h1>
          <p className="text-muted-foreground">
            {formatMessage({ id: 'notifications.subtitle', defaultMessage: 'View and manage your notifications' })}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Check className="mr-2 h-4 w-4" />
            {formatMessage({ id: 'notifications.markAllRead', defaultMessage: 'Mark All Read' })}
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="mr-2 h-4 w-4" />
            {formatMessage({ id: 'notifications.clearAll', defaultMessage: 'Clear All' })}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{formatMessage({ id: 'notifications.recent', defaultMessage: 'Recent Notifications' })}</span>
            <Badge variant="secondary">0</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Bell className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>{formatMessage({ id: 'notifications.empty', defaultMessage: 'No notifications yet' })}</p>
              <p className="text-sm mt-2">
                {formatMessage({ id: 'notifications.emptyDesc', defaultMessage: 'When you receive notifications, they will appear here' })}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {MOCK_NOTIFICATIONS.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted/50'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <span className="text-xs text-muted-foreground mt-2 block">{notification.timestamp}</span>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationsPage;

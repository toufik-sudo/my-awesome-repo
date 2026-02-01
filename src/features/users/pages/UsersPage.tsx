// -----------------------------------------------------------------------------
// Users Feature - Pages
// Basic user listing page
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, UserPlus } from 'lucide-react';

const UsersPage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {formatMessage({ id: 'users.title', defaultMessage: 'Users' })}
          </h1>
          <p className="text-muted-foreground">
            {formatMessage({ id: 'users.subtitle', defaultMessage: 'Manage platform users' })}
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          {formatMessage({ id: 'users.invite', defaultMessage: 'Invite Users' })}
        </Button>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder={formatMessage({ id: 'users.search', defaultMessage: 'Search users...' })}
            className="pl-10"
          />
        </div>
      </div>

      {/* Users Table Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>
            {formatMessage({ id: 'users.list', defaultMessage: 'User List' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-12">
            {formatMessage({ id: 'users.noUsers', defaultMessage: 'No users to display. Users will appear here once they join your programs.' })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;

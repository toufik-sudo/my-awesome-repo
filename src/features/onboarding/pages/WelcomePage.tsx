// -----------------------------------------------------------------------------
// Welcome Page
// Entry page for program invitations and general welcome
// -----------------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WALL_ROUTE, LOGIN_PAGE_ROUTE } from '@/constants/routes';
import { ArrowRight } from 'lucide-react';

const WelcomePage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <h1 className="text-3xl font-bold text-primary">RewardzAi</h1>
          </div>
          <CardTitle className="text-2xl">
            {formatMessage({ id: 'welcome.title', defaultMessage: 'Welcome!' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ 
              id: 'welcome.subtitle', 
              defaultMessage: 'Your rewards and incentive platform' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link to={WALL_ROUTE}>
              {formatMessage({ id: 'welcome.dashboard', defaultMessage: 'Go to Dashboard' })}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                {formatMessage({ id: 'welcome.or', defaultMessage: 'or' })}
              </span>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link to={LOGIN_PAGE_ROUTE}>
              {formatMessage({ id: 'welcome.login', defaultMessage: 'Sign In' })}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelcomePage;

// -----------------------------------------------------------------------------
// Account Creation Success Page
// Shown after successful registration or payment
// -----------------------------------------------------------------------------

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { WALL_ROUTE } from '@/constants/routes';

interface AccountSuccessPageProps {
  translationPrefix?: string;
}

const AccountSuccessPage: React.FC<AccountSuccessPageProps> = ({ 
  translationPrefix = 'account.success' 
}) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(WALL_ROUTE);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4">
            <h1 className="text-3xl font-bold text-primary">RewardzAi</h1>
          </div>
          <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {formatMessage({ id: `${translationPrefix}.title`, defaultMessage: 'Welcome to RewardzAi!' })}
            </h2>
            <p className="text-muted-foreground">
              {formatMessage({ 
                id: `${translationPrefix}.body.first`, 
                defaultMessage: 'Your account has been successfully created.' 
              })}
            </p>
            <p className="text-muted-foreground">
              {formatMessage({ 
                id: `${translationPrefix}.body.second`, 
                defaultMessage: "You're all set to start earning rewards!" 
              })}
            </p>
          </div>

          <Button onClick={handleContinue} className="w-full">
            {formatMessage({ id: 'account.success.cta', defaultMessage: 'Get Started' })}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSuccessPage;

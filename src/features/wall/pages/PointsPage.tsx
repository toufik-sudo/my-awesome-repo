// -----------------------------------------------------------------------------
// Points Page Component
// Page displaying beneficiary points history
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Coins, TrendingUp, Gift, Calendar } from 'lucide-react';

interface PointsTransaction {
  id: string;
  type: 'earned' | 'spent' | 'bonus';
  amount: number;
  description: string;
  date: string;
}

// Mock transactions
const MOCK_TRANSACTIONS: PointsTransaction[] = [];

const PointsPage: React.FC = () => {
  const { formatMessage } = useIntl();

  const getTransactionIcon = (type: PointsTransaction['type']) => {
    switch (type) {
      case 'earned':
        return <TrendingUp className="h-4 w-4 text-primary" />;
      case 'spent':
        return <Gift className="h-4 w-4 text-accent-foreground" />;
      case 'bonus':
        return <Coins className="h-4 w-4 text-secondary-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Coins className="h-8 w-8 text-primary" />
          {formatMessage({ id: 'points.title', defaultMessage: 'My Points' })}
        </h1>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'points.subtitle', defaultMessage: 'Track your points and rewards' })}
        </p>
      </div>

      {/* Points Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {formatMessage({ id: 'points.total', defaultMessage: 'Total Points' })}
            </CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {formatMessage({ id: 'points.available', defaultMessage: 'Available to redeem' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {formatMessage({ id: 'points.earned', defaultMessage: 'Earned This Month' })}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {formatMessage({ id: 'points.thisMonth', defaultMessage: 'Points earned' })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {formatMessage({ id: 'points.redeemed', defaultMessage: 'Redeemed' })}
            </CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              {formatMessage({ id: 'points.lifetimeRedeemed', defaultMessage: 'Lifetime redeemed' })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {formatMessage({ id: 'points.history', defaultMessage: 'Points History' })}
          </CardTitle>
          <CardDescription>
            {formatMessage({ id: 'points.historyDesc', defaultMessage: 'Your recent points activity' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {MOCK_TRANSACTIONS.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Coins className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>{formatMessage({ id: 'points.noTransactions', defaultMessage: 'No transactions yet' })}</p>
              <p className="text-sm mt-2">
                {formatMessage({ id: 'points.noTransactionsDesc', defaultMessage: 'Complete activities to earn points' })}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {MOCK_TRANSACTIONS.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                    {getTransactionIcon(transaction.type)}
                  </div>

                  <div className="flex-1">
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-sm text-muted-foreground">{transaction.date}</div>
                  </div>

                  <Badge variant={transaction.amount > 0 ? 'default' : 'secondary'}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} pts
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PointsPage;

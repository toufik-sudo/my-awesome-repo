// -----------------------------------------------------------------------------
// Ranking Page Component
// Page displaying beneficiary rankings
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface RankingEntry {
  id: string;
  rank: number;
  name: string;
  avatar?: string;
  points: number;
  change: number;
}

// Mock ranking data
const MOCK_RANKINGS: RankingEntry[] = [];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-5 w-5 text-primary" />;
    case 2:
      return <Medal className="h-5 w-5 text-muted-foreground" />;
    case 3:
      return <Award className="h-5 w-5 text-secondary-foreground" />;
    default:
      return null;
  }
};

const RankingPage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Trophy className="h-8 w-8 text-primary" />
          {formatMessage({ id: 'ranking.title', defaultMessage: 'Ranking' })}
        </h1>
        <p className="text-muted-foreground">
          {formatMessage({ id: 'ranking.subtitle', defaultMessage: 'See how you compare to other participants' })}
        </p>
      </div>

      {/* Your Position Card */}
      <Card>
        <CardHeader>
          <CardTitle>{formatMessage({ id: 'ranking.yourPosition', defaultMessage: 'Your Position' })}</CardTitle>
          <CardDescription>
            {formatMessage({ id: 'ranking.yourPositionDesc', defaultMessage: 'Your current ranking in the program' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-8 py-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">-</div>
              <div className="text-sm text-muted-foreground mt-1">
                {formatMessage({ id: 'ranking.rank', defaultMessage: 'Rank' })}
              </div>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <div className="text-4xl font-bold">0</div>
              <div className="text-sm text-muted-foreground mt-1">
                {formatMessage({ id: 'ranking.points', defaultMessage: 'Points' })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>{formatMessage({ id: 'ranking.leaderboard', defaultMessage: 'Leaderboard' })}</CardTitle>
          <CardDescription>
            {formatMessage({ id: 'ranking.leaderboardDesc', defaultMessage: 'Top participants in your program' })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {MOCK_RANKINGS.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <Trophy className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <p>{formatMessage({ id: 'ranking.empty', defaultMessage: 'No rankings available yet' })}</p>
              <p className="text-sm mt-2">
                {formatMessage({ id: 'ranking.emptyDesc', defaultMessage: 'Complete activities to appear in the ranking' })}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {MOCK_RANKINGS.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 p-4 rounded-lg border"
                >
                  <div className="flex items-center justify-center w-8">
                    {getRankIcon(entry.rank) || (
                      <span className="text-lg font-bold text-muted-foreground">
                        {entry.rank}
                      </span>
                    )}
                  </div>

                  <Avatar>
                    <AvatarImage src={entry.avatar} alt={entry.name} />
                    <AvatarFallback>
                      {entry.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="font-medium">{entry.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatMessage({ id: 'ranking.pointsValue', defaultMessage: '{points} points' }, { points: entry.points })}
                    </div>
                  </div>

                  {entry.change !== 0 && (
                    <Badge variant={entry.change > 0 ? 'default' : 'secondary'}>
                      {entry.change > 0 ? '+' : ''}{entry.change}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RankingPage;

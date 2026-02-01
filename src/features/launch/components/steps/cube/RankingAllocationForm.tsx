// -----------------------------------------------------------------------------
// RankingAllocationForm Component
// Competition-based ranking allocation form
// -----------------------------------------------------------------------------

import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Award, Plus, Trash2, Trophy, Medal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BracketData {
  min: string;
  max: string;
  value: string;
}

interface RankingAllocationFormProps {
  goalIndex: number;
  measurementType: number | null;
  measurementName: string | null;
  programType: string;
  brackets: BracketData[];
  onChange: (brackets: BracketData[]) => void;
  disabled?: boolean;
}

const getPositionIcon = (position: number) => {
  switch (position) {
    case 1:
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2:
      return <Medal className="h-5 w-5 text-slate-400" />;
    case 3:
      return <Medal className="h-5 w-5 text-amber-600" />;
    default:
      return <Award className="h-5 w-5 text-primary" />;
  }
};

const getPositionLabel = (position: number): string => {
  switch (position) {
    case 1: return '1st Place';
    case 2: return '2nd Place';
    case 3: return '3rd Place';
    default: return `${position}th Place`;
  }
};

export const RankingAllocationForm: React.FC<RankingAllocationFormProps> = ({
  goalIndex,
  measurementType,
  measurementName,
  programType,
  brackets,
  onChange,
  disabled = false,
}) => {
  const { formatMessage } = useIntl();

  // Initialize with 3 positions if empty
  useEffect(() => {
    if (brackets.length === 0) {
      onChange([
        { min: '1', max: '1', value: '1000' },
        { min: '2', max: '2', value: '500' },
        { min: '3', max: '3', value: '250' },
      ]);
    }
  }, []);

  const handleAddPosition = () => {
    const nextPosition = brackets.length + 1;
    onChange([...brackets, { min: String(nextPosition), max: String(nextPosition), value: '' }]);
  };

  const handleRemovePosition = (index: number) => {
    const updated = brackets.filter((_, i) => i !== index);
    // Re-number positions
    const renumbered = updated.map((b, i) => ({
      ...b,
      min: String(i + 1),
      max: String(i + 1),
    }));
    onChange(renumbered);
  };

  const handleUpdatePoints = (index: number, value: string) => {
    const updated = [...brackets];
    updated[index] = { ...updated[index], value };
    onChange(updated);
  };

  const totalPrizePool = brackets.reduce((sum, b) => sum + (parseFloat(b.value) || 0), 0);

  return (
    <Card className={cn(disabled && 'opacity-60')}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="h-4 w-4 text-primary" />
              <FormattedMessage id="launch.cube.rankingAllocation" defaultMessage="Ranking Allocation" />
            </CardTitle>
            <CardDescription>
              <FormattedMessage 
                id="launch.cube.rankingAllocationDesc" 
                defaultMessage="Define rewards based on competition rankings" 
              />
            </CardDescription>
          </div>
          {!disabled && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddPosition} 
              className="gap-2"
              disabled={brackets.length >= 10}
            >
              <Plus className="h-4 w-4" />
              <FormattedMessage id="launch.cube.addPosition" defaultMessage="Add Position" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {brackets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p><FormattedMessage id="launch.cube.noPositions" defaultMessage="No ranking positions defined" /></p>
            <Button variant="link" onClick={handleAddPosition} className="mt-2" disabled={disabled}>
              <FormattedMessage id="launch.cube.addFirstPosition" defaultMessage="Add first position" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {brackets.map((bracket, index) => {
              const position = index + 1;
              
              return (
                <div 
                  key={index}
                  className={cn(
                    'flex items-center gap-4 p-4 rounded-lg border',
                    position <= 3 ? 'bg-primary/5' : 'bg-card'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-[140px]">
                    {getPositionIcon(position)}
                    <span className="font-medium">{getPositionLabel(position)}</span>
                  </div>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <Label className="sr-only">Points</Label>
                    <Input
                      type="number"
                      value={bracket.value}
                      onChange={(e) => handleUpdatePoints(index, e.target.value)}
                      placeholder="Points"
                      className="max-w-[150px]"
                      disabled={disabled}
                    />
                    <span className="text-sm text-muted-foreground">points</span>
                  </div>
                  
                  {!disabled && brackets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePosition(index)}
                      className="h-9 w-9 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        {brackets.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium mb-1">
              <FormattedMessage id="launch.cube.totalPrizePool" defaultMessage="Total Prize Pool" />
            </p>
            <p className="text-2xl font-bold text-primary">
              {totalPrizePool.toLocaleString()} pts
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RankingAllocationForm;

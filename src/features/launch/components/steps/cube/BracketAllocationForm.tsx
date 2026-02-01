// -----------------------------------------------------------------------------
// BracketAllocationForm Component
// Tiered bracket-based allocation form
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BracketData {
  min: string;
  max: string;
  value: string;
}

interface BracketAllocationFormProps {
  goalIndex: number;
  measurementType: number | null;
  measurementName: string | null;
  programType: string;
  brackets: BracketData[];
  onChange: (brackets: BracketData[]) => void;
  disabled?: boolean;
}

export const BracketAllocationForm: React.FC<BracketAllocationFormProps> = ({
  goalIndex,
  measurementType,
  measurementName,
  programType,
  brackets,
  onChange,
  disabled = false,
}) => {
  const { formatMessage } = useIntl();

  // Initialize with 2 brackets if empty
  useEffect(() => {
    if (brackets.length === 0) {
      onChange([
        { min: '0', max: '100', value: '50' },
        { min: '101', max: '500', value: '100' },
      ]);
    }
  }, []);

  const handleAddBracket = () => {
    const lastBracket = brackets[brackets.length - 1];
    const newMin = lastBracket ? String(parseInt(lastBracket.max || '0') + 1) : '0';
    onChange([...brackets, { min: newMin, max: '', value: '' }]);
  };

  const handleRemoveBracket = (index: number) => {
    onChange(brackets.filter((_, i) => i !== index));
  };

  const handleUpdateBracket = (index: number, field: keyof BracketData, value: string) => {
    const updated = [...brackets];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  return (
    <Card className={cn(disabled && 'opacity-60')}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Layers className="h-4 w-4 text-primary" />
              <FormattedMessage id="launch.cube.bracketAllocation" defaultMessage="Bracket Allocation" />
            </CardTitle>
            <CardDescription>
              <FormattedMessage 
                id="launch.cube.bracketAllocationDesc" 
                defaultMessage="Define tiered reward levels based on performance ranges" 
              />
            </CardDescription>
          </div>
          {!disabled && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddBracket} 
              className="gap-2"
              disabled={brackets.length >= 5}
            >
              <Plus className="h-4 w-4" />
              <FormattedMessage id="launch.cube.addBracket" defaultMessage="Add Bracket" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {brackets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Layers className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p><FormattedMessage id="launch.cube.noBrackets" defaultMessage="No brackets defined yet" /></p>
            <Button variant="link" onClick={handleAddBracket} className="mt-2" disabled={disabled}>
              <FormattedMessage id="launch.cube.addFirstBracket" defaultMessage="Add your first bracket" />
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {brackets.map((bracket, index) => (
              <div 
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 items-end p-4 rounded-lg border bg-card"
              >
                <div className="space-y-1">
                  <Label className="text-xs">
                    <FormattedMessage id="launch.cube.bracketMin" defaultMessage="From" />
                  </Label>
                  <Input
                    type="number"
                    value={bracket.min}
                    onChange={(e) => handleUpdateBracket(index, 'min', e.target.value)}
                    placeholder="0"
                    disabled={disabled}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">
                    <FormattedMessage id="launch.cube.bracketMax" defaultMessage="To" />
                  </Label>
                  <Input
                    type="number"
                    value={bracket.max}
                    onChange={(e) => handleUpdateBracket(index, 'max', e.target.value)}
                    placeholder="100"
                    disabled={disabled}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label className="text-xs">
                    <FormattedMessage id="launch.cube.bracketPoints" defaultMessage="Points" />
                  </Label>
                  <Input
                    type="number"
                    value={bracket.value}
                    onChange={(e) => handleUpdateBracket(index, 'value', e.target.value)}
                    placeholder="500"
                    disabled={disabled}
                  />
                </div>
                
                {!disabled && brackets.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveBracket(index)}
                    className="h-9 w-9 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
        
        {brackets.length > 0 && (
          <p className="text-xs text-muted-foreground">
            <FormattedMessage 
              id="launch.cube.bracketHint" 
              defaultMessage="Brackets are evaluated from top to bottom. Make sure ranges don't overlap." 
            />
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BracketAllocationForm;

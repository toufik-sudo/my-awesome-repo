// -----------------------------------------------------------------------------
// RewardsStep Component (with Next Step button removed and star section optional)
// -----------------------------------------------------------------------------

import React, { useState, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Star, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Star Rankings Bracket Logic ---
const STAR_LABELS = [
  'firstStar',
  'secondStar',
  'thirdStar',
  'fourthStar',
  'fifthStar',
];

const STAR_LABELS_DISPLAY = [
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
  'Diamond',
];

const FREQUENCY_OPTIONS = [
  { value: 'instantaneously', label: 'Instantaneously' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarter', label: 'Quarterly' },
];

const VALIDITY_OPTIONS = [
  { value: '3m', label: '3 Months' },
  { value: '6m', label: '6 Months' },
  { value: '1y', label: '1 Year' },
  { value: '2y', label: '2 Years' },
  { value: 'never', label: 'Never Expires' },
];

const defaultBrackets = [
  { min: '', max: '', value: 1, errors: {} },
  { min: '', max: '', value: 2, errors: {} },
  { min: '', max: '', value: 3, errors: {} },
];

const StarIcon = ({ filled = false }) => (
  <Star className={cn("h-5 w-5", filled ? "text-yellow-500" : "text-muted-foreground")} fill={filled ? "currentColor" : "none"} />
);

const StarRankingsBracket = React.forwardRef(({ onSave }, ref) => {
  const [bracketsData, setBracketsData] = useState([...defaultBrackets]);
  const [isBracketsSeted, setIsBracketsSeted] = useState(false);

  // Validation logic
  const validateBrackets = (updatedBrackets) => {
    setIsBracketsSeted(false);
    return updatedBrackets.map((bracket, index) => {
      const errors = {};
      const prevBracket = updatedBrackets[index - 1];

      if (
        (index !== updatedBrackets.length - 1 || (index === updatedBrackets.length - 1 && updatedBrackets.max !== "")) &&
        bracket.max !== '' &&
        bracket.min !== '' &&
        parseInt(bracket.max, 10) <= parseInt(bracket.min, 10)
      ) {
        errors.max = "Must be strictly greater than min";
        errors.min = "Must be strictly less than max";
      }

      if (prevBracket && parseInt(bracket.min, 10) <= parseInt(prevBracket.max, 10)) {
        errors.min = "Must be greater than previous max";
        prevBracket.errors.max = "Must be less than next min";
      }

      return { ...bracket, errors };
    });
  };

  const handleBracketChange = (index, field, value) => {
    const updatedBrackets = [...bracketsData];
    updatedBrackets[index][field] = value;
    setBracketsData(validateBrackets(updatedBrackets));
  };

  const handleAddBracket = () => {
    if (bracketsData.length < 5) {
      const newValue = bracketsData.length + 1;
      const updatedBrackets = [
        ...bracketsData,
        { min: '', max: '', value: newValue, errors: {} },
      ];
      setBracketsData(validateBrackets(updatedBrackets));
    }
  };

  const handleDeleteBracket = (index) => {
    if (bracketsData.length > 3) {
      const updatedBrackets = bracketsData.filter((_, i) => i !== index);
      setBracketsData(validateBrackets(updatedBrackets));
    }
  };

  const allInputsFilled = bracketsData.every(
    (bracket, index) =>
      bracket.min !== '' &&
      (index === bracketsData.length - 1 || bracket.max !== '') &&
      Object.keys(bracket.errors).length === 0
  );

  // Save as programRanking object
  const saveProgramRanking = () => {
    const programRanking = bracketsData.reduce((acc, bracket, index) => {
      const key = STAR_LABELS[index];
      acc[key] = {
        min: parseInt(bracket.min, 10),
        max: bracket.max === '' && index === bracketsData.length - 1 ? null : parseInt(bracket.max, 10),
      };
      return acc;
    }, {});
    setIsBracketsSeted(true);
    if (onSave) onSave(programRanking, true);
  };

  // Expose isBracketsSeted to parent via ref
  React.useImperativeHandle(ref, () => ({
    isBracketsSeted,
    allInputsFilled,
    bracketsData,
    setIsBracketsSeted,
  }));

  return (
    <div>
      <div style={{ marginBottom: '2rem' }} className={isBracketsSeted ? "opacity-60 pointer-events-none" : ""}>
        {bracketsData.map((bracket, index) => (
          <div key={index} className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
            <span className="font-semibold min-w-[70px]">{STAR_LABELS_DISPLAY[index] || `Star ${index + 1}`}</span>
            <Input
              type="number"
              className={bracket.errors.min ? "border-red-500" : ""}
              value={bracket.min}
              min={0}
              onChange={e => handleBracketChange(index, 'min', e.target.value)}
              placeholder="Min"
              style={{ width: 80 }}
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="number"
              className={bracket.errors.max ? "border-red-500" : ""}
              value={bracket.max}
              min={0}
              onChange={e => handleBracketChange(index, 'max', e.target.value)}
              placeholder={index === bracketsData.length - 1 ? "No max" : "Max"}
              style={{ width: 80 }}
            />
            <span className="flex items-center ml-2">
              {[...Array(bracket.value)].map((_, starIndex) => (
                <StarIcon key={starIndex} filled={true} />
              ))}
              {[...Array(bracketsData.length - bracket.value)].map((_, starIndex) => (
                <StarIcon key={starIndex} filled={false} />
              ))}
            </span>
            {index === bracketsData.length - 1 && index > 2 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500 ml-2"
                onClick={() => handleDeleteBracket(index)}
              >
                Remove
              </Button>
            )}
            <div className="flex flex-col">
              {bracket.errors.min && <span className="text-xs text-red-500">{bracket.errors.min}</span>}
              {bracket.errors.max && <span className="text-xs text-red-500">{bracket.errors.max}</span>}
            </div>
          </div>
        ))}
        <div>
          {bracketsData.length < 5 && (
            <Button type="button" variant="link" onClick={handleAddBracket} className="text-primary underline">
              + Add Star Ranking
            </Button>
          )}
        </div>
      </div>
      {allInputsFilled && (
        <Button
          type="button"
          onClick={saveProgramRanking}
          className="mt-2"
          variant={isBracketsSeted ? "outline" : "default"}
        >
          {isBracketsSeted ? "Saved" : "Save Star Rankings"}
        </Button>
      )}
    </div>
  );
});
StarRankingsBracket.displayName = "StarRankingsBracket";

export const RewardsStep: React.FC = () => {
  // Allocation frequency
  const [frequency, setFrequency] = useState('monthly');
  // Validity period
  const [validityPeriod, setValidityPeriod] = useState('1y');
  const [autoRollover, setAutoRollover] = useState(false);

  // Manager rewards
  const [rewardManagers, setRewardManagers] = useState(false);
  const [managerPercentage, setManagerPercentage] = useState(10);

  // Star Rankings programRanking output
  const [programRanking, setProgramRanking] = useState({});
  const [starRankingSaved, setStarRankingSaved] = useState(false);

  // Ref to access StarRankingsBracket state
  const starRankingRef = useRef(null);

  // Save config to parent/store if needed (not shown here)

  // --- Section completion logic ---
  // Allocation frequency and validity period are always set (default)
  const isAllocationSectionComplete = !!frequency && !!validityPeriod;
  // Manager rewards: if enabled, managerPercentage must be set (always true since default is 10)
  const isManagerSectionComplete = !rewardManagers || (rewardManagers && typeof managerPercentage === 'number');
  // Star rankings: now OPTIONAL, so always true
  const isStarRankingSectionComplete = true;

  const allSectionsComplete = isAllocationSectionComplete && isManagerSectionComplete && isStarRankingSectionComplete;

  // Handler for StarRankingsBracket save
  const handleStarRankingSave = (ranking, saved) => {
    setProgramRanking(ranking);
    setStarRankingSaved(!!saved);
  };

  // Handler for Next Step
  // (Removed local Next Step button)

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <StepIndicator active label="Allocation" />
          <StepIndicator label="Manager Rewards" />
          <StepIndicator label="Star Rankings" />
        </div>
      </div>

      {/* Allocation Frequency */}
      <Card>
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="launch.rewards.frequency" defaultMessage="Allocation Frequency" />
          </CardTitle>
          <CardDescription>
            <FormattedMessage id="launch.rewards.frequency.desc" defaultMessage="How often are rewards allocated?" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={frequency} onValueChange={setFrequency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FREQUENCY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Validity Period */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            <FormattedMessage id="launch.rewards.validity" defaultMessage="Points Validity" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={validityPeriod} onValueChange={setValidityPeriod}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {VALIDITY_OPTIONS.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>
                <FormattedMessage id="launch.rewards.autoRollover" defaultMessage="Auto Rollover" />
              </Label>
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="launch.rewards.autoRolloverDesc" defaultMessage="Automatically carry over unused points" />
              </p>
            </div>
            <Switch checked={autoRollover} onCheckedChange={setAutoRollover} />
          </div>
        </CardContent>
      </Card>

      {/* Manager Rewards */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-primary" />
            <FormattedMessage id="launch.rewards.managers" defaultMessage="Manager Rewards" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>
                <FormattedMessage id="launch.rewards.rewardManagers" defaultMessage="Reward People Managers" />
              </Label>
              <p className="text-xs text-muted-foreground">
                <FormattedMessage id="launch.rewards.rewardManagersDesc" defaultMessage="Give managers a percentage of their team's rewards" />
              </p>
            </div>
            <Switch checked={rewardManagers} onCheckedChange={setRewardManagers} />
          </div>
          {rewardManagers && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Manager Percentage</span>
                <span className="font-medium">{managerPercentage}%</span>
              </div>
              <Slider
                value={[managerPercentage]}
                onValueChange={([value]) => setManagerPercentage(value)}
                max={25}
                step={1}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Star Rankings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5 text-yellow-500" />
            <FormattedMessage id="launch.rewards.starRankings" defaultMessage="Star Rankings" />
          </CardTitle>
          <CardDescription>
            <FormattedMessage id="launch.rewards.starRankings.desc" defaultMessage="Define star-based achievement levels for participants." />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StarRankingsBracket ref={starRankingRef} onSave={handleStarRankingSave} />
          {/* For debugging, show the output */}
          {Object.keys(programRanking).length > 0 && (
            <div className="mt-4 p-2 bg-muted rounded text-xs">
              <b>programRanking output:</b>
              <pre>{JSON.stringify(programRanking, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Step Button removed from here */}

    </div>
  );
};

// Step indicator component
const StepIndicator: React.FC<{ active?: boolean; label: string }> = ({ active, label }) => (
  <div className={cn(
    'flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium',
    active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
  )}>
    {label}
  </div>
);

export default RewardsStep;
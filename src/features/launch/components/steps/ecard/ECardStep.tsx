// -----------------------------------------------------------------------------
// ECard Step Component
// Main eCard selection step for the launch wizard
// Combines filter and grid components with wizard integration
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ECardFilter } from './ECardFilter';
import { ECardGrid } from './ECardGrid';
import { useEcardData } from '@/features/launch/hooks/useEcardData';
import { useLaunchWizard } from '@/features/launch/hooks/useLaunchWizard';

interface ECardStepProps {
  isConversion?: boolean;
  canConvert?: boolean;
  programEcards?: any[];
}

export const ECardStep: React.FC<ECardStepProps> = ({
  isConversion = false,
  canConvert = true,
  programEcards,
}) => {
  const { formatMessage } = useIntl();
  const { updateStepData, goToNextStep, launchData } = useLaunchWizard();
  
  const {
    filteredCards,
    selectedCards,
    countries,
    categories,
    isLoading,
    error,
    filters,
    setFilters,
    resetFilters,
    toggleCardSelection,
    selectAllCards,
    deselectAllCards,
    isCardSelected,
    getSelectedCardIds,
  } = useEcardData(programEcards, isConversion);

  // Restore previous selection from wizard data
  React.useEffect(() => {
    const existingSelection = launchData.eCardSelectdList as { ecardId: number }[] | undefined;
    if (existingSelection?.length && selectedCards.length === 0) {
      // TODO: Restore selection from existing data
    }
  }, [launchData.eCardSelectdList]);

  const handleNext = () => {
    // Format selected cards for storage
    const ecardSelectedList = selectedCards.map((card) => ({
      ecardId: card.ecardId,
    }));
    
    updateStepData('eCardSelectdList', ecardSelectedList);
    goToNextStep();
  };

  const isAllSelected = filteredCards.length > 0 && 
    filteredCards.every((card) => isCardSelected(card.ecardId));

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">
          {formatMessage({ id: 'eCard.loading', defaultMessage: 'Loading gift cards...' })}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-8">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      {!isConversion && (
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center gap-3 p-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10">
            <CreditCard className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {formatMessage({ id: 'launchProgram.ecard.title', defaultMessage: 'Gift Card Selection' })}
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2">
              {formatMessage({
                id: 'launchProgram.ecard.subtitle',
                defaultMessage: 'Select the gift cards that will be available as rewards for your program participants.',
              })}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <ECardFilter
        filters={filters}
        countries={countries}
        categories={categories}
        selectedCount={selectedCards.length}
        totalCount={filteredCards.length}
        onFilterChange={setFilters}
        onReset={resetFilters}
        onSelectAll={selectAllCards}
        onDeselectAll={deselectAllCards}
        isAllSelected={isAllSelected}
      />

      {/* Card Grid */}
      <ECardGrid
        cards={filteredCards}
        selectedCardIds={getSelectedCardIds()}
        onCardToggle={toggleCardSelection}
        isConversion={isConversion}
      />

      {/* Next Button */}
      {!isConversion && (
        <div className="flex justify-center pt-8 border-t">
          <Button 
            onClick={handleNext} 
            size="lg"
            disabled={selectedCards.length === 0}
            className="gap-2 min-w-[200px] shadow-lg shadow-primary/20"
          >
            {formatMessage({ id: 'form.submit.next', defaultMessage: 'Continue' })}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Selection Summary - Floating */}
      {selectedCards.length > 0 && !isConversion && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 z-50">
          <div className="container mx-auto flex items-center justify-between max-w-6xl">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <p className="font-medium">
                {formatMessage(
                  { id: 'eCard.summary.selected', defaultMessage: '{count} gift cards selected' },
                  { count: selectedCards.length }
                )}
              </p>
            </div>
            <Button onClick={handleNext} className="gap-2 shadow-md">
              {formatMessage({ id: 'common.continue', defaultMessage: 'Continue' })}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ECardStep;

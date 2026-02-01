// -----------------------------------------------------------------------------
// ECard Page
// Gift card selection page for rewards - uses ECardStep component
// -----------------------------------------------------------------------------

import React from 'react';
import { ECardStep } from '../components/steps/ecard/ECardStep';

interface ECardPageProps {
  isConversionEcard?: boolean;
  canConvert?: boolean;
  programEcards?: any[];
}

const ECardPage: React.FC<ECardPageProps> = ({ 
  isConversionEcard = false, 
  canConvert = true,
  programEcards 
}) => {
  return (
    <div className="container mx-auto py-6 px-4">
      <ECardStep 
        isConversion={isConversionEcard}
        canConvert={canConvert}
        programEcards={programEcards}
      />
    </div>
  );
};

export default ECardPage;

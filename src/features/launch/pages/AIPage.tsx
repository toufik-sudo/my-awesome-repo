// -----------------------------------------------------------------------------
// AI Selection Page
// AI assistant selection page for the launch wizard
// -----------------------------------------------------------------------------

import React from 'react';
import { AISelectionStep } from '../components/steps/ai/AISelectionStep';

const AIPage: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <AISelectionStep />
    </div>
  );
};

export default AIPage;

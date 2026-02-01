// -----------------------------------------------------------------------------
// AI Selection Page
// AI assistant selection page for the launch wizard
// -----------------------------------------------------------------------------

import React from 'react';
import { AISelectionStep } from '../components/steps/ai/AISelectionStep';
import { useUserData } from '@/hooks/user/useUserData';

const AIPage: React.FC = () => {
  const { userData } = useUserData();
  const userUuid = userData?.uuid || '';

  return (
    <div className="container mx-auto py-6 px-4">
      <AISelectionStep userUuid={userUuid} />
    </div>
  );
};

export default AIPage;

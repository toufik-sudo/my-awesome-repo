import React from 'react';

import SuccessModal from 'components/organisms/modals/SuccessModal';
import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';
import TailoredFormWrapper from 'components/organisms/form-wrappers/TailoredFormWrapper';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';

const TailoredFormPage = () => {
  return (
    <LeftSideLayout>
      <NavLanguageSelector />
      <TailoredFormWrapper />

      <SuccessModal closeButtonHidden isOnboardingFlow={false} />
    </LeftSideLayout>
  );
};

export default TailoredFormPage;

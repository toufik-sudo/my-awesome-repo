// -----------------------------------------------------------------------------
// Multi-Step Register Form Component
// Main registration wizard component
// -----------------------------------------------------------------------------

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Progress } from '@/components/ui/progress';
import { useRegisterForm } from '../hooks/useRegisterForm';
import {
  CivilityStep,
  NameStep,
  ContactStep,
  AvatarStep,
  PasswordStep,
  TermsStep,
  CompleteStep,
} from './RegisterSteps';
import { LOGIN_PAGE_ROUTE } from '@/constants/routes';

const MultiStepRegisterForm: React.FC = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const {
    currentStep,
    stepIndex,
    registerData,
    isLoading,
    error,
    updateData,
    nextStep,
    prevStep,
    submitRegistration,
    canGoBack,
    progress,
    validatePassword,
  } = useRegisterForm();

  const handleLogin = () => {
    navigate(LOGIN_PAGE_ROUTE);
  };

  const totalVisibleSteps = 6; // Exclude 'complete' from count

  const renderStep = () => {
    switch (currentStep) {
      case 'civility':
        return (
          <CivilityStep
            data={registerData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        );
      case 'name':
        return (
          <NameStep
            data={registerData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        );
      case 'contact':
        return (
          <ContactStep
            data={registerData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        );
      case 'avatar':
        return (
          <AvatarStep
            data={registerData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            canGoBack={canGoBack}
          />
        );
      case 'password':
        return (
          <PasswordStep
            data={registerData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
            canGoBack={canGoBack}
            validatePassword={validatePassword}
          />
        );
      case 'terms':
        return (
          <TermsStep
            data={registerData}
            updateData={updateData}
            onBack={prevStep}
            canGoBack={canGoBack}
            onSubmit={submitRegistration}
            isLoading={isLoading}
            error={error}
          />
        );
      case 'complete':
        return (
          <CompleteStep
            email={registerData.email || ''}
            onLogin={handleLogin}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      {currentStep !== 'complete' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>
              {formatMessage(
                { id: 'register.step', defaultMessage: 'Step {current} of {total}' },
                { current: stepIndex + 1, total: totalVisibleSteps }
              )}
            </span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Current step */}
      {renderStep()}
    </div>
  );
};

export default MultiStepRegisterForm;

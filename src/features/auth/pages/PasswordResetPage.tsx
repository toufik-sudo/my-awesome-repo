import React from 'react';
import PasswordResetForm from '../components/PasswordResetForm';

/**
 * Password reset page component
 */
const PasswordResetPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RewardzAi</h1>
        </div>
        <PasswordResetForm />
      </div>
    </div>
  );
};

export default PasswordResetPage;

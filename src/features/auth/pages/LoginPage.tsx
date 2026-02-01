import React from 'react';
import LoginForm from '../components/LoginForm';

/**
 * Login page component
 */
const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">RewardzAi</h1>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

import React from 'react';
import { DeclarationsList } from '../components/DeclarationsList';
import { DeclarationsHeaderMenu } from '../components/DeclarationsHeaderMenu';
import { useDeclarationsList } from '../hooks/useDeclarationsList';

/**
 * Main declarations page for admin users
 */
const DeclarationsPage: React.FC = () => {
  const { refresh } = useDeclarationsList();

  return (
    <div className="flex flex-col h-full">
      <DeclarationsHeaderMenu onRefresh={refresh} canCreate canUpload />
      <div className="flex-1 p-4">
        <DeclarationsList isBeneficiary={false} />
      </div>
    </div>
  );
};

export default DeclarationsPage;

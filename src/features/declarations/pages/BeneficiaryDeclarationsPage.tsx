import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DeclarationsList } from '../components/DeclarationsList';

/**
 * Declarations page for beneficiary users (their own declarations)
 */
const BeneficiaryDeclarationsPage: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  const handleCreateDeclaration = () => {
    navigate('/declarations/create');
  };

  const handleBack = () => {
    navigate('/wall');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {intl.formatMessage({ id: 'common.back' })}
          </Button>
          <div>
            <h2 className="text-lg font-semibold">
              {intl.formatMessage({ id: 'declarations.my.title' })}
            </h2>
            <p className="text-sm text-muted-foreground">
              {intl.formatMessage({ id: 'declarations.my.subtitle' })}
            </p>
          </div>
        </div>

        <Button size="sm" onClick={handleCreateDeclaration}>
          <Plus className="h-4 w-4 mr-2" />
          {intl.formatMessage({ id: 'declarations.add.new' })}
        </Button>
      </div>

      {/* List */}
      <div className="flex-1 p-4">
        <DeclarationsList isBeneficiary />
      </div>
    </div>
  );
};

export default BeneficiaryDeclarationsPage;

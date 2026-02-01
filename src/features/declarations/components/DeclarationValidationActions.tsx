import React from 'react';
import { useIntl } from 'react-intl';
import { Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { IDeclaration } from '../types';
import { useDeclarationValidation } from '../hooks/useDeclarationValidation';

interface DeclarationValidationActionsProps {
  declaration: IDeclaration;
  onSuccess?: () => void;
}

/**
 * Validation action buttons for declaration approval/rejection
 */
export const DeclarationValidationActions: React.FC<DeclarationValidationActionsProps> = ({
  declaration,
  onSuccess,
}) => {
  const intl = useIntl();
  const { isValidating, handleValidate, handleDecline, canValidate } =
    useDeclarationValidation({ declaration, onSuccess });

  if (!canValidate) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {/* Validate Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="default" size="sm" disabled={isValidating}>
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Check className="h-4 w-4 mr-2" />
            )}
            {intl.formatMessage({ id: 'declarations.action.validate' })}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {intl.formatMessage({ id: 'declarations.confirm.validate.title' })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({ id: 'declarations.confirm.validate.description' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {intl.formatMessage({ id: 'common.cancel' })}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleValidate}>
              {intl.formatMessage({ id: 'declarations.action.validate' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Decline Button */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm" disabled={isValidating}>
            {isValidating ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <X className="h-4 w-4 mr-2" />
            )}
            {intl.formatMessage({ id: 'declarations.action.decline' })}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {intl.formatMessage({ id: 'declarations.confirm.decline.title' })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {intl.formatMessage({ id: 'declarations.confirm.decline.description' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {intl.formatMessage({ id: 'common.cancel' })}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDecline}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {intl.formatMessage({ id: 'declarations.action.decline' })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeclarationValidationActions;

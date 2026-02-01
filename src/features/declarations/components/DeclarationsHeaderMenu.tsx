import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Plus, Upload, Download, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface DeclarationsHeaderMenuProps {
  onRefresh?: () => void;
  canCreate?: boolean;
  canUpload?: boolean;
}

/**
 * Header menu with actions for declarations management
 */
export const DeclarationsHeaderMenu: React.FC<DeclarationsHeaderMenuProps> = ({
  onRefresh,
  canCreate = true,
  canUpload = true,
}) => {
  const navigate = useNavigate();
  const intl = useIntl();

  const handleCreateDeclaration = () => {
    navigate('/declarations/create');
  };

  const handleUploadDeclarations = () => {
    navigate('/declarations/upload');
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div>
        <h2 className="text-lg font-semibold">
          {intl.formatMessage({ id: 'declarations.title' })}
        </h2>
        <p className="text-sm text-muted-foreground">
          {intl.formatMessage({ id: 'declarations.subtitle' })}
        </p>
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {intl.formatMessage({ id: 'common.refresh' })}
          </Button>
        )}

        {(canCreate || canUpload) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {intl.formatMessage({ id: 'declarations.add' })}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {canCreate && (
                <DropdownMenuItem onClick={handleCreateDeclaration}>
                  <Plus className="h-4 w-4 mr-2" />
                  {intl.formatMessage({ id: 'declarations.add.form' })}
                </DropdownMenuItem>
              )}
              {canUpload && (
                <DropdownMenuItem onClick={handleUploadDeclarations}>
                  <Upload className="h-4 w-4 mr-2" />
                  {intl.formatMessage({ id: 'declarations.add.upload' })}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default DeclarationsHeaderMenu;

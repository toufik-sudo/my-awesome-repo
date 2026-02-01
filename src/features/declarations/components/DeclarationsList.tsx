import React from 'react';
import { useIntl } from 'react-intl';
import { Loader2, FileX } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DeclarationHeader } from './DeclarationHeader';
import { DeclarationRow } from './DeclarationRow';
import { useDeclarationsList } from '../hooks/useDeclarationsList';
import { DECLARATION_HEADERS, BENEFICIARY_DECLARATION_HEADERS } from '../constants';

interface DeclarationsListProps {
  isBeneficiary?: boolean;
  programId?: number;
  platformId?: number;
}

/**
 * Main declarations list component with infinite scroll
 */
export const DeclarationsList: React.FC<DeclarationsListProps> = ({
  isBeneficiary = false,
  programId,
  platformId,
}) => {
  const intl = useIntl();
  const {
    declarations,
    isLoading,
    hasMore,
    sort,
    scrollRef,
    handleSort,
    handleLoadMore,
    refresh,
  } = useDeclarationsList({ programId, platformId, isBeneficiary });

  const headers = isBeneficiary ? BENEFICIARY_DECLARATION_HEADERS : DECLARATION_HEADERS;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !isLoading) {
      const currentPage = Math.floor(declarations.length / 20);
      handleLoadMore(currentPage + 1);
    }
  };

  // Callback when a declaration is validated/declined - refresh the list
  const handleValidationSuccess = () => {
    refresh();
  };

  return (
    <div className="flex flex-col h-full rounded-lg border bg-card shadow-sm">
      <DeclarationHeader
        headers={headers}
        sortState={sort}
        onSort={handleSort}
        isLoading={isLoading}
      />

      <ScrollArea
        ref={scrollRef}
        className="flex-1"
        onScroll={handleScroll}
      >
        <div className="min-h-[300px]">
          {declarations.map((declaration) => (
            <DeclarationRow
              key={declaration.id}
              declaration={declaration}
              isAdmin={!isBeneficiary}
              onValidationSuccess={handleValidationSuccess}
            />
          ))}

          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && declarations.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <FileX className="h-12 w-12 mb-4" />
              <p>{intl.formatMessage({ id: 'declarations.list.empty' })}</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DeclarationsList;

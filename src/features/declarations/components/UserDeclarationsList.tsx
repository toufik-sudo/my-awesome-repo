// -----------------------------------------------------------------------------
// UserDeclarationsList Component
// Migrated from old_app/src/components/molecules/wall/declarations/UserDeclarationsList.tsx
// Now connected to real UserDeclarationsApi
// -----------------------------------------------------------------------------

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { useWallSelection } from '@/features/wall/hooks/useWallSelection';
import { isAnyKindOfAdmin } from '@/services/security/accessServices';
import UserDeclarationHeader from './UserDeclarationHeader';
import UserDeclarationRow from './UserDeclarationRow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2, FileX } from 'lucide-react';
import { useIntl } from 'react-intl';
import UserDeclarationsApi from '@/api/UserDeclarationsApi';
import { USER_DECLARATIONS_DEFAULT_SORT } from '@/constants/api/declarations';

export interface IDeclaration {
  id: number;
  status: number;
  source?: number;
  createdAt: string;
  dateOfEvent?: string;
  amount?: number;
  quantity?: number;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  program?: {
    id: number;
    name: string;
    type?: number;
    open?: boolean;
  };
  product?: {
    id: number;
    name: string;
  };
  otherProductName?: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  validatedBy?: {
    firstName?: string;
    lastName?: string;
  };
  [key: string]: unknown;
}

export interface ISortState {
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
}

const userDeclarationsApi = new UserDeclarationsApi();
const DEFAULT_LIST_SIZE = 20;

/**
 * Molecule component used to render declarations list with real data.
 */
const UserDeclarationsList: React.FC = () => {
  const intl = useIntl();
  const { state } = useLocation();
  const { selectedPlatform, selectedProgramId } = useWallSelection();
  
  const [userDeclarations, setUserDeclarations] = useState<IDeclaration[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sortState, setSortState] = useState<ISortState>({
    sortBy: USER_DECLARATIONS_DEFAULT_SORT.sortBy,
    sortDirection: USER_DECLARATIONS_DEFAULT_SORT.sortDirection
  });
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const cancelTokenRef = useRef<ReturnType<typeof axios.CancelToken.source> | null>(null);
  
  const platformId = selectedPlatform?.id;
  const isAdmin = isAnyKindOfAdmin(selectedPlatform?.role || 0);

  const loadDeclarations = useCallback(async (reset: boolean = false) => {
    if (!platformId) return;
    
    // Cancel any pending request
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Operation cancelled due to new request');
    }
    cancelTokenRef.current = axios.CancelToken.source();

    setIsLoading(true);
    
    try {
      const offset = reset ? 0 : userDeclarations.length;
      
      const response = await userDeclarationsApi.getDeclarations(
        {
          platformId,
          programId: selectedProgramId,
          offset,
          size: DEFAULT_LIST_SIZE,
          sortBy: sortState.sortBy,
          sortDirection: sortState.sortDirection,
        },
        cancelTokenRef.current
      );

      const newDeclarations: IDeclaration[] = response.userDeclarations || [];
      const total = response.total || 0;

      if (reset) {
        setUserDeclarations(newDeclarations);
      } else {
        setUserDeclarations(prev => [...prev, ...newDeclarations]);
      }

      setHasMore(offset + newDeclarations.length < total);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Error loading declarations:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [platformId, selectedProgramId, sortState, userDeclarations.length]);

  const handleSort = useCallback((sortBy: string) => {
    setSortState(prev => ({
      sortBy,
      sortDirection: prev.sortBy === sortBy && prev.sortDirection === 'ASC' ? 'DESC' : 'ASC'
    }));
    setUserDeclarations([]);
    setHasMore(true);
  }, []);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasMore && !isLoading) {
      loadDeclarations(false);
    }
  }, [hasMore, isLoading, loadDeclarations]);

  // Initial load
  useEffect(() => {
    if (platformId) {
      loadDeclarations(true);
    }

    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, [platformId, selectedProgramId, sortState]);

  if (isLoading && userDeclarations.length === 0) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <ScrollArea ref={scrollRef} className="h-[70vh]" onScroll={handleScroll as any}>
      <div className="min-w-full">
        <UserDeclarationHeader sortState={sortState} onSort={handleSort} isLoading={isLoading} />
        
        {userDeclarations.length === 0 && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileX className="h-12 w-12 mb-4" />
            <p>{intl.formatMessage({ id: 'declarations.list.empty' })}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {userDeclarations.map(declaration => (
              <UserDeclarationRow 
                key={declaration.id} 
                declaration={declaration} 
                listState={sortState} 
                isAdmin={isAdmin} 
              />
            ))}
          </div>
        )}
        
        {isLoading && userDeclarations.length > 0 && (
          <div className="py-4 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default UserDeclarationsList;

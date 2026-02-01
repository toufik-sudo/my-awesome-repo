// -----------------------------------------------------------------------------
// Declarations API Hooks
// React Query hooks for declaration data fetching
// -----------------------------------------------------------------------------

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { declarationsApi } from '@/api';
import {
  IDeclarationSearchCriteria,
  IDeclarationCreate,
  DeclarationStatus,
  DeclarationStatusOperation,
} from '@/api/types';

// Query keys
export const declarationsKeys = {
  all: ['declarations'] as const,
  lists: () => [...declarationsKeys.all, 'list'] as const,
  list: (filters: IDeclarationSearchCriteria) => [...declarationsKeys.lists(), filters] as const,
  blocks: () => [...declarationsKeys.all, 'block'] as const,
  block: (filters: IDeclarationSearchCriteria) => [...declarationsKeys.blocks(), filters] as const,
  details: () => [...declarationsKeys.all, 'detail'] as const,
  detail: (id: number) => [...declarationsKeys.details(), id] as const,
  notes: (id: number) => [...declarationsKeys.detail(id), 'notes'] as const,
  myDeclarations: (userId: string) => [...declarationsKeys.all, 'my', userId] as const,
  pendingCount: (platformId: number, programId?: number) =>
    [...declarationsKeys.all, 'pending', platformId, programId] as const,
};

/**
 * Fetch paginated list of declarations
 */
export function useDeclarations(searchCriteria: IDeclarationSearchCriteria) {
  return useQuery({
    queryKey: declarationsKeys.list(searchCriteria),
    queryFn: () => declarationsApi.getDeclarations(searchCriteria),
    staleTime: 30000,
    enabled: !!searchCriteria.platform || !!searchCriteria.program,
  });
}

/**
 * Fetch declarations in block view
 */
export function useBlockDeclarations(searchCriteria: IDeclarationSearchCriteria) {
  return useQuery({
    queryKey: declarationsKeys.block(searchCriteria),
    queryFn: () => declarationsApi.getBlockDeclarations(searchCriteria),
    enabled: !!searchCriteria.platform,
  });
}

/**
 * Fetch single declaration by ID
 */
export function useDeclaration(declarationId: number | undefined) {
  return useQuery({
    queryKey: declarationsKeys.detail(declarationId || 0),
    queryFn: () => declarationsApi.getDeclaration(declarationId!),
    enabled: !!declarationId,
    staleTime: 60000,
  });
}

/**
 * Fetch declaration notes
 */
export function useDeclarationNotes(declarationId: number | undefined) {
  return useQuery({
    queryKey: declarationsKeys.notes(declarationId || 0),
    queryFn: () => declarationsApi.getNotes(declarationId!),
    enabled: !!declarationId,
  });
}

/**
 * Fetch current user's declarations
 */
export function useMyDeclarations(
  userId: string | undefined,
  params?: Partial<IDeclarationSearchCriteria>
) {
  return useQuery({
    queryKey: declarationsKeys.myDeclarations(userId || ''),
    queryFn: () => declarationsApi.getMyDeclarations(userId!, params),
    enabled: !!userId,
  });
}

/**
 * Fetch pending declarations count
 */
export function usePendingDeclarationsCount(
  platformId: number | undefined,
  programId?: number
) {
  return useQuery({
    queryKey: declarationsKeys.pendingCount(platformId || 0, programId),
    queryFn: () => declarationsApi.getPendingCount(platformId!, programId),
    enabled: !!platformId,
    staleTime: 60000,
  });
}

/**
 * Create declaration mutation
 */
export function useCreateDeclaration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (declaration: IDeclarationCreate) =>
      declarationsApi.createDeclaration(declaration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: declarationsKeys.lists() });
    },
  });
}

/**
 * Validate declaration mutation
 */
export function useValidateDeclaration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      declaration,
      newStatus,
    }: {
      declaration: { id: number; hash: string };
      newStatus: DeclarationStatus;
    }) => declarationsApi.validateDeclaration(declaration, newStatus),
    onSuccess: (_, { declaration }) => {
      queryClient.invalidateQueries({ queryKey: declarationsKeys.detail(declaration.id) });
      queryClient.invalidateQueries({ queryKey: declarationsKeys.lists() });
    },
  });
}

/**
 * Batch validate declarations mutation
 */
export function useBatchValidateDeclarations() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      validations: { id: number; hash: string; operation: DeclarationStatusOperation }[]
    ) => declarationsApi.batchValidateDeclarations(validations),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: declarationsKeys.all });
    },
  });
}

/**
 * Add note mutation
 */
export function useAddDeclarationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ declarationId, text }: { declarationId: number; text: string }) =>
      declarationsApi.addNote(declarationId, text),
    onSuccess: (_, { declarationId }) => {
      queryClient.invalidateQueries({ queryKey: declarationsKeys.notes(declarationId) });
    },
  });
}

/**
 * Remove note mutation
 */
export function useRemoveDeclarationNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ noteId, declarationId }: { noteId: number; declarationId: number }) =>
      declarationsApi.removeNote(noteId),
    onSuccess: (_, { declarationId }) => {
      queryClient.invalidateQueries({ queryKey: declarationsKeys.notes(declarationId) });
    },
  });
}

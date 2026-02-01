// -----------------------------------------------------------------------------
// useRagIndexation Hook
// Manages RAG document indexation state and operations
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';
import aiRagApi from '@/api/AIRagApi';
import type { IRagIndexDoc, IRagCategory, IAiAdminProgram } from '../types';
import { RAG_CATEGORIES, RAG_COMMON_CATEGORIES } from '../types';

export interface UseRagIndexationReturn {
  ragIndexDocs: IRagIndexDoc[];
  categories: IRagCategory[];
  commonCategories: IRagCategory[];
  isLoading: boolean;
  isAlmostOneBlocked: boolean;
  selectedProgram: IAiAdminProgram | null;
  setSelectedProgram: (program: IAiAdminProgram | null) => void;
  uploadFile: (
    file: File | null,
    categoryName: string,
    isCommon: boolean,
    isLink?: boolean,
    url?: string
  ) => Promise<boolean>;
  resetCategory: (catName: string, isCommon: boolean, isActivateReset?: boolean) => Promise<void>;
  blockCategory: (catName: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useRagIndexation(userUuid: string): UseRagIndexationReturn {
  const [ragIndexDocs, setRagIndexDocs] = useState<IRagIndexDoc[]>([]);
  const [categories, setCategories] = useState<IRagCategory[]>(RAG_CATEGORIES);
  const [commonCategories, setCommonCategories] = useState<IRagCategory[]>(RAG_COMMON_CATEGORIES);
  const [selectedProgram, setSelectedProgram] = useState<IAiAdminProgram | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlmostOneBlocked, setIsAlmostOneBlocked] = useState(false);
  const { formatMessage } = useIntl();

  const fetchRagIndex = useCallback(async () => {
    if (!selectedProgram?.id) return;

    setIsLoading(true);
    try {
      const response = await aiRagApi.getRagIndex(userUuid, String(selectedProgram.id));
      const docs: IRagIndexDoc[] = response?.data || [];
      setRagIndexDocs(docs);

      // Update categories based on indexed docs
      let hasBlocked = false;
      
      const updatedCategories = RAG_CATEGORIES.map(cat => {
        const filtered = docs.filter(
          d => d.categoryToIndex === cat.catName && d.programId === String(selectedProgram.id)
        );
        const isBlocked = filtered.length > 0 && filtered[0].isIndexBlocked;
        const isActivatedReset = filtered.length > 0 && filtered[0].status === 'ACTIVATED_RESET';
        
        if (isBlocked) hasBlocked = true;
        
        return { ...cat, disabled: isBlocked, isActivatedReset };
      });

      const updatedCommonCategories = RAG_COMMON_CATEGORIES.map(cat => {
        const filtered = docs.filter(
          d => d.categoryToIndex === cat.catName && d.programId === String(selectedProgram.id)
        );
        const isBlocked = filtered.length > 0 && filtered[0].isIndexBlocked;
        const isActivatedReset = filtered.length > 0 && filtered[0].status === 'ACTIVATED_RESET';
        
        return { ...cat, disabled: isBlocked, isActivatedReset };
      });

      setCategories(updatedCategories);
      setCommonCategories(updatedCommonCategories);
      setIsAlmostOneBlocked(hasBlocked);
    } catch (error) {
      console.error('Failed to fetch RAG index:', error);
      toast.error(formatMessage({ id: 'ai.rag.error.fetch' }, { defaultMessage: 'Failed to fetch indexation status' }));
    } finally {
      setIsLoading(false);
    }
  }, [userUuid, selectedProgram, formatMessage]);

  const uploadFile = useCallback(async (
    file: File | null,
    categoryName: string,
    isCommon: boolean,
    isLink = false,
    url = ''
  ): Promise<boolean> => {
    if (!selectedProgram) {
      toast.error(formatMessage({ id: 'ai.rag.error.noProgram' }, { defaultMessage: 'Please select a program first' }));
      return false;
    }

    if (!isLink && !file) {
      return false;
    }

    setIsLoading(true);
    try {
      const programName = selectedProgram.programName?.replace(/\s+/g, '_') || '';
      const companyName = selectedProgram.companyName?.replace(/\s+/g, '_') || '';
      const iaName = selectedProgram.iaName || '';
      const iaType = selectedProgram.iaType || '';

      // Determine file extension and name
      let fileName: string;
      let ext: string;
      
      if (isLink) {
        ext = '.txt';
        fileName = isCommon ? 'common.txt' : `${categoryName}.txt`;
      } else {
        const nameParts = file!.name.split('.');
        ext = '.' + nameParts.pop();
        fileName = isCommon 
          ? `${nameParts.join('_').replace(/\s+/g, '_')}${ext}`
          : `${categoryName}${ext}`;
      }

      await aiRagApi.uploadFiles({
        file: isLink ? undefined : [file!],
        companyName,
        programName,
        isCommon,
        fileName,
        userEmail: '', // Should come from user context
        iaName,
        iaType,
        isLink,
        url,
      });

      // Update index status
      await aiRagApi.setRagIndex({
        isToBlockCat: false,
        userUuid,
        programId: String(selectedProgram.id),
        status: 'OK',
        comment: '',
        isCommon,
        catName: categoryName,
        originalFilename: isLink ? 'link' : file!.name,
        iaType,
        link: url,
      });

      await fetchRagIndex();
      
      const filename = isLink ? url : file!.name;
      toast.success(formatMessage(
        { id: 'ai.rag.success.upload' }, 
        { defaultMessage: `File ${filename} uploaded for indexation`, filename }
      ));
      
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error(formatMessage({ id: 'ai.rag.error.upload' }, { defaultMessage: 'Failed to upload file' }));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [selectedProgram, userUuid, formatMessage, fetchRagIndex]);

  const resetCategory = useCallback(async (
    catName: string,
    isCommon: boolean,
    isActivateReset = false
  ) => {
    if (!selectedProgram) {
      toast.error(formatMessage({ id: 'ai.rag.error.noProgram' }, { defaultMessage: 'Please select a program first' }));
      return;
    }

    setIsLoading(true);
    try {
      if (!isActivateReset) {
        const programName = selectedProgram.programName?.replace(/\s+/g, '_') || '';
        const companyName = selectedProgram.companyName?.replace(/\s+/g, '_') || '';
        const iaId = selectedProgram.iaName || '';
        const iaType = selectedProgram.iaType || '';
        
        await aiRagApi.resetRagNamespace(programName, companyName, iaId, iaType, catName, isCommon);
      }
      
      await aiRagApi.resetRagIndex(userUuid, String(selectedProgram.id), catName, isActivateReset, isCommon);
      await fetchRagIndex();
      
      toast.success(formatMessage(
        { id: isActivateReset ? 'ai.rag.success.activate' : 'ai.rag.success.reset' },
        { defaultMessage: `Category ${catName} reset successfully` }
      ));
    } catch (error) {
      console.error('Reset failed:', error);
      toast.error(formatMessage({ id: 'ai.rag.error.reset' }, { defaultMessage: 'Failed to reset category' }));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProgram, userUuid, formatMessage, fetchRagIndex]);

  const blockCategory = useCallback(async (catName: string) => {
    if (!selectedProgram) return;

    setIsLoading(true);
    try {
      await aiRagApi.setRagIndex({
        isToBlockCat: true,
        userUuid,
        programId: String(selectedProgram.id),
        status: 'BLOCKED',
        comment: '',
        isCommon: false,
        catName,
        originalFilename: '',
        iaType: '',
      });
      
      await fetchRagIndex();
      toast.success(formatMessage({ id: 'ai.rag.success.block' }, { defaultMessage: `Category ${catName} blocked` }));
    } catch (error) {
      console.error('Block failed:', error);
      toast.error(formatMessage({ id: 'ai.rag.error.block' }, { defaultMessage: 'Failed to block category' }));
    } finally {
      setIsLoading(false);
    }
  }, [selectedProgram, userUuid, formatMessage, fetchRagIndex]);

  useEffect(() => {
    if (selectedProgram) {
      fetchRagIndex();
    }
  }, [selectedProgram, fetchRagIndex]);

  return {
    ragIndexDocs,
    categories,
    commonCategories,
    isLoading,
    isAlmostOneBlocked,
    selectedProgram,
    setSelectedProgram,
    uploadFile,
    resetCategory,
    blockCategory,
    refresh: fetchRagIndex,
  };
}

export default useRagIndexation;

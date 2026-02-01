// -----------------------------------------------------------------------------
// useHandleInvitesSubmission Hook
// Handles user invites to program submission - aligned with old_app
// Migrated from old_app/src/hooks/wall/useHandleInvitesSubmission.ts
// -----------------------------------------------------------------------------

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { useIntl } from 'react-intl';

import { inviteUsersApi } from '@/api/InviteUsersApi';
import { filesApi } from '@/api/FilesApi';
import { FILE, EMAIL, ALL_USERS } from '@/constants/wall/users';
import { INVITED_USER_DATA, ACCEPTED_USERS_LIST_TYPE } from '@/constants/wall/launch';
import { setLaunchDataStep } from '@/store/actions/launchActions';
import type { RootState } from '@/store';

interface InvitedUserData {
  fileId?: string;
  invitedUsersFile?: string;
  fileName?: string;
  totalLines?: number;
  totalValid?: number;
  totalInvalid?: number;
  validRecords?: number;
  invalidRecords?: Array<{ row: number; errors: string[] }>;
}

interface UseHandleInvitesSubmissionProps {
  platformId?: number;
  programId?: number;
}

interface UseHandleInvitesSubmissionReturn {
  // State
  activeTab: string;
  isSubmitting: boolean;
  isUploading: boolean;
  inviteError: string | null;
  uploadError: string | null;
  forceRemountKey: number;
  isDisabled: boolean;
  
  // Email list management
  emailList: string[];
  addEmail: (email: string) => boolean;
  removeEmail: (email: string) => void;
  clearEmails: () => void;
  
  // File upload
  uploadedFile: InvitedUserData | null;
  handleFileUpload: (file: File) => Promise<void>;
  removeFile: () => void;
  validateFileType: (file: File) => boolean;
  
  // Tab management
  setActiveTab: (tab: string) => void;
  
  // Submission
  handleSubmitInvites: () => Promise<void>;
}

export const useHandleInvitesSubmission = ({
  platformId,
  programId
}: UseHandleInvitesSubmissionProps = {}): UseHandleInvitesSubmissionReturn => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();

  // Get data from Redux store
  const launchData = useSelector((state: RootState & { launchReducer?: Record<string, unknown> }) =>
    state.launchReducer || {}
  );

  const linkedEmailsData = (launchData.linkedEmailsData as string[]) || [];
  const invitedUserData = launchData.invitedUserData as InvitedUserData | undefined;
  const currentMethod = (launchData.invitationMethod as string) || EMAIL;

  // Local state
  const [activeTab, setActiveTab] = useState<string>(currentMethod);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [forceRemountKey, setForceRemountKey] = useState(0);
  const [emailList, setEmailList] = useState<string[]>(linkedEmailsData);

  // Sync email list with store - only on mount to avoid loops
  useEffect(() => {
    if (linkedEmailsData.length > 0) {
      setEmailList(linkedEmailsData);
    }
  }, []); // Empty array - only sync on mount

  // Clear error when tab changes
  useEffect(() => {
    setInviteError(null);
    setUploadError(null);
  }, [activeTab]);

  // Update store when tab changes
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    dispatch(setLaunchDataStep({ key: 'invitationMethod', value: tab }));
  }, [dispatch]);

  // Email management - using functional updates to avoid dependencies on emailList
  const addEmail = useCallback((email: string): boolean => {
    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      return false;
    }

    let newList: string[] | null = null;

    setEmailList(prevList => {
      if (prevList.includes(trimmedEmail)) {
        return prevList; // Already exists, no change
      }
      newList = [...prevList, trimmedEmail];
      return newList;
    });

    // Update Redux store after state update
    if (newList) {
      dispatch(setLaunchDataStep({ key: 'linkedEmailsData', value: newList }));
      return true;
    }

    return false;
  }, [dispatch]);

  const removeEmail = useCallback((email: string) => {
    let newList: string[] = [];

    setEmailList(prevList => {
      newList = prevList.filter(e => e !== email);
      return newList;
    });

    // Update Redux store after state update
    dispatch(setLaunchDataStep({ key: 'linkedEmailsData', value: newList }));
  }, [dispatch]);

  const clearEmails = useCallback(() => {
    setEmailList([]);
    dispatch(setLaunchDataStep({ key: 'linkedEmailsData', value: [] }));
  }, [dispatch]);

  // File validation
  const validateFileType = useCallback((file: File): boolean => {
    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    return ACCEPTED_USERS_LIST_TYPE.includes(extension);
  }, []);

  // File upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (!validateFileType(file)) {
      setUploadError(formatMessage({
        id: 'launch.users.invalidFileType',
        defaultMessage: 'Invalid file type. Please upload a CSV, XLS, or XLSX file.'
      }));
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Upload file to backend
      const result = await filesApi.uploadFile(file, 1); // Type 1 for user list

      // Store uploaded file data
      const fileData: InvitedUserData = {
        fileId: result.id?.toString(),
        invitedUsersFile: result.id?.toString(),
        fileName: file.name,
        validRecords: 0, // Will be updated after processing
        invalidRecords: []
      };

      dispatch(setLaunchDataStep({ key: INVITED_USER_DATA, value: fileData }));

      toast.success(formatMessage({
        id: 'launch.users.uploadSuccess',
        defaultMessage: 'File uploaded successfully'
      }));
    } catch (error) {
      console.error('File upload error:', error);
      setUploadError(formatMessage({
        id: 'launch.users.uploadError',
        defaultMessage: 'Failed to upload file. Please try again.'
      }));
    } finally {
      setIsUploading(false);
    }
  }, [validateFileType, formatMessage, dispatch]);

  // Remove uploaded file
  const removeFile = useCallback(() => {
    dispatch(setLaunchDataStep({ key: INVITED_USER_DATA, value: null }));
    setUploadError(null);
  }, [dispatch]);

  // Send email invitations
  const sendEmailInvitations = useCallback(async () => {
    if (!platformId || !programId) {
      setInviteError(formatMessage({
        id: 'launch.users.noProgramSelected',
        defaultMessage: 'Please select a program first.'
      }));
      return;
    }

    setIsSubmitting(true);

    try {
      // Get current email list
      let currentEmails: string[] = [];
      setEmailList(prev => {
        currentEmails = prev;
        return prev;
      });

      await inviteUsersApi.sendInvitationsToLinkedEmails(
        currentEmails,
        EMAIL,
        platformId,
        programId
      );

      setInviteError(null);
      clearEmails();
      toast.success(formatMessage({
        id: 'wall.send.invitation.success',
        defaultMessage: 'Invitations sent successfully!'
      }));
    } catch (error) {
      console.error('Email invitation error:', error);
      setInviteError(formatMessage({
        id: 'wall.send.invitation.error',
        defaultMessage: 'Failed to send invitations. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [platformId, programId, clearEmails, formatMessage]);

  // Send file invitations
  const sendFileInvitations = useCallback(async () => {
    if (!programId || !invitedUserData) {
      setInviteError(formatMessage({
        id: 'launch.users.noFileUploaded',
        defaultMessage: 'Please upload a file first.'
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      await inviteUsersApi.sendInvitationsWithFile(invitedUserData, programId);

      toast.success(formatMessage({
        id: 'wall.send.invitation.success',
        defaultMessage: 'Invitations sent successfully!'
      }));

      // Reset file data
      dispatch(setLaunchDataStep({ key: INVITED_USER_DATA, value: null }));
      setForceRemountKey(prev => prev + 1);
    } catch (error) {
      console.error('File invitation error:', error);
      setInviteError(formatMessage({
        id: 'wall.send.invitation.error',
        defaultMessage: 'Failed to send invitations. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [programId, invitedUserData, formatMessage, dispatch]);

  // Send all users invitation
  const sendAllUsersInvitation = useCallback(async () => {
    if (!platformId || !programId) {
      setInviteError(formatMessage({
        id: 'launch.users.noProgramSelected',
        defaultMessage: 'Please select a program first.'
      }));
      return;
    }

    setIsSubmitting(true);
    try {
      await inviteUsersApi.sendInvitationsToLinkedEmails(
        [],
        ALL_USERS,
        platformId,
        programId
      );

      setInviteError(null);
      toast.success(formatMessage({
        id: 'wall.send.invitation.success',
        defaultMessage: 'Invitations sent successfully!'
      }));
    } catch (error) {
      console.error('All users invitation error:', error);
      setInviteError(formatMessage({
        id: 'wall.send.invitation.error',
        defaultMessage: 'Failed to send invitations. Please try again.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  }, [platformId, programId, formatMessage]);

  // Main submission handler
  const handleSubmitInvites = useCallback(async () => {
    setInviteError(null);

    switch (activeTab) {
      case EMAIL:
        return sendEmailInvitations();
      case FILE:
        return sendFileInvitations();
      case ALL_USERS:
        return sendAllUsersInvitation();
      default:
        setInviteError(formatMessage({
          id: 'launch.users.invalidMethod',
          defaultMessage: 'Please select an invitation method.'
        }));
    }
  }, [activeTab, sendEmailInvitations, sendFileInvitations, sendAllUsersInvitation, formatMessage]);

  // Calculate if submit is disabled - use emailList.length to avoid dependency issues
  const isDisabled = useMemo(() => {
    if (activeTab === ALL_USERS) {
      return false;
    }

    if (activeTab === EMAIL) {
      return emailList.length === 0;
    }

    if (activeTab === FILE) {
      if (!invitedUserData?.invitedUsersFile) {
        return true;
      }
      // Check if all records are invalid
      if (invitedUserData.totalInvalid && invitedUserData.totalLines) {
        return invitedUserData.totalInvalid === invitedUserData.totalLines;
      }
      return false;
    }

    return true;
  }, [activeTab, emailList.length, invitedUserData]);

  return {
    // State
    activeTab,
    isSubmitting,
    isUploading,
    inviteError,
    uploadError,
    forceRemountKey,
    isDisabled,

    // Email management
    emailList,
    addEmail,
    removeEmail,
    clearEmails,

    // File upload
    uploadedFile: invitedUserData || null,
    handleFileUpload,
    removeFile,
    validateFileType,

    // Tab management
    setActiveTab: handleTabChange,

    // Submission
    handleSubmitInvites
  };
};

export default useHandleInvitesSubmission;

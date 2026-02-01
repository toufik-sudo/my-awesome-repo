// -----------------------------------------------------------------------------
// useResultsConfig Hook
// Manages results configuration state
// Migrated from old_app hooks
// -----------------------------------------------------------------------------

import { useState, useCallback, useEffect } from 'react';
import { useLaunchWizard } from './useLaunchWizard';
import {
  DECLARATION_FORM,
  FILE_IMPORT,
  RESULTS_CHANNEL,
  RESULTS_MANUAL_VALIDATION,
  RESULTS_EMAIL_NOTIFY,
  RESULTS_USERS_FIELDS
} from '@/constants/wall/launch';

interface ResultsConfig {
  declarationForm: boolean;
  fileImport: boolean;
  manualValidation: boolean;
  emailNotify: boolean;
  autoApproveDelay: string;
  requireProof: boolean;
  selectedFields: string[];
}

const DEFAULT_FIELDS = ['dateOfEvent', 'quantity'];

const AVAILABLE_FIELDS = [
  { id: 'dateOfEvent', required: true },
  { id: 'quantity', required: true },
  { id: 'amount', required: false },
  { id: 'companyName', required: false },
  { id: 'customerReference', required: false },
  { id: 'productReference', required: false },
  { id: 'additionalComments', required: false },
];

export const useResultsConfig = () => {
  const { updateStepData, launchData } = useLaunchWizard();
  
  const resultChannel = launchData[RESULTS_CHANNEL] as {
    [DECLARATION_FORM]?: boolean;
    [FILE_IMPORT]?: boolean;
  } | undefined;

  const [config, setConfig] = useState<ResultsConfig>(() => ({
    declarationForm: resultChannel?.[DECLARATION_FORM] ?? true,
    fileImport: resultChannel?.[FILE_IMPORT] ?? false,
    manualValidation: (launchData[RESULTS_MANUAL_VALIDATION] as boolean) ?? false,
    emailNotify: (launchData[RESULTS_EMAIL_NOTIFY] as boolean) ?? false,
    autoApproveDelay: (launchData.autoApproveDelay as string) ?? 'none',
    requireProof: (launchData.requireProof as boolean) ?? false,
    selectedFields: (launchData[RESULTS_USERS_FIELDS] as string[]) || DEFAULT_FIELDS,
  }));

  // Sync to store
  useEffect(() => {
    updateStepData(RESULTS_CHANNEL, {
      [DECLARATION_FORM]: config.declarationForm,
      [FILE_IMPORT]: config.fileImport,
    });
    updateStepData(RESULTS_MANUAL_VALIDATION, config.manualValidation);
    updateStepData(RESULTS_EMAIL_NOTIFY, config.emailNotify);
    updateStepData('autoApproveDelay', config.autoApproveDelay);
    updateStepData('requireProof', config.requireProof);
    updateStepData(RESULTS_USERS_FIELDS, config.selectedFields);
  }, [config]);

  const updateConfig = useCallback(<K extends keyof ResultsConfig>(key: K, value: ResultsConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleField = useCallback((fieldId: string) => {
    const field = AVAILABLE_FIELDS.find(f => f.id === fieldId);
    if (field?.required) return; // Can't toggle required fields
    
    setConfig(prev => ({
      ...prev,
      selectedFields: prev.selectedFields.includes(fieldId)
        ? prev.selectedFields.filter(f => f !== fieldId)
        : [...prev.selectedFields, fieldId]
    }));
  }, []);

  const setDeclarationFormEnabled = useCallback((enabled: boolean) => {
    setConfig(prev => ({ ...prev, declarationForm: enabled }));
  }, []);

  const setFileImportEnabled = useCallback((enabled: boolean) => {
    setConfig(prev => ({ ...prev, fileImport: enabled }));
  }, []);

  const setManualValidation = useCallback((enabled: boolean) => {
    setConfig(prev => ({ ...prev, manualValidation: enabled }));
  }, []);

  const setEmailNotify = useCallback((enabled: boolean) => {
    setConfig(prev => ({ ...prev, emailNotify: enabled }));
  }, []);

  // Validation
  const isValid = config.declarationForm || config.fileImport;

  return {
    config,
    updateConfig,
    toggleField,
    setDeclarationFormEnabled,
    setFileImportEnabled,
    setManualValidation,
    setEmailNotify,
    availableFields: AVAILABLE_FIELDS,
    isValid
  };
};

export default useResultsConfig;

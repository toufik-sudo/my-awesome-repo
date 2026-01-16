export interface ISubmitFormButton {
  isSubmitting: boolean;
  buttonText: string;
  loading?: boolean;
  className?: string;
  nextStepDisabled?: boolean;
  type?: string;
  variant?: string;
  onClick?: () => void;
  isLastStep?: boolean;
  isAvatarStep?: boolean;
  customStyle?: {};
}

// -----------------------------------------------------------------------------
// Organisms Barrel Export
// -----------------------------------------------------------------------------

// Layout
export { LeftSideLayout, type LeftSideLayoutProps } from './LeftSideLayout';

// Forms
export { GenericFormBuilder, type GenericFormBuilderProps } from './GenericFormBuilder';

// Modals - Base Components
export { FlexibleModalContainer, type FlexibleModalContainerProps } from './FlexibleModalContainer';

// Modals - Confirmation
export { 
  ConfirmationModal, 
  DeleteConfirmationModal, 
  BlockUserModal, 
  LeaveConfirmationModal,
  type ConfirmationModalProps,
  type ConfirmationVariant 
} from './ConfirmationModal';
export { LogOutModal, type LogOutModalProps } from './LogOutModal';

// Modals - Success/Info
export { SuccessModal, type SuccessModalProps, type SuccessModalType } from './SuccessModal';
export { InfoModal, FraudInfoModal, type InfoModalProps, type InfoModalType } from './InfoModal';

// Modals - Interactive
export { ImageUploadModal, type ImageUploadModalProps, type ImageCropConfig } from './ImageUploadModal';
export { 
  SelectionModal, 
  ZoneSelectionModal, 
  DeclarationTypeModal,
  type SelectionModalProps,
  type SelectionOption 
} from './SelectionModal';
export { FormModal, type FormModalProps } from './FormModal';
export { ListModal, LikesModal, type ListModalProps, type ListItem } from './ListModal';
export { PDFViewerModal, type PDFViewerModalProps } from './PDFViewerModal';

// Notifications
export { 
  NotificationItem, 
  NotificationListItem, 
  NotificationDropdownItem,
  type NotificationItemProps, 
  type NotificationData 
} from './NotificationItem';
export { NotificationList, type NotificationListProps } from './NotificationList';

export { 
  NotificationDropdown, 
  NotificationBell, 
  type NotificationDropdownProps 
} from './NotificationDropdown';

// User Management
export { 
  InviteUserBlock, 
  type InviteUserBlockProps, 
  type InviteMethod, 
  type InviteEmail 
} from './InviteUserBlock';

export { 
  UserDetailsBlock, 
  type UserDetailsBlockProps, 
  type UserDetails, 
  type UserProgram 
} from './UserDetailsBlock';

// Settings
export { 
  SettingsBlock, 
  SettingsSection, 
  SettingsRow, 
  SettingsLink,
  SETTINGS_TAB_ICONS,
  type SettingsBlockProps, 
  type SettingsTab, 
  type SettingsTabId,
  type SettingsSectionProps,
  type SettingsRowProps,
  type SettingsLinkProps
} from './SettingsBlock';

// Social/Wall
export { 
  PostCard, 
  type PostCardProps, 
  type PostData, 
  type PostAuthor, 
  type PostAttachment 
} from './PostCard';
export { 
  CommentSection, 
  type CommentSectionProps, 
  type CommentData, 
  type CommentAuthor, 
  type CommentAttachment 
} from './CommentSection';
export { 
  LikeButton, 
  type LikeButtonProps, 
  type LikeUser 
} from './LikeButton';

// Additional User Management Modals
export { default as DeleteAccountModal } from './DeleteAccountModal';
export { default as BlockUserModal2 } from './BlockUserModal';
export { default as UserProgramRoleModal } from './UserProgramRoleModal';

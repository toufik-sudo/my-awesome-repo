// -----------------------------------------------------------------------------
// Initial Modal State
// Migrated from old_app/src/store/initialState/initialModalState.ts
// -----------------------------------------------------------------------------

import { IModalData, ModalType } from '../actions/modalActions';

export type IModalReducer = Record<ModalType, IModalData>;

export const initialModalState: IModalReducer = {
  resellerModal: { active: false, data: {} },
  successModal: { active: false, data: {} },
  loginModal: { active: false, data: {} },
  passwordReset: { active: false, data: {} },
  fraudInfoModal: { active: false, data: {} },
  imageUploadModal: { active: false, data: {} },
  logOutModal: { active: false, data: {} },
  designCoverModal: { active: false, data: {} },
  contentsCoverModal: { active: false, data: {} },
  designAvatarModal: { active: false, data: {} },
  addUserDeclarationModal: { active: false, data: {} },
  confirmationModal: { active: false, data: {} },
  createPlatformModal: { active: false, data: {} },
  authorizeModal: { active: false, data: {} },
  likesModal: { active: false, data: {} },
  blockUserModal: { active: false, data: {} },
  userProgramRoleModal: { active: false, data: {} },
  validatePointConversionModal: { active: false, data: {} },
  tcPdfModal: { active: false, data: {} },
  changeZoneModal: { active: false, data: {} }
};

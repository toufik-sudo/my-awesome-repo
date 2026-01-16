import { IModalReducer } from 'interfaces/store/IStore';

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

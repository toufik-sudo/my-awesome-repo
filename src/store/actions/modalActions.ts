// -----------------------------------------------------------------------------
// Modal Actions
// Migrated from old_app/src/store/actions/modalActions.ts
// -----------------------------------------------------------------------------

import { SET_MODAL_STATE } from './actionTypes';

export interface IModalData {
  active: boolean;
  data: Record<string, unknown>;
}

export type ModalType =
  | 'confirmationModal'
  | 'resellerModal'
  | 'successModal'
  | 'loginModal'
  | 'passwordReset'
  | 'fraudInfoModal'
  | 'imageUploadModal'
  | 'designCoverModal'
  | 'contentsCoverModal'
  | 'designAvatarModal'
  | 'logOutModal'
  | 'addUserDeclarationModal'
  | 'authorizeModal'
  | 'likesModal'
  | 'blockUserModal'
  | 'userProgramRoleModal'
  | 'createPlatformModal'
  | 'validatePointConversionModal'
  | 'tcPdfModal'
  | 'changeZoneModal';

export interface ISetModalStateAction {
  type: typeof SET_MODAL_STATE;
  payload: {
    modalType: ModalType;
    modalData: IModalData;
  };
  [key: string]: unknown;  // Index signature for Redux compatibility
}

/**
 * Set modal state
 */
export const setModalState = (
  modalType: ModalType,
  modalData: IModalData
): ISetModalStateAction => ({
  type: SET_MODAL_STATE,
  payload: { modalType, modalData }
});

/**
 * Open a modal
 */
export const openModal = (
  modalType: ModalType,
  data: Record<string, unknown> = {}
): ISetModalStateAction =>
  setModalState(modalType, { active: true, data });

/**
 * Close a modal
 */
export const closeModal = (modalType: ModalType): ISetModalStateAction =>
  setModalState(modalType, { active: false, data: {} });

/**
 * Legacy action format (for backwards compatibility with old reducer)
 */
export const setModalStateLegacy = (
  target: ModalType,
  state: boolean,
  data: Record<string, unknown> = {}
) => ({
  type: SET_MODAL_STATE,
  payload: { target, state, data }
});

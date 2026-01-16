import { CROSS_ORIGIN_ANONYMOUS } from 'constants/general';
import { AVATAR_EDITOR_CONFIG } from 'constants/personalInformation';

export const RESELLER_MODAL = 'resellerModal';
export const SUCCESS_MODAL = 'successModal';
export const TC_PDF_MODAL = 'tcPdfModal';
export const CHANGE_ZONE_MODAL = 'changeZoneModal';
export const CONTACT_MAIN_MODAL = 'contactMainModal';
export const FRAUD_INFO_MODAL = 'fraudInfoModal';
export const IMAGE_UPLOAD_MODAL = 'imageUploadModal';
export const DESIGN_AVATAR_MODAL = 'designAvatarModal';
export const DESIGN_COVER_MODAL = 'designCoverModal';
export const CONTENTS_COVER_MODAL = 'contentsCoverModal';
export const LOG_OUT_MODAL = 'logOutModal';
export const ADD_USER_DECLARATION_MODAL = 'addUserDeclarationModal';
export const VALIDATE_POINT_CONVERSION_MODAL = 'validatePointConversionModal';
export const CONFIRMATION_MODAL = 'confirmationModal';
export const CREATE_PLATFORM_MODAL = 'createPlatformModal';
export const BLOCK_USER_MODAL = 'blockUserModal';
export const LIKES_MODAL = 'likesModal';
export const USER_PROGRAM_ROLE_MODAL = 'userProgramRoleModal';
const {
  BORDER,
  ROUNDED_BORDER_RADIUS,
  SQUARE_WIDTH,
  COLOR_OPACITY,
  HEIGHT,
  LIGHT,
  FULL_BORDER_RADIUS,
  LARGE_WIDTH,
  HEIGHT_SMALL,
  XS_HEIGHT,
  XL_WIDTH,
  RECTANGLE_WIDTH,
  RECTANGLE_HEIGHT,
  COVER_WIDTH_SMALL,
  COVER_HEIGHT_SMALL,
  COVER_CROP_WIDTH_LARGE,
  COVER_CROP_HEIGHT_LARGE
} = AVATAR_EDITOR_CONFIG;
export const baseCropModalConfig: any = {
  width: SQUARE_WIDTH,
  height: HEIGHT,
  border: BORDER,
  color: [LIGHT, LIGHT, LIGHT, COLOR_OPACITY],
  crossOrigin: CROSS_ORIGIN_ANONYMOUS,
  borderRadius: ROUNDED_BORDER_RADIUS
};

export const coverCropModalConfig: any = {
  ...baseCropModalConfig,
  borderRadius: FULL_BORDER_RADIUS,
  width: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? LARGE_WIDTH : COVER_CROP_WIDTH_LARGE,
  height: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? HEIGHT : COVER_CROP_HEIGHT_LARGE
};

export const contentsCropModalConfig: any = {
  ...baseCropModalConfig,
  borderRadius: FULL_BORDER_RADIUS,
  width: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? COVER_WIDTH_SMALL : XL_WIDTH,
  height: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? COVER_HEIGHT_SMALL : XS_HEIGHT
};

export const designIdentificationModalConfig: any = {
  ...baseCropModalConfig,
  borderRadius: FULL_BORDER_RADIUS,
  width: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? SQUARE_WIDTH : RECTANGLE_WIDTH,
  height: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? HEIGHT_SMALL : RECTANGLE_HEIGHT
};

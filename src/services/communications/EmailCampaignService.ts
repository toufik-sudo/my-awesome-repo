import { EditorState } from 'draft-js';
import { IntlShape } from 'react-intl';

import { CLOUD_REWARDS_URL } from 'constants/general';
import { CAMPAIGN_STATUS_LIST } from 'constants/communications/campaign';
import { CAMPAIGN_FILE_TYPE } from 'constants/api';
import { IMAGE, WYSIWYG } from 'constants/files';
import { getHtmlFromEditorState, hasUserInput } from 'services/WysiwygService';
import { INPUT_LENGTH } from 'constants/validation';

/**
 * Translates a given object to have all fields equal to the code of their statuses
 * @param statusFilter
 * @param programId
 * @param rest
 */
export const mapCampaignRequestData = ({ statusFilter, programId, platformId, ...rest }) => {
  const status =
    (statusFilter.value !== CAMPAIGN_STATUS_LIST.ALL.value && CAMPAIGN_STATUS_LIST[statusFilter.value].code) ||
    undefined;

  return { status, platformId, programId, ...rest };
};

/**
 * Retrieves the mapped styling for given statuses
 * @param componentStyle
 */
export const getCampaignStylingRowElement = componentStyle => {
  return {
    [CAMPAIGN_STATUS_LIST.FAILED.value]: componentStyle.campaignFailed,
    [CAMPAIGN_STATUS_LIST.FINISHED.value]: componentStyle.campaignFinished,
    [CAMPAIGN_STATUS_LIST.SENDING.value]: componentStyle.campaignPending,
    [CAMPAIGN_STATUS_LIST.PENDING.value]: componentStyle.campaignProgress
  };
};

/**
 * Returns the options that need to be shown in status drop menu
 * @param intl
 */
export const getCampaignFilterOptions = (intl: IntlShape) => {
  return Object.keys(CAMPAIGN_STATUS_LIST).map(status => ({
    value: status,
    label: intl.formatMessage({ id: `communication.campaign.filter.status.${CAMPAIGN_STATUS_LIST[status].value}` })
  }));
};

/**
 * Maps valid images to the required format for uploading them
 *
 * @param images
 * @param type
 */
export const buildUploadableImages = (images, type = CAMPAIGN_FILE_TYPE.IMAGE) =>
  images
    .filter(image => !!image)
    .map(image => ({
      file: image,
      filename: image.name,
      type
    }));

/**
 * Maps given values to the format required by email template creation api
 *
 * @param programId
 * @param title
 * @param logoDescription
 * @param pictureDescription
 * @param images
 */
export const getCreateEmailTemplatePayload = (
  programId: number,
  title: string,
  logoDescription: EditorState,
  pictureDescription: EditorState,
  images: any
) => {
  let order = 0;
  const elements = [];
  const url = CLOUD_REWARDS_URL;
  elements[order++] = { type: IMAGE, value: images[0].id, order, url };
  elements[order++] = { type: WYSIWYG, value: getHtmlFromEditorState(logoDescription), order, url };

  if (images.length > 1) {
    elements[order++] = { type: IMAGE, value: images[1].id, order, url };
  }
  if (pictureDescription) {
    elements[order++] = { type: WYSIWYG, value: getHtmlFromEditorState(pictureDescription), order, url };
  }

  return { programId, name: title, elements };
};

/**
 * Validates the given fields for create of an email campaign
 *
 * @param title
 * @param logo
 * @param logoDescription
 * @param emailUserListId
 * @param programId
 * @param setErrors
 */
export function validateCreateEmailCampaign(
  title: string,
  logo: File,
  logoDescription: EditorState,
  emailUserListId: number,
  programId: number,
  setErrors
) {
  const currentErrors: any = {};
  if (!title.trim() || title.trim().length < INPUT_LENGTH.MIN) {
    currentErrors.title = 'form.validation.min';
  }
  if (title.length > INPUT_LENGTH.MAX) {
    currentErrors.title = 'form.validation.max';
  }
  currentErrors.logo = !logo;
  currentErrors.logoDescription = !hasUserInput(logoDescription);
  currentErrors.userList = !emailUserListId;

  if (Object.values(currentErrors).some(isError => isError) || !programId) {
    setErrors(currentErrors);
    return false;
  }
  return true;
}

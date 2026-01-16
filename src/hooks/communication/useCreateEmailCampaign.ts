import { useState } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import { EditorState } from 'draft-js';

import FilesApi from 'api/FilesApi';
import {
  buildUploadableImages,
  getCreateEmailTemplatePayload,
  validateCreateEmailCampaign
} from 'services/communications/EmailCampaignService';
import { WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE } from 'constants/routes';
import { getEditorStateFromHtml } from 'services/WysiwygService';
import CommunicationsApi from 'api/CommunicationsApi';
import { useWallSelection } from 'hooks/wall/useWallSelection';

const filesApi = new FilesApi();
const communicationsApi = new CommunicationsApi();

/**
 * Hook for Communication email campaign list page
 *
 */
const useCreateEmailCampaign = () => {
  const history = useHistory();
  const { formatMessage } = useIntl();

  const initialState = getEditorStateFromHtml('');

  const [title, setTitle] = useState('');
  const [logo, setLogo] = useState(null);
  const [logoDescription, setLogoDescription] = useState<EditorState>(initialState);
  const [picture, setPicture] = useState(null);
  const [pictureDescription, setPictureDescription] = useState<EditorState>(initialState);
  const [emailUserListId, setUserListId] = useState(null);
  const [errors, setErrors] = useState<any>({});
  const { selectedProgramId: programId } = useWallSelection();
  const [initialProgramId] = useState<any>(programId);

  const [isProcessing, setProcessing] = useState<boolean>(false);

  const onSubmit = async () => {
    if (
      isProcessing ||
      !validateCreateEmailCampaign(title, logo, logoDescription, emailUserListId, programId, setErrors)
    ) {
      return;
    }

    if (!programId || programId !== initialProgramId) {
      return toast(formatMessage({ id: 'toast.message.generic.error' }));
    }

    setProcessing(true);
    try {
      const { data: imageStatusList } = await filesApi.uploadFiles(buildUploadableImages([logo, picture]));

      const emailTemplatePayload = getCreateEmailTemplatePayload(
        programId,
        title,
        logoDescription,
        pictureDescription,
        imageStatusList
      );
      const { data } = await communicationsApi.createEmailTemplate(emailTemplatePayload);

      await communicationsApi.createEmailCampaign({
        programId,
        name: title,
        subject: title,
        emailUserListId,
        emailTemplateId: data.id
      });

      setProcessing(false);
      history.push(WALL_COMMUNICATION_EMAIL_CAMPAIGNS_ROUTE);
      toast(formatMessage({ id: 'toast.communications.campaign.create.success' }));
    } catch (e) {
      setProcessing(false);
      toast(formatMessage({ id: 'toast.message.generic.error' }));
    }
  };

  const setEmailUserListId = id => {
    if (isProcessing) {
      return;
    }
    setUserListId(id);
  };

  return {
    title,
    setTitle,
    logo,
    setLogo,
    logoDescription,
    setLogoDescription,
    picture,
    setPicture,
    pictureDescription,
    setPictureDescription,
    emailUserListId,
    errors,
    isProcessing,
    setEmailUserListId,
    onSubmit
  };
};

export default useCreateEmailCampaign;

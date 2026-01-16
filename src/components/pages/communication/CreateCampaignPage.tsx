import React from 'react';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import { useIntl } from 'react-intl';

import Recipients from 'components/organisms/communication/Recipients';
import Button from 'components/atoms/ui/Button';
import useLockProgramSelection from 'hooks/general/useLockProgramSelection';
import TextWysiwyg from 'components/molecules/communication/TextWysiwyg';
import Loading from 'components/atoms/ui/Loading';
import useCreateEmailCampaign from 'hooks/communication/useCreateEmailCampaign';
import CampaignImageUpload from 'components/molecules/communication/CampaignImageUpload';
import TextInput from 'components/atoms/ui/TextInput';
import { CAMPAIGN_CREATE_IMAGE_ID } from 'constants/communications/campaign';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import errorStyle from 'assets/style/common/Input.module.scss';

/**
 * Page component used to render create campaign page
 *
 * @constructor
 */
const CreateCampaignPage = () => {
  const { mt1, textCenter } = coreStyle;
  const {
    createCampaignUpload,
    createCampaignUploadCover,
    createCampaignTextarea,
    createCampaignTextareaCover,
    createCampaignContainer,
    createCampaignTitle,
    createCampaignInput
  } = componentStyle;

  const { formatMessage } = useIntl();

  useLockProgramSelection();

  const {
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
    setEmailUserListId,
    errors,
    isProcessing,
    onSubmit
  } = useCreateEmailCampaign();
  const { colorMainButtons } = useSelectedProgramDesign();

  return (
    <GeneralBlock>
      <div className={grid['row']}>
        <div className={`${grid['col-lg-6']} ${createCampaignContainer}`}>
          <DynamicFormattedMessage
            className={createCampaignTitle}
            tag={HTML_TAGS.H3}
            id="communication.campaign.create.label"
          />
          <TextInput
            inputClass={createCampaignInput}
            value={title}
            disabled={isProcessing}
            onChange={({ target }) => setTitle(target.value)}
            placeholder={formatMessage({ id: 'communication.campaign.create.name.placeholder' })}
            error={errors.title}
          />
          <CampaignImageUpload
            image={logo}
            imageId={CAMPAIGN_CREATE_IMAGE_ID.LOGO}
            disabled={isProcessing}
            onChange={e => setLogo(e.target.files[0])}
            onRemove={() => !isProcessing && setLogo(null)}
            error={errors.logo}
            errorId="communication.campaign.create.logo.error"
          />
          <TextWysiwyg
            className={`${createCampaignTextarea} ${createCampaignTextareaCover}`}
            editorState={logoDescription}
            disabled={isProcessing}
            onEditorStateChange={setLogoDescription}
            placeholder={formatMessage({ id: 'communication.campaign.create.logoDescription.placeholder' })}
            error={errors.logoDescription}
            errorId="communication.campaign.create.logoDescription.error"
          />
          <CampaignImageUpload
            image={picture}
            wrapperStyle={`${createCampaignUpload} ${createCampaignUploadCover}`}
            imageId={CAMPAIGN_CREATE_IMAGE_ID.PICTURE}
            disabled={isProcessing}
            onChange={e => setPicture(e.target.files[0])}
            onRemove={() => !isProcessing && setPicture(null)}
          />

          <TextWysiwyg
            className={`${createCampaignTextarea} ${createCampaignTextareaCover}`}
            editorState={pictureDescription}
            disabled={isProcessing}
            onEditorStateChange={setPictureDescription}
            placeholder={formatMessage({ id: 'communication.campaign.create.logoDescription.placeholder' })}
          />
        </div>
        <div className={`${grid['col-lg-6']} ${createCampaignContainer}`}>
          <DynamicFormattedMessage
            className={createCampaignTitle}
            tag={HTML_TAGS.H3}
            id="communication.campaign.create.userList.label"
          />
          <Recipients {...{ setEmailUserListId, emailUserListId, isProcessing }} />

          {errors.userList && (
            <DynamicFormattedMessage
              className={errorStyle.errorRelative}
              tag={HTML_TAGS.P}
              id="communication.campaign.create.userList.error"
            />
          )}
        </div>
      </div>

      <div className={`${textCenter} ${mt1}`}>
        <Button
          customStyle={{ color: colorMainButtons, borderColor: colorMainButtons }}
          variant={BUTTON_MAIN_VARIANT.INVERTED}
          onClick={onSubmit}
        >
          {(isProcessing && <Loading type={LOADER_TYPE.DROPZONE} />) ||
            formatMessage({ id: 'communication.campaign.create.continue' })}
        </Button>
      </div>
    </GeneralBlock>
  );
};

export default CreateCampaignPage;

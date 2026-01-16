import React from 'react';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import Button from 'components/atoms/ui/Button';
import TextInput from 'components/atoms/ui/TextInput';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import DynamicFormattedError from 'components/atoms/ui/DynamicFormattedError';
import useCreatePlatformModalData from 'hooks/modals/useCreatePlatformModalData';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { isSuperPlatform } from 'services/HyperProgramService';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { HTML_TAGS } from 'constants/general';
import { emptyFn } from 'utils/general';

import style from 'assets/style/components/Modals/LogoutModal.module.scss';

/**
 *  Organism component used to render super/sub platform create modal
 * @param onPlatformCreateDone
 * @constructor
 */
const CreatePlatformModal = ({ onPlatformCreateDone }) => {
  const { logOutModal, title } = style;
  const {
    active,
    closeModal,
    isLoading,
    hierarchicType,
    platform,
    setPlatformName,
    canSubmit,
    handlePlatformSubmit
  } = useCreatePlatformModalData(onPlatformCreateDone);

  return (
    <FlexibleModalContainer className={logOutModal} closeModal={closeModal} isModalOpen={active} fullOnMobile={false}>
      <div>
        <DynamicFormattedMessage
          tag={HTML_TAGS.H4}
          className={title}
          id={isSuperPlatform(hierarchicType) ? 'create.new.superplatform' : 'create.new.platform'}
        />
        <TextInput value={platform.name} onChange={e => setPlatformName(e.target.value)} />
        <DynamicFormattedError hasError={!!platform.error} id={platform.error} />
        <ButtonFormatted
          isLoading={isLoading}
          buttonText="label.button.validate"
          onClick={canSubmit ? handlePlatformSubmit : emptyFn}
          type={canSubmit ? BUTTON_MAIN_TYPE.PRIMARY : BUTTON_MAIN_TYPE.DISABLED}
        />
        <DynamicFormattedMessage
          tag={Button}
          type={BUTTON_MAIN_TYPE.DANGER}
          onClick={closeModal}
          id="form.delete.cancel"
        />
      </div>
    </FlexibleModalContainer>
  );
};

export default CreatePlatformModal;

import React from 'react';
import Button from 'components/atoms/ui/Button';

import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Organism component used in addition of update personal information form
 * @param setShowModal
 * @param showModal
 * @param onDelete
 * @constructor
 */
const DeleteAccountModal = ({ setShowModal, showModal, onDelete }) => {
  return (
    <FlexibleModalContainer closeModal={() => setShowModal(false)} isModalOpen={showModal}>
      <div>
        <DynamicFormattedMessage className={coreStyle.mb1} tag={HTML_TAGS.P} id={'form.delete.confirm'} />
        <DynamicFormattedMessage
          onClick={onDelete}
          type={BUTTON_MAIN_TYPE.DANGER}
          tag={Button}
          id={'form.delete.account'}
        />
        <div>
          <Button onClick={() => setShowModal(false)} className={coreStyle.my1}>
            <DynamicFormattedMessage tag={HTML_TAGS.P} id={'form.delete.cancel'} />
          </Button>
        </div>
      </div>
    </FlexibleModalContainer>
  );
};

export default DeleteAccountModal;

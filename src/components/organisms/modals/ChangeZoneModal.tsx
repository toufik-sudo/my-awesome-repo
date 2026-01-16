import React from 'react';
import { useSelector } from 'react-redux';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { HTML_TAGS, ZONE_EUROPE, ZONE_US } from 'constants/general';
import { changeZone } from 'hooks/general/changeZone';
import { IStore } from 'interfaces/store/IStore';
import { emptyFn } from 'utils/general';

import style from 'assets/style/components/Modals/LogoutModal.module.scss';

/**
 * Pending block user organism component that renders pending block user modal
 *
 * @constructor
 */
const ChangeZoneModal = () => {
  const changeZoneModalState = useSelector((state: IStore) => state.modalReducer.changeZoneModal);
  const { logOutModal, title } = style;

  const onZoneSelect = zone => {
    changeZone(zone, false);
  };

  return (
    <FlexibleModalContainer className={logOutModal} closeModal={emptyFn()} isModalOpen={changeZoneModalState.active}>
      <div>
        <DynamicFormattedMessage tag={HTML_TAGS.H4} className={title} id={`modal.changeZone`} />
        <DynamicFormattedMessage onClick={() => onZoneSelect(ZONE_EUROPE)} tag={Button} id="modal.changeZone.EU" />
        <DynamicFormattedMessage onClick={() => onZoneSelect(ZONE_US)} tag={Button} id="modal.changeZone.US" />
      </div>
    </FlexibleModalContainer>
  );
};

export default ChangeZoneModal;

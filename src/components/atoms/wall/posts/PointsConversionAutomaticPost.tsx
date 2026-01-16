import React from 'react';

import Button from 'components/atoms/ui/Button';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import { usePointsConversionApproval } from './UsePointsConversionApproval';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 *Component used for handling points conversion accept/decline by an admin
 *
 * @constructor
 */
export const PointsConversionAutomaticPost = ({ id, canSubmit }) => {
  const { pt2, ml2, mr2, displayFlex, flexAlignItemsCenter, flexJustifyContentCenter } = coreStyle;
  const {
    isLoading,
    isSelectingEntity,
    isAccepting,
    didSubmit,
    onEditPointsConversion,
    openConfirmModal,
    onCloseModal
  } = usePointsConversionApproval(id);

  if (!canSubmit || didSubmit) {
    return null;
  }

  return (
    <div className={`${pt2} ${displayFlex} ${flexAlignItemsCenter} ${flexJustifyContentCenter}`}>
      <DynamicFormattedMessage
        className={mr2}
        tag={Button}
        loading={isLoading && isAccepting}
        id="form.label.accept"
        onClick={() => openConfirmModal(true)}
      />
      <DynamicFormattedMessage
        tag={Button}
        loading={isLoading && !isAccepting}
        className={ml2}
        type={BUTTON_MAIN_TYPE.DANGER}
        id="form.label.decline"
        onClick={() => openConfirmModal(false)}
      />
      {isSelectingEntity && (
        <ConfirmationModal onAccept={onEditPointsConversion} onAcceptArgs="isAccepted" onClose={onCloseModal} />
      )}
    </div>
  );
};

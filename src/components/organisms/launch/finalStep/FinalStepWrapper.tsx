import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import FinalStepButtons from 'components/molecules/final/FinalStepButtons';
import TCDynamicModal from 'components/organisms/modals/TCDynamicModal';
import { HTML_TAGS } from 'constants/general';
import { TC_PDF_MODAL } from 'constants/modal';
import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';

import style from 'assets/style/components/wall/GeneralWallStructure.module.scss';
import labelsStyle from 'assets/style/common/Labels.module.scss';
import { FREEMIUM } from '../../../../constants/wall/launch';

/**
 * Template component used to Final Step wrapper
 *
 * @constructor
 */
const FinalStepWrapper = () => {
  const { textSection, content } = style;
  const { bold, underline } = labelsStyle;
  const dispatch = useDispatch();
  const launchStore = useSelector((store: IStore) => store.launchReducer);

  const openPdfModal = event => {
    event.preventDefault();
    dispatch(setModalState(true, TC_PDF_MODAL, { launchStore }));
    return;
  };

  return (
    <div className={content}>
      <DynamicFormattedMessage
        tag="p"
        id={launchStore.type === FREEMIUM ? 'launchProgram.finalStep.infoFreemium' : 'launchProgram.finalStep.info'}
      />
      <p className={textSection}>
        <DynamicFormattedMessage
          tag="span"
          id="launchProgram.finalStep.agree"
          values={{
            value: (
              <DynamicFormattedMessage
                onClick={event => openPdfModal(event)}
                tag={HTML_TAGS.ANCHOR}
                className={`${bold} ${underline}`}
                href="#"
                id="launchProgram.finalStep.here"
              />
            )
          }}
        />
      </p>
      <FinalStepButtons />
      <TCDynamicModal />
    </div>
  );
};

export default FinalStepWrapper;

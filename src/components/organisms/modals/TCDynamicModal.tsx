import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PDFViewer } from '@react-pdf/renderer';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from 'components/App';
import { ChallengeTC } from 'components/molecules/pdf/ChallengeTC';
import { LoyaltyTC } from 'components/molecules/pdf/LoyaltyTC';
import { SponsorshipTC } from 'components/molecules/pdf/SponsorshipTC';
import { TC_PDF_MODAL } from 'constants/modal';
import { CHALLENGE, FREEMIUM, LOYALTY, SPONSORSHIP } from 'constants/wall/launch';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { IStore } from 'interfaces/store/IStore';
import { setModalState } from 'store/actions/modalActions';

import basicStyle from 'assets/style/components/Modals/Modal.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import modalStyle from 'sass-boilerplate/stylesheets/components/modals/Modals.module.scss';
import { DynamicTCDocument } from '../../molecules/pdf/DynamicTCDocument';
import { StaticTCDocument } from '../../molecules/pdf/StaticTCDocument';

const TCDynamicModal = () => {
  const dispatch = useDispatch();
  const { data, active } = useSelector((state: IStore) => state.modalReducer.tcPdfModal);
  const [ready, setReady] = useState(false);
  const { userData } = useContext(UserContext);
  const { value: selectedLanguage } = useSelector((state: IStore) => state.languageReducer.selectedLanguage);

  useEffect(() => {
    setTimeout(() => {
      setReady(true);
    }, 1);
  });
  const closeModal = useCallback(() => dispatch(setModalState(false, TC_PDF_MODAL)), [dispatch]);

  let document;
  if (data && data.launchStore) {
    switch (data.launchStore.type) {
      case CHALLENGE:
        document = <ChallengeTC launchData={data.launchStore} userData={userData} />;
        break;
      case LOYALTY:
        document = <LoyaltyTC launchData={data.launchStore} userData={userData} />;
        break;
      case SPONSORSHIP:
        document = <SponsorshipTC launchData={data.launchStore} userData={userData} />;
        break;
      case FREEMIUM:
        document = <StaticTCDocument language={selectedLanguage} />;
        break;
      default:
        document = (
          <DynamicTCDocument launchData={data.launchStore} userData={userData} programType={data.launchStore.type} />
        );
    }
  }

  return (
    <FlexibleModalContainer
      isModalOpen={active}
      closeModal={closeModal}
      className={basicStyle.modalPdf}
      fullOnMobile={false}
      overlayClassName={modalStyle.modalOverlay}
    >
      <>
        <div className={`${coreStyle.textRight} ${coreStyle.mb3} ${coreStyle.widthFull}`}>
          <FontAwesomeIcon size={'lg'} icon={faTimes} onClick={closeModal} className={coreStyle.pointer} />
        </div>
        {ready && active && (
          <div style={{ maxHeight: '90vh', overflow: 'auto' }}>
            <PDFViewer width={900} height={900} style={{ maxHeight: '82vh', maxWidth: '100%' }}>
              {document}
            </PDFViewer>
          </div>
        )}
      </>
    </FlexibleModalContainer>
  );
};

export default TCDynamicModal;

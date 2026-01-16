import React, { useState } from 'react';
import { useHistory } from 'react-router';

import useDashboardBeneficiaryPoints from 'hooks/wall/dashboard/useDashboardBeneficiaryData';
import ProgramBeneficiaryPoints from 'components/atoms/wall/dashboard/ProgramBeneficiaryPoints';
import ProgramBeneficiaryNoPoints from 'components/atoms/wall/dashboard/ProgramBeneficiaryNoPoints';
import { GeneralErrorBlock } from 'components/molecules/wall/blocks/GeneralErrorBlock';
import { WALL_ROUTE } from 'constants/routes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { DEFAULT_ALL_PROGRAMS } from '../../../../../constants/wall/programButtons';
import { FREEMIUM, PROGRAM_TYPES } from '../../../../../constants/wall/launch';
import { useSelector } from 'react-redux';
import { IStore } from '../../../../../interfaces/store/IStore';
import FreemiumNotice from '../../../../molecules/wall/FreemiumNotice';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { useCheckAndRedirect } from 'hooks/user/useCheckAndRedirect';
import ConvertEcardsModal from 'components/pages/wall/ConvertEcardsModal';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import style from 'assets/style/components/BlockElement.module.scss';

/**
 * Molecule component used to render dashboard and manager points page
 * @constructor
 */
const ProgramPointsList = () => {
  const [showGiftCardModal, setShowGiftCardModal] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [canConvertPay, setCanConvertPay] = useState(false);
  
  const {
    platformProgramsPointsList,
    setSelectedProgramAndPlatform,
    isBeneficiary,
    selectedProgramId,
    scrollElement,
    onCashOutPoints,
    isFirstScroll,
    listReloadKey,
    id
  } = useDashboardBeneficiaryPoints();
  const history = useHistory();
  const { programs } = useSelector((store: IStore) => store.wallReducer);
  const { withBackgroundDefault, borderRadius1, displayFlex, px2, py3, w100, mw45, pb2, mMediumWidthFull } = coreStyle;
  const hasOnlyFreemiumPrograms = !programs.some(
    program => program.name !== DEFAULT_ALL_PROGRAMS && program.programType !== PROGRAM_TYPES[FREEMIUM]
  );

  const { onRewardsRedirect } = useCheckAndRedirect();
  const { customEcardModal } = eCardStyle;

  const onRewardsRedirectClick = (isClose, canConvert = null) => {
    setCanConvertPay(canConvert);
    setIsConverting(true);
    // if(canConvertPay && pointsPay >= 250){
    setTimeout(() => {
      setShowGiftCardModal(isClose);
      setIsConverting(false);
    }, 5000);
    if (!isClose) {
      onRewardsRedirect(true, false);
    }      
    // }    
  };

  if (!isBeneficiary) {
    history.push(WALL_ROUTE);
  }

  const filteredList =
    platformProgramsPointsList.length && platformProgramsPointsList.filter(platform => platform.platformId === id);

  if (!id) {
    return <GeneralErrorBlock />;
  }

  if (!filteredList.length) {
    return <ProgramBeneficiaryNoPoints />;
  }

  return (
    <div>
      <div
        className={`${withBackgroundDefault} ${displayFlex} ${coreStyle['flex-wrap']} ${coreStyle['flex-space-between']} ${borderRadius1} ${py3}`}
        id={'scroll-container'}
        key={listReloadKey}
      >
        {hasOnlyFreemiumPrograms && <FreemiumNotice />}
        {filteredList.map(item => (
          <div className={`${px2} ${pb2} ${mw45} ${w100} ${mMediumWidthFull}`} key={item.id}>
            <ProgramBeneficiaryPoints
              {...{
                item,
                setSelectedProgramAndPlatform,
                selectedProgramId,
                scrollElement,
                isFirstScroll,
                onCashOutPoints,
                onRewardsRedirectClick,
                isConverting,
                setIsConverting,
                setCanConvertPay
              }}
            />
          </div>
        ))}     
      </div>
      <FlexibleModalContainer
          fullOnMobile={false}
          className={`${style.mediaModal} ${customEcardModal}`}
          closeModal={() => onRewardsRedirectClick(false)}
          isModalOpen={showGiftCardModal}
        >
          <div className={`${coreStyle.widthFull}`}>
          <ConvertEcardsModal isConversionEcard={true} onRewardsRedirectClick={onRewardsRedirectClick} canConvert={canConvertPay}></ConvertEcardsModal>
          </div>
        </FlexibleModalContainer>
    </div>
  );
};

export default ProgramPointsList;

import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

import { UserContext } from 'components/App';
import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import PointsConversionCta from 'components/atoms/wall/dashboard/PointsConversionCta';
import { HTML_TAGS } from 'constants/general';
import { SETTINGS, WALL } from 'constants/routes';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { ACCOUNT } from 'constants/wall/settings';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'assets/style/components/BlockElement.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/PointsConversion.module.scss';
import { useCheckAndRedirect } from 'hooks/user/useCheckAndRedirect';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import ConvertEcardsModal from 'components/pages/wall/ConvertEcardsModal';
import { TIME_OF_ALLOCATION } from 'constants/wall/points';


/**
 * Atom component used to render dashboard program points details
 * @param item
 * @param setSelectedProgramAndPlatform
 * @param onCashOutPoints
 * @param selectedProgramId
 * @param scrollElement
 * @param isFirstScroll
 * @constructor
 */


const ProgramBeneficiaryPoints = ({
  item,
  setSelectedProgramAndPlatform,
  onCashOutPoints,
  selectedProgramId,
  scrollElement,
  isFirstScroll,
  onRewardsRedirectClick,
  isConverting ,
  setIsConverting,
}) => {

  const { colorSidebar, colorTitle } = useSelectedProgramDesign();

  const { points, name, converted, id, cube, canConvert } = item;
  const {
    textTiny,
    text3xl,
    mb4,
    withBoldFont,
    px2,
    textCenter,
    withGrayAccentColor,
    withDefaultColor,
    h100,
    pr05,
    lh1,
    opacity04,
    withBackgroundPrimary,
    withPrimaryColor,
    pointer,
    py3,
    mr05,
    widthFull,
    mt4,
    btnLg
  } = coreStyle;

  const { customEcardModal } = eCardStyle;
  const { colorMainButtonsBackground, colorMainButtonText } = useSelectedProgramDesign();
  
  const [spendingPoints, setSpendingPoints] = useState(points);
    

  useEffect(() => {
    // console.log("show:  ",showGiftCardModal, "  ID: ",selectedProgramId)
    if (isConverting && selectedProgramId !== id) {
      setSpendingPoints(points);
      setIsConverting(false);
    }
  }, [selectedProgramId]);

  // const { userData } = useContext(UserContext);
  // const history = useHistory();


  const onStartCashout = (isClose) => {
    // if (!userData.paypalLink) {
    //   history.push({
    //     pathname: `/${WALL}${SETTINGS}/${ACCOUNT}`,
    //     state: { fromSetCard: true, missingPaypalLink: true }
    //   });
    //   return;
    // }
    // setIsConverting(isConverting);
  };

  // const onValidate = async () => {
  //   setIsLoading(true);
  //   await onCashOutPoints(selectedProgramId, spendingPoints);
  //   setIsLoading(false);
  //   setIsConverting(false);
  // };

  // const onChangeSpendingPoints = forcedPoints => {
  //   if (forcedPoints >= 0 && forcedPoints <= points) {
  //     setSpendingPoints(forcedPoints);
  //   }
  // };

  if (selectedProgramId && isFirstScroll && selectedProgramId === item.id) {
    scrollElement(id);
  }

  return (
    <div
      className={`${h100} ${px2} ${py3} ${textCenter} ${pointer}   ${isConverting ? withBackgroundPrimary : ''} ${style.blockWithShadow
        } ${selectedProgramId && selectedProgramId !== item.id ? opacity04 : ''}`}
      onClick={() => setSelectedProgramAndPlatform({ selectedProgramId: id, selectedProgramName: name })}
      id={item.id}
      style={{ backgroundColor: `${isConverting ? colorSidebar : ''}` }}
    >
      <div>
        <div
          className={`${textTiny} ${mb4} ${isConverting ? withDefaultColor : withGrayAccentColor} ${withBoldFont} ${coreStyle['mx3']
            }`}
        >
          {item.name}
        </div>
        {isConverting && (
          <FontAwesomeIcon
            className={`${componentStyle.pointsConversionCloseCta} ${isConverting ? withDefaultColor : ''}`}
            icon={faTimesCircle}
            onClick={() => setIsConverting(false)}
          />
        )}
      </div>


      <div
        className={`${coreStyle['flex-wrap']} ${px2} ${coreStyle['flex-space-between']} ${coreStyle['flex-center-vertical']}`}
      >
        <div className={`${coreStyle['flex-space-end']} ${coreStyle['flex-wrap']} ${mr05}`}>
          <DynamicFormattedMessage
            className={`${withGrayAccentColor} ${pr05}`}
            tag={HTML_TAGS.SPAN}
            id="wall.beneficiary.points.amount"
          />
          <span
            className={` ${text3xl} ${withBoldFont} ${lh1}`}
            style={{ color: `${points > 0 ? colorTitle : ''}` }}
          >
            {(points && Math.floor(points)) || 0}
          </span>
        </div>

        <div className={`${coreStyle['flex-space-end']} ${coreStyle['flex-wrap']}`}>
          <DynamicFormattedMessage
            tag={HTML_TAGS.SPAN}
            className={`${withGrayAccentColor} ${pr05}`}
            id="wall.beneficiary.points.converted"
            values={{ converted }}
          />
          <span
            className={`${converted > 0 ? withPrimaryColor : withGrayAccentColor
              } ${text3xl} ${withBoldFont} ${lh1}`}
          >
            {(converted && Math.floor(converted)) || 0}
          </span>
        </div>
      </div>
      <PointsConversionCta {...{ cube, points, onStartCashout, canConvert, onRewardsRedirectClick, isConverting }} />
    </div>
  );
};

export default ProgramBeneficiaryPoints;

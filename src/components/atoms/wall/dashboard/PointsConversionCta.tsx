import React from 'react';

import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { TIME_OF_ALLOCATION, END_OF_PROGRAM, AGREEMENT_ADMIN, SPEND_TYPE } from 'constants/wall/points';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/PointsConversion.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';

/**
 * Cta used to trigger the conversion process pof points
 * @param cube
 * @param points
 * @param onStartCashout
 * @param canConvert
 * @constructor
 */
const PointsConversionCta = ({ cube, points, onStartCashout, canConvert, onRewardsRedirectClick, isConverting }) => {
  const { colorMainButtonsBackground, colorMainButtonText } = useSelectedProgramDesign();
  const { mt4, btnLg } = coreStyle;
  const spendType = SPEND_TYPE[cube && cube.spendType];
  if (!points) {
    return null;
  }

  if (spendType === TIME_OF_ALLOCATION || (spendType === END_OF_PROGRAM && canConvert) || spendType === AGREEMENT_ADMIN) {
    return (
      <>
        {isConverting && (
          <FontAwesomeIcon icon={faSpinner} spin />
        )}
        {!isConverting && (
          <DynamicFormattedMessage
            tag={Button}
            className={`${mt4} ${btnLg} ${componentStyle[TIME_OF_ALLOCATION]}`}
            id="wall.beneficiary.points.cashOut"
            onClick={() => onRewardsRedirectClick(true, canConvert)}
            disabled={isConverting}
            customStyle={{
              color: colorMainButtonText,
              background: colorMainButtonsBackground
            }}
          />
        )}
      </>
    );
  }
  if (spendType === END_OF_PROGRAM && !canConvert) {
    return (
      <>
        {isConverting && (
          <FontAwesomeIcon icon={faSpinner} spin />
        )}
        {!isConverting && (
          <DynamicFormattedMessage
            tag={Button}
            className={`${mt4} ${btnLg} ${componentStyle[spendType]}`}
            id="wall.beneficiary.points.atEndOfProgram"
            disabled={isConverting}
            customStyle={{
              color: colorMainButtonText,
              background: colorMainButtonsBackground
            }}
          />
        )}
      </>
    );
  }
  // if (spendType === AGREEMENT_ADMIN) {
  //   return (
  //     <>
  //       {isConverting && (
  //         <FontAwesomeIcon icon={faSpinner} spin />
  //       )}
  //       {!isConverting && (
  //         <DynamicFormattedMessage
  //           tag={Button}
  //           className={`${mt4} ${btnLg} ${componentStyle[spendType]}`}
  //           id="wall.beneficiary.points.askConversion"
  //           disabled={isConverting}
  //           onClick={() => onRewardsRedirectClick(true, canConvert)}
  //           customStyle={{
  //             color: colorMainButtonText,
  //             background: colorMainButtonsBackground
  //           }}
  //         />
  //       )
  //       }
  //     </>
  //   );
  // }

  return null;
};

export default PointsConversionCta;

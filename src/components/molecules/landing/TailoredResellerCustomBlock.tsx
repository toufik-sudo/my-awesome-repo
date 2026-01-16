import React from 'react';

import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import CTAFormBlock from 'components/molecules/landing/CTAFormBlock';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

/**
 * Molecule component used to render tailor reseller block
 *
 * @param type
 * @param onClick
 * @constructor
 */
const TailoredResellerCustomBlock = ({ type, onClick }) => {
  return (
    <CTAFormBlock blockType={type}>
      <ButtonFormatted onClick={onClick} buttonText={`form.cta.${type}.button`} type={BUTTON_MAIN_TYPE.SECONDARY} />
    </CTAFormBlock>
  );
};

export default TailoredResellerCustomBlock;

import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { usePricingSectionControls } from 'hooks/landing/usePricingSectionControls';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import linkStyle from 'assets/style/common/Labels.module.scss';

const ChooseUsAgencies = () => {
  const { withPrimaryColor } = coreStyle;
  const { openResellerModal } = usePricingSectionControls();

  return (
    <DynamicFormattedMessage
      tag={'span'}
      onClick={openResellerModal}
      className={`${withPrimaryColor} ${linkStyle.link}`}
      id={`whyChooseUs.agencies.link`}
    />
  );
};

export default ChooseUsAgencies;

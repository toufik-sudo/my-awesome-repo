import React, { useState } from 'react';

import WebFormComponent from 'components/atoms/landing/WebFormComponent';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { WEBFORM_WHY_CHOOSE_US } from 'constants/general';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import linkStyle from 'assets/style/common/Labels.module.scss';

const ChooseUsEveryone = () => {
  const { pt3, pb3, withPrimaryColor } = coreStyle;
  const [openModal, setModalOpen] = useState(false);

  return (
    <>
      <DynamicFormattedMessage
        tag={'span'}
        onClick={() => setModalOpen(true)}
        className={`${withPrimaryColor} ${linkStyle.link}`}
        id={`whyChooseUs.everyone.link`}
      />
      <FlexibleModalContainer
        className={`${pt3} ${pb3}`}
        fullOnMobile={false}
        closeModal={() => setModalOpen(false)}
        isModalOpen={openModal}
      >
        <WebFormComponent url={WEBFORM_WHY_CHOOSE_US} />
      </FlexibleModalContainer>
    </>
  );
};

export default ChooseUsEveryone;

import React, { useContext, useState } from 'react';
import { PricingContext } from 'components/organisms/landing/PricingPlans';
import { PRICING_BLOCK_TYPES, SUBSCRIBE } from 'constants/landing';
import {
  ACCESS,
  BEST_SELLER,
  // CREATE_ACCOUNT,
  FREEMIUM,
  INTERNATIONAL,
  LAUNCH,
  PREMIUM
  // WELCOME_FREEMIUM_LAUNCH_ROUTE
} from 'constants/routes';
import { toCamelCase } from 'utils/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import WebFormComponent from 'components/atoms/landing/WebFormComponent';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { WEBFORM_EN, WEBFORM_FR } from 'constants/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Atom component that renders cta button from pricing data slider section
 *
 * @param content
 * @constructor
 *
 * @see PlanLinkButtonStory
 */
const PlanLinkButton = ({ content }) => {
  const { name } = content;
  const { pt3, pb3 } = coreStyle;
  const camelCaseContent = toCamelCase(name);
  const type = useContext(PricingContext);
  // let planUrl = `${CREATE_ACCOUNT}/${camelCaseContent}/${id}`; get id from content
  const [openModal, setModalOpen] = useState(false);
  const { value } = useSelector((state: IStore) => state.languageReducer.selectedLanguage);
  const isFrSelected = value === 'fr';
  let webFormUrl = '';

  switch (name) {
    case FREEMIUM:
      webFormUrl = isFrSelected ? WEBFORM_FR.FREEMIUM : WEBFORM_EN.FREEMIUM;
      break;
    case ACCESS:
      webFormUrl = isFrSelected ? WEBFORM_FR.ACCESS : WEBFORM_EN.ACCESS;
      break;
    case BEST_SELLER:
      webFormUrl = isFrSelected ? WEBFORM_FR.ACCESS : WEBFORM_EN.ACCESS;
      break;
    case PREMIUM:
      webFormUrl = isFrSelected ? WEBFORM_FR.PREMIUM : WEBFORM_EN.PREMIUM;
      break;
    case INTERNATIONAL:
      webFormUrl = isFrSelected ? WEBFORM_FR.INTERNATIONAL : WEBFORM_EN.INTERNATIONAL;
      break;
    default:
      break;
  }
  //
  // if (name === FREEMIUM) {
  //   planUrl = `${WELCOME_FREEMIUM_LAUNCH_ROUTE}${id}`;
  // }

  if (type === PRICING_BLOCK_TYPES.SUBSCRIPTION) return null;

  return (
    <>
      <DynamicFormattedMessage
        tag={'span'}
        onClick={() => setModalOpen(true)}
        id={`label.${camelCaseContent === FREEMIUM ? LAUNCH : SUBSCRIBE}`}
      />
      <FlexibleModalContainer
        className={`${pt3} ${pb3}`}
        fullOnMobile={false}
        closeModal={() => setModalOpen(false)}
        isModalOpen={openModal}
      >
        <WebFormComponent url={webFormUrl} />
      </FlexibleModalContainer>
    </>
  );
};

export default PlanLinkButton;

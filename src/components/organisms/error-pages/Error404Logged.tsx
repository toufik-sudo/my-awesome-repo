import React from 'react';
import { useHistory } from 'react-router';

import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import notFoundImage from 'assets/images/404Image.svg';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { WALL } from 'constants/routes';
import { BUTTON_MAIN_TYPE } from 'constants/ui';

import componentStyle from 'assets/style/components/PageNotFound.module.scss';
import { IMAGES_ALT } from '../../../constants/general';

/**
 * Organism component that renders 404 page for logged in users
 *
 * @constructor
 */
const Error404Logged = () => {
  const history = useHistory();

  const {
    pageNotFoundContent,
    pageNotFoundMessage,
    pageNotFoundCode,
    pageNotFoundLogged,
    pageNotFoundInner,
    pageNotFoundImage
  } = componentStyle;
  return (
    <div className={pageNotFoundLogged}>
      <div className={pageNotFoundInner}>
        <div className={pageNotFoundContent}>
          <DynamicFormattedMessage tag="p" className={pageNotFoundCode} id="page.not.found.error" />
          <DynamicFormattedMessage tag="p" className={pageNotFoundMessage} id="page.not.found.error.message" />
        </div>
        <img src={notFoundImage} className={pageNotFoundImage} alt={IMAGES_ALT.NOT_FOUND_IMAGE} />
        <ButtonFormatted
          onClick={() => history.push(WALL)}
          type={BUTTON_MAIN_TYPE.PRIMARY}
          variant="inverted"
          buttonText="page.not.found.logged.cta"
        />
      </div>
    </div>
  );
};

export default Error404Logged;

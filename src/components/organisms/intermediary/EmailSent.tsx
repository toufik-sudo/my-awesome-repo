import React from 'react';
import { faMailBulk } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useResendActivationLink } from 'hooks/useResendActivationLink';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { EMAIL_SENT } from 'constants/routes';
import { RESEND_ACTIVATION_LINK_SUCCESS } from 'constants/forms';

import style from 'assets/style/components/WelcomePage.module.scss';

/**
 * Organism component used to display email sent content
 *
 * @param type
 * @constructor
 */
const EmailSent = ({ type }) => {
  const { message, resendEmail } = useResendActivationLink();

  return (
    <>
      <FontAwesomeIcon icon={faMailBulk} className={style.mainIcon} />
      <div>
        <DynamicFormattedMessage tag="div" id={`welcome.page.${type}.title`} />
        <DynamicFormattedMessage tag="p" id={`welcome.page.${type}.subtitle`} />
        {type == EMAIL_SENT ? (
          <p>
            <DynamicFormattedMessage tag="span" id={`welcome.page.resend.link.${message}`} />
            {message != RESEND_ACTIVATION_LINK_SUCCESS && (
              <DynamicFormattedMessage
                className={style.activeCursor}
                tag="span"
                id={`welcome.page.resend.link.again`}
                onClick={resendEmail}
              />
            )}
          </p>
        ) : (
          <DynamicFormattedMessage tag="p" id={`welcome.page.resend.link.${message}`} />
        )}
      </div>
    </>
  );
};

export default EmailSent;

import React from 'react';
import { useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';

import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_VARIANT } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { getUserDeclarationStatusSettings, getDMYDateFormat } from 'services/UserDeclarationServices';
import { USER_DECLARATIONS_ROUTE } from 'constants/routes';

import style from 'sass-boilerplate/stylesheets/components/wall/UsersDeclaration.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import useProgramDetails from 'hooks/programs/useProgramDetails';
import { PROGRAM_TYPES, SPONSORSHIP } from 'constants/wall/launch';

/**
 * Molecule component used to render table row for a user declaration
 * @param declaration
 * @constructor
 */
const BeneficiaryUserDeclarationRow = ({
  index,
  program,
  quantity,
  dateOfEvent,
  product,
  otherProductName,
  status,
  amount,
  id,
  selectedProgramType
}) => {
  const history = useHistory();
  const { statusStyle, statusDescriptionId } = getUserDeclarationStatusSettings(status, style);
  const { colorTitle } = useSelectedProgramDesign();
  const { ml1, withBoldFont } = coreStyle;

  
  const isSponsorship = selectedProgramType === PROGRAM_TYPES[SPONSORSHIP]
  // Determine the correct headers based on program details
 
  const { userDeclarationRowElement, userDeclarationRow } = style;
  return (
    <div className={`${userDeclarationRow} ${statusStyle}`}>
      <p className={style.userDeclarationRowElementIndex}>{index + 1}</p>
      <p className={userDeclarationRowElement}>{program.name}</p>
      <div className={userDeclarationRowElement}>
        <DynamicFormattedMessage id={`program.type.${program.type}`} tag={HTML_TAGS.P} />
        <FontAwesomeIcon className={ml1} icon={program.open ? faLockOpen : faLock} />
      </div>
      <p className={userDeclarationRowElement}>{getDMYDateFormat(dateOfEvent)}</p>
      <p className={userDeclarationRowElement}>{(product && product.name) || otherProductName}</p>
      {!isSponsorship && <p className={style.userDeclarationRowElement}>{quantity}</p>}
      {!isSponsorship && <p className={style.userDeclarationRowElement}>{amount || 0}€</p>}
      <p>
        <DynamicFormattedMessage
          tag={Button}
          variant={BUTTON_MAIN_VARIANT.INVERTED}
          id="label.button.open"
          onClick={() => history.push(`${USER_DECLARATIONS_ROUTE}/${id}`)}
          customStyle={{
            color: colorTitle,
            borderColor: colorTitle
          }}
        />
      </p>
      <DynamicFormattedMessage
        id={statusDescriptionId}
        tag={HTML_TAGS.P}
        className={`${userDeclarationRowElement} ${statusStyle} ${withBoldFont}`}
        style={{
          color: colorTitle
        }}
      />
    </div>
  );
};

export default BeneficiaryUserDeclarationRow;

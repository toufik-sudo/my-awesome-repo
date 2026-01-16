import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons';

import ProgramOpenControl from 'components/molecules/programs/ProgramOpenControl';
import ProgramInvitationControls from 'components/molecules/programs/ProgramInvitationControls';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { isProgramInvitationPending, isProgramJoinPending } from 'services/UsersServices';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Programs.module.scss';
/**
 * Molecule component that renders program block
 * @param program
 * @param userRole
 * @param confirmInvitationRefusal
 * @param processingInvitation
 * @constructor
 */
const ProgramBlock = ({ program, userRole, confirmInvitationRefusal, processingInvitation = false, selectedPlatform = null }) => {
  const {
    cardTitleSmall,
    withSecondaryColor,
    withPrimaryColor,
    flex,
    textCenter,
    mb2,
    mb3,
    mt0,
    mb0,
    mt4,
    py5,
    mr1,
    withFontSmall,
    text3xl,
    dSmallTextLg,
    lh1,
    marquee,
    marqueeInner,
    height100
  } = coreStyle;

  const { name, programType, isOpen } = program;
  const { companyId, companyName } = selectedPlatform;
  const { isBeneficiary } = userRole;
  const isInvitationPending = isBeneficiary && isProgramInvitationPending(program);
  const isAdminAcceptPending = isBeneficiary && isProgramJoinPending(program);
  const hasName = name && name.length > 20;

  return (
    // <div className={`${grid['col-md-6']} ${grid['col-lg-4']} ${mb3}`}>
    <GeneralBlock
      className={`${textCenter} ${height100} ${mt0} ${mb0} ${py5} ${flex} ${coreStyle['flex-direction-column']}`}
    >
      <div
        className={`${coreStyle['flex-center-vertical']} ${componentStyle.programBlockItem} ${coreStyle['flex-direction-column']}`}
      >
        <h4 className={`${cardTitleSmall} ${withPrimaryColor} ${mt0} ${mb2} ${coreStyle['flex-center-vertical']}`}>
          {!isBeneficiary && (
            <FontAwesomeIcon className={`${withFontSmall} ${mr1}`} icon={isOpen ? faLockOpen : faLock} />
          )}
          <DynamicFormattedMessage id={`program.type.${programType}`} tag={HTML_TAGS.SPAN} />
        </h4>
        {isInvitationPending && (<DynamicFormattedMessage id={`program.tojoin`} tag={HTML_TAGS.SPAN} values={{ companyName: companyName }} />)}
        <p
          className={`${text3xl} ${dSmallTextLg} ${lh1} ${mt4} ${withSecondaryColor} ${mb2} ${name.length > 20 ? marquee : ''
            }`}
        >
          <span className={hasName ? marqueeInner : ''}>{name}</span>
        </p>
        {!isInvitationPending && <ProgramOpenControl {...{ program, userRole, className: grid['mt-auto'] }} />}
        {isInvitationPending && (
          <ProgramInvitationControls
            {...{
              program,
              confirmRefusal: confirmInvitationRefusal,
              processingInvitation,
              className: `${grid['mt-auto']} ${coreStyle['flex-direction-column']}`
            }}
          />
        )}
        {isAdminAcceptPending && (
          <DynamicFormattedMessage
            className={`${grid['mt-auto']} ${componentStyle.pendingCTA}`}
            tag={Button}
            id="programs.status.admin.pending"
          />
        )}
      </div>
    </GeneralBlock>
    // </div>
  );
};

export default ProgramBlock;

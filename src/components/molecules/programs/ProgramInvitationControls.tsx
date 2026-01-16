import React from 'react';
import { Link } from 'react-router-dom';

import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { WALL_PROGRAM_JOIN_ROUTE } from 'constants/routes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Component that renders program invitation accept/refuse CTAs
 * @param program
 * @param confirmRefusal,
 * @param processingInvitation,
 * @param className
 * @constructor
 */
const ProgramInvitationControls = ({
  program: { id, platformId },
  confirmRefusal,
  processingInvitation,
  className = ''
}) => {
  const { mb1, w100 } = coreStyle;

  if (processingInvitation) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  return (
    <div className={className}>
      <Link
        to={{
          pathname: WALL_PROGRAM_JOIN_ROUTE,
          state: {
            programId: id,
            platformId
          }
        }}
      >
        <ButtonFormatted
          type={BUTTON_MAIN_TYPE.PRIMARY}
          className={`${mb1} ${w100}`}
          buttonText="program.block.invitation.accept.cta"
        />
      </Link>
      <ButtonFormatted
        type={BUTTON_MAIN_TYPE.DANGER}
        buttonText="program.block.invitation.decline.cta"
        onClick={() => confirmRefusal({ programId: id, platformId })}
      />
    </div>
  );
};

export default ProgramInvitationControls;

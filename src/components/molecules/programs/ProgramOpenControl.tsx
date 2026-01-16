import React from 'react';

import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import useProgramDetailsRedirect from 'hooks/programs/useProgramDetailsRedirect';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { isNotActiveOnProgram } from 'services/UsersServices';

/**
 * Component that renders program open CTA
 * @param program
 * @param userRole
 * @param className
 * @constructor
 */
const ProgramOpenControl = ({ program, userRole, className = '' }) => {
  const { onOpen } = useProgramDetailsRedirect(program);

  // if (userRole.isBeneficiary && isNotActiveOnProgram(program)) {
  //   return null;
  // }

  return (
    <div>
      {!isNotActiveOnProgram(program) && <ButtonFormatted
        type={BUTTON_MAIN_TYPE.SECONDARY}
        className={`${className}`}
        buttonText="program.block.cta"
        onClick={onOpen}
      />}

      {isNotActiveOnProgram(program) && <ButtonFormatted
        type={BUTTON_MAIN_TYPE.DISABLED}
        className={`${className}`}
        disabled={true}
        buttonText="program.block.blocked"
        onClick={onOpen}
      />}

    </div>
  );
};

export default ProgramOpenControl;

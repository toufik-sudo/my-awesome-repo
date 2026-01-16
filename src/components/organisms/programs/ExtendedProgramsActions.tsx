import React from 'react';

import ProgramCreate from 'components/molecules/programs/ProgramCreate';
import { isUserAdmin, isAtLeastSuperAdmin } from 'services/security/accessServices';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';

import programStyle from 'sass-boilerplate/stylesheets/components/wall/Programs.module.scss';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';

/**
 * Organism component used to render extended programs actions
 * @implNotes renders 3 buttons (Hyper, Super and program) creation CTA - disabled based on availability
 *
 * @param userRole
 * @param nestedSuperPlatforms
 * @param individualPlatforms
 * @param setEnableOnly
 * @constructor
 */
const ExtendedProgramsActions = ({ userRole, nestedSuperPlatforms, individualPlatforms, setEnableOnly }) => {
  const isMinimumSuperAdmin = isAtLeastSuperAdmin(userRole);
  const disabledCreatePlatform = !nestedSuperPlatforms.length;

  const disabledCreateProgram =
    (!isMinimumSuperAdmin || !nestedSuperPlatforms.some(({ subPlatforms = [] }) => !!subPlatforms.length)) &&
    !individualPlatforms.some(({ role }) => isUserAdmin(role));

  return (
    <div
      className={programStyle.hyperColumnLeft}
      onClick={e => {
        e.target === e.currentTarget && setEnableOnly(null);
      }}
    >
      {userRole.isHyperAdmin && (
        <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
          <ProgramCreate
            disabled={!userRole.isHyperAdmin}
            onClick={() => setEnableOnly([PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM])}
            id="create.new.superplatform"
            background={programStyle.superPlatformBg}
          />
        </SpringAnimation>
      )}
      {isMinimumSuperAdmin && (
        <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
          <ProgramCreate
            disabled={disabledCreatePlatform}
            onClick={() =>
              setEnableOnly([PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM], userRole.isSuperAdmin && nestedSuperPlatforms[0])
            }
            id="create.new.platform"
            background={programStyle.programBg}
          />
        </SpringAnimation>
      )}
      {!userRole.isBeneficiary && (
        <SpringAnimation settings={setTranslate(DELAY_TYPES.MIN)}>
          <ProgramCreate
            key={`program_create_${userRole.isAdmin}`}
            disabled={disabledCreateProgram}
            onClick={() => setEnableOnly([PLATFORM_HIERARCHIC_TYPE.SUB_PLATFORM, PLATFORM_HIERARCHIC_TYPE.INDEPENDENT])}
            id="create.new.program"
            background={programStyle.platformBg}
          />
        </SpringAnimation>
      )}
    </div>
  );
};

export default ExtendedProgramsActions;

import React from 'react';
import { useHistory } from 'react-router';

import ProgramBlockSelect from 'components/molecules/programs/ProgramBlockSelect';
import ProgramsList from 'components/molecules/programs/ProgramsList';
import ProgramCreate from 'components/molecules/programs/ProgramCreate';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import useProgramsList from 'hooks/programs/useProgramsList';
import useDeclineProgramInvitation from 'hooks/programs/useDeclineProgramInvitation';
import PlatformSlider from 'components/molecules/wall/globalSlider/PlatformSlider';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { emptyFn } from 'utils/general';
import { LAUNCH_FIRST } from 'constants/routes';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import programSlider from 'sass-boilerplate/stylesheets/components/wall/ProgramsSlider.module.scss';
import programStyle from 'sass-boilerplate/stylesheets/components/wall/Programs.module.scss';
import { useSelector } from 'react-redux';
import { IStore } from '../../../interfaces/store/IStore';
import { FREEMIUM, PROGRAM_TYPES } from '../../../constants/wall/launch';
import { SSL_OP_NO_TLSv1_1 } from 'constants'

/**
 * Handles the rendering of program blocks in order to design the components easier
 *
 * @constructor
 */
const ProgramsPage = () => {
  const history = useHistory();
  const {
    programs,
    onFilter,
    userRole,
    platforms,
    onChangePlatform,
    selectedPlatform,
    triggerReloadPrograms,
    isLoading
  } = useProgramsList();
  const {
    data: { program }
  } = useSelector((store: IStore) => store.modalReducer.confirmationModal);
  const { confirmRefusal, declineInvitation, processingInvitations } = useDeclineProgramInvitation(
    triggerReloadPrograms
  );
  let modalQuestion = 'program.invitation.decline.confirm';

  if (
    program &&
    program.programId &&
    programs.find(({ id }) => id === program.programId).programType === PROGRAM_TYPES[FREEMIUM]
  ) {
    modalQuestion = 'program.invitation.decline.confirm.freemium';
  }

  const hasntJoinedAnyPrograms = userRole.isBeneficiary && !isLoading && !programs.length;
  const hasntJoinedAnyProgramsAdmin = (userRole.isAdmin || userRole.isManager || userRole.isSuperAdmin || userRole.isSuperManager) && !isLoading && !programs.length;

  const { withDefaultColor, pl45, mLargePTop8, mLargePl15 } = coreStyle;

  return (
    <div
      className={`${grid['container-fluid']} ${mLargePl15} ${pl45} ${mLargePTop8} ${programStyle.programsPageContainer}`}
    >
      <div className={grid['row']}>
        <div
          className={`${grid['col-md-4']} ${grid['col-lg-3']}`}
          key={`${selectedPlatform.id}${selectedPlatform.name} ${selectedPlatform.index}`}
        >
          {/* {platforms.length > 1 && (
            <PlatformSlider
              globalClass={`
                  ${withDefaultColor}
                  ${programSlider.programSliderWrapperArrowsWhite}
                  `}
              platforms={platforms}
              onChange={onChangePlatform}
              selectedPlatform={selectedPlatform}
            />
          )} */}
          <ProgramBlockSelect onFilter={onFilter} />
        </div>
      </div>
      <div className={grid['row']}>
        <div className={`${grid['col-md-4']} ${grid['col-lg-3']}`}>
          {!userRole.isBeneficiary && (
            <ProgramCreate
              disabled={!userRole.isAdmin}
              key={selectedPlatform.role}
              onClick={() => history.push(LAUNCH_FIRST)}
              id="create.new.program"
              background={programStyle.programBg}
            />
          )}
        </div>
        <div className={`${grid['col-md-8']} ${grid['col-lg-9']}`}>
          {hasntJoinedAnyPrograms && <div style={{ maxWidth: '70rem', lineHeight: '2.5', whiteSpace: 'pre-line', textAlign: 'center' }}> <DynamicFormattedMessage id="programs.noneJoined" tag={HTML_TAGS.P} /></div>}
          {hasntJoinedAnyProgramsAdmin && <div style={{ maxWidth: '70rem', lineHeight: '2.5', whiteSpace: 'pre-line', textAlign: 'center' }}> <DynamicFormattedMessage id="programs.noneJoined.admin" tag={HTML_TAGS.P} /></div>}

          {!hasntJoinedAnyPrograms && !hasntJoinedAnyProgramsAdmin && (
            <ProgramsList
              {...{
                platforms,
                programs,
                isLoading,
                hasMore: false,
                handleLoadMore: emptyFn,
                userRole,
                confirmInvitationRefusal: confirmRefusal,
                processingInvitations,
                selectedPlatform,
                onChangePlatform
              }}
            />
          )}

        </div>
      </div>
      <ConfirmationModal
        question={modalQuestion}
        onAccept={declineInvitation}
        onAcceptArgs="program"
        confirmLabel="program.invitation.decline.confirm.cta.yes"
        confirmButtonType={BUTTON_MAIN_TYPE.DANGER}
        denyLabel="program.invitation.decline.confirm.cta.no"
        denyButtonType={BUTTON_MAIN_TYPE.PRIMARY}
      />
    </div>
  );
};

export default ProgramsPage;

import React from 'react';
import { useHistory } from 'react-router';

import ProgramsList from 'components/molecules/programs/ProgramsList';
import ProgramCreate from 'components/molecules/programs/ProgramCreate';
import ProgramsFilters from 'components/molecules/programs/ProgramsFilters';
import ConfirmationModal from 'components/organisms/modals/ConfirmationModal';
import useProgramsList from 'hooks/programs/useProgramsList';
import useDeclineProgramInvitation from 'hooks/programs/useDeclineProgramInvitation';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { emptyFn } from 'utils/general';
import { LAUNCH_FIRST } from 'constants/routes';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import programStyle from 'sass-boilerplate/stylesheets/components/wall/Programs.module.scss';
import { useSelector } from 'react-redux';
import { IStore } from '../../../interfaces/store/IStore';
import { FREEMIUM, PROGRAM_TYPES } from '../../../constants/wall/launch';

/**
 * Handles the rendering of program blocks in order to design the components easier
 *
 * @constructor
 */
const ProgramsPage = () => {
  const history = useHistory();
  const {
    programs,
    userRole,
    platforms,
    onChangePlatform,
    selectedPlatform,
    triggerReloadPrograms,
    isLoading,
    // Hierarchical filter data
    superPlatforms,
    filteredPlatforms,
    availablePrograms,
    selectedSuperPlatformFilter,
    selectedPlatformFilter,
    selectedProgramFilter,
    selectedProgramType,
    handleSuperPlatformChange,
    handlePlatformFilterChange,
    handleProgramFilterChange,
    handleProgramTypeChange
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
    programs.find(({ id }) => id === program.programId)?.programType === PROGRAM_TYPES[FREEMIUM]
  ) {
    modalQuestion = 'program.invitation.decline.confirm.freemium';
  }

  const hasntJoinedAnyPrograms = userRole.isBeneficiary && !isLoading && !programs.length;
  const hasntJoinedAnyProgramsAdmin = (userRole.isAdmin || userRole.isManager || userRole.isSuperAdmin || userRole.isSuperManager) && !isLoading && !programs.length;

  // Show super platform filter only for hyper admin or hyper manager
  const showSuperPlatformFilter = userRole.isHyperAdmin || userRole.isHyperManager;

  const { pl45, mLargePTop8, mLargePl15 } = coreStyle;

  const pageContainerStyle: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    minHeight: '100vh',
    paddingTop: '1.5rem',
    paddingBottom: '2rem'
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '1.25rem'
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#1e293b',
    marginBottom: '0.25rem',
    letterSpacing: '-0.01em'
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: '#64748b',
    fontWeight: 400
  };

  const contentContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'flex-start'
  };

  const sidebarStyle: React.CSSProperties = {
    flex: '0 0 auto',
    width: '220px'
  };

  const mainContentStyle: React.CSSProperties = {
    flex: '1 1 auto',
    minWidth: 0
  };

  const emptyStateStyle: React.CSSProperties = {
    maxWidth: '100%',
    lineHeight: '1.8',
    whiteSpace: 'pre-line',
    textAlign: 'center',
    padding: '3rem 2rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #f1f5f9',
    color: '#64748b',
    fontSize: '0.95rem'
  };

  return (
    <div
      className={`${grid['container-fluid']} ${mLargePl15} ${pl45} ${mLargePTop8} ${programStyle.programsPageContainer}`}
      style={pageContainerStyle}
    >
      {/* Page Header */}
      <div className={grid['row']} style={headerStyle}>
        <div className={grid['col-12']}>
          <h1 style={titleStyle}>
            <DynamicFormattedMessage id="programs.page.title" tag={HTML_TAGS.SPAN} />
          </h1>
          <p style={subtitleStyle}>
            <DynamicFormattedMessage id="programs.page.subtitle" tag={HTML_TAGS.SPAN} />
          </p>
        </div>
      </div>

      {/* Unified Filters Row */}
      <div className={grid['row']}>
        <div className={grid['col-12']}>
          <ProgramsFilters
            superPlatforms={superPlatforms}
            platforms={filteredPlatforms}
            programs={availablePrograms}
            selectedSuperPlatform={selectedSuperPlatformFilter}
            selectedPlatform={selectedPlatformFilter}
            selectedProgram={selectedProgramFilter}
            selectedProgramType={selectedProgramType}
            onSuperPlatformChange={handleSuperPlatformChange}
            onPlatformChange={handlePlatformFilterChange}
            onProgramChange={handleProgramFilterChange}
            onProgramTypeChange={handleProgramTypeChange}
            showSuperPlatformFilter={showSuperPlatformFilter}
          />
        </div>
      </div>

      {/* Content Row */}
      <div className={grid['row']}>
        <div className={grid['col-12']}>
          <div style={contentContainerStyle}>
            {/* Sidebar with Create Button */}
            {!userRole.isBeneficiary && (
              <div style={sidebarStyle}>
                <ProgramCreate
                  disabled={!userRole.isAdmin}
                  key={selectedPlatform.role}
                  onClick={() => history.push(LAUNCH_FIRST)}
                  id="create.new.program"
                  background={programStyle.programBg}
                />
              </div>
            )}
            
            {/* Main Content */}
            <div style={mainContentStyle}>
              {hasntJoinedAnyPrograms && (
                <div style={emptyStateStyle}>
                  <DynamicFormattedMessage id="programs.noneJoined" tag={HTML_TAGS.P} />
                </div>
              )}
              {hasntJoinedAnyProgramsAdmin && (
                <div style={emptyStateStyle}>
                  <DynamicFormattedMessage id="programs.noneJoined.admin" tag={HTML_TAGS.P} />
                </div>
              )}

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

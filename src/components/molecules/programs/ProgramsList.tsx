import React, { useState } from 'react';

import ProgramBlock from 'components/molecules/programs/ProgramBlock';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Programs.module.scss';
import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
import HyperProgramBlock from './HyperProgramBlock';
import { hasAdminRights } from 'services/security/accessServices';
import HyperPlatformBlock from './HyperPlatformBlock';
import { emptyFn } from 'utils/general';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Handles the rendering of program blocks
 *
 * @param props
 * @constructor
 */
const ProgramsList = ({
  platforms,
  programs,
  isLoading,
  hasMore,
  handleLoadMore,
  userRole,
  processingInvitations = {},
  confirmInvitationRefusal,
  selectedPlatform = null,
  onChangePlatform = null
}) => {
  const { blocksWrapper, separator, customCol, customHeight } = componentStyle;
  const { mb3, overflowHidden } = coreStyle;
  const blockClassName4 = `${grid['col-xl-3']} ${grid['col-lg-6']} ${grid['col-md-6']} ${customCol} ${mb3}`;
  const [showSubPrograms, setShowSubPrograms] = useState(false);
  const [platformId, setPlatformId] = useState(0);
  const [showEndedPrograms, setShowEndedPrograms] = useState(false);

  const canManagePlatform = (platform) => hasAdminRights(platform);

  const onPlatformDeveloppe = (platformId: number, isSuperPlatform: boolean) => {
    setShowSubPrograms(!showSubPrograms);
    setPlatformId(platformId);
    const index = platforms.findIndex(({ id }) => id === platformId);
    const selectedPlatformIndex = Math.max(0, index);
    onChangePlatform(selectedPlatformIndex);
    // setSuperPlatformId(0);
    // setShowSubPlatforms(false);
  }

  const onEndedPrmogramsOpen = () => {
    // setShowSubPrograms(true);
    setShowEndedPrograms(!showEndedPrograms);
  };

  return (
    <GenericInfiniteScroll
      {...{
        hasMore,
        isLoading,
        loadMore: handleLoadMore,
        height: '600px',
        className: componentStyle.sectionProgramsScroll
      }}
    >
      <div className={grid.row}>
        {
          platforms?.map((subPlatform, id) => (
            <>
              <div key={`subplatform_${subPlatform.id || 0}_${id}`} className={`${blockClassName4}`}>
                <HyperPlatformBlock {...{ platform: subPlatform, canManagePlatform: canManagePlatform(subPlatform), enableOnly: false, onSelect: emptyFn, onPlatformDeveloppe: onPlatformDeveloppe }} />
              </div>
              {
                showSubPrograms && subPlatform.id == platformId &&
                // Render the programs for the selected sub-platform                          
                programs?.filter((p) => (new Date(p.endDate) >= new Date() || !p.endDate || p.endDate == ''))?.map(program => (
                  <div className={blockClassName4} key={`program_${program.id}`}>
                    <ProgramBlock
                      {...{
                        program,
                        userRole,
                        confirmInvitationRefusal,
                        processingInvitation: processingInvitations[program.id],
                        selectedPlatform
                      }}
                      key={program.id}
                    />
                  </div>
                ))
              }
              {
                showSubPrograms && subPlatform.id == platformId && programs?.filter((p) => new Date() > new Date(p.endDate) && p.endDate && p.endDate != '').length > 0 &&
                <div className={blockClassName4} key={`ended_program`}>
                  <HyperProgramBlock {...{ program: {}, platform: subPlatform, isDisabled: false, isEndedProgram: true, onEndedPrmogramsOpen }} />
                </div>
              }
              {
                showSubPrograms && subPlatform.id == platformId && showEndedPrograms &&
                programs?.filter((p) => new Date() > new Date(p.endDate) && p.endDate && p.endDate != '')?.map(program => (
                  <div className={blockClassName4} key={`program_${program.id}`}>
                    {/* <HyperProgramBlock {...{ program: program, platform: subPlatform, isDisabled: disableProgramBlocks, isEndedProgram: false, onEndedPrmogramsOpen }} /> */}
                    <ProgramBlock
                      {...{
                        program,
                        userRole,
                        confirmInvitationRefusal,
                        processingInvitation: processingInvitations[program.id],
                        selectedPlatform
                      }}
                      key={program.id}
                    />
                  </div>
                ))
              }
            </>
          ))
        }
      </div>
      {/* <div className={`${blockClassName4}`}>
        <div className={grid.row}>
          {programs.map(program => (
            <ProgramBlock
              {...{
                program,
                userRole,
                confirmInvitationRefusal,
                processingInvitation: processingInvitations[program.id],
                selectedPlatform
              }}
              key={program.id}
            />
          ))}
        </div>
      </div> */}
    </GenericInfiniteScroll>
  )
};

export default ProgramsList;

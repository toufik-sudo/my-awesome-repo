import React, { useState } from 'react';

import HyperPlatformBlock from 'components/molecules/programs/HyperPlatformBlock';
import PlatformPrograms from 'components/molecules/programs/PlatformPrograms';
import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
import { emptyFn } from 'utils/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { hasAdminRights } from 'services/security/accessServices';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Programs.module.scss';
import HyperProgramBlock from './HyperProgramBlock';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';

const HyperProgramsList = ({
  individualPlatforms,
  nestedSuperPlatforms,
  hasMore,
  isLoading,
  handleLoadMore,
  enableOnly,
  setParentPlatform: onSelect
}) => {
  const [showSubPlatforms, setShowSubPlatforms] = useState(false);
  const [showSubPrograms, setShowSubPrograms] = useState(false);
  const [superPlatformId, setSuperPlatformId] = useState(0);
  const [platformId, setPlatformId] = useState(0);
  const [showEndedPrograms, setShowEndedPrograms] = useState(false);

  const { mb3, overflowHidden } = coreStyle;
  const { blocksWrapper, separator, customCol, customHeight } = componentStyle;
  const disableProgramBlocks = !!enableOnly;
  const blockClassName = `${grid['col-xl-4']} ${grid['col-lg-6']} ${grid['col-md-6']} ${customCol} ${mb3}`;
  const blockClassName4 = `${grid['col-xl-3']} ${grid['col-lg-6']} ${grid['col-md-6']} ${customCol} ${mb3}`;

  const onPlatformDeveloppe = (platformId: number, isSuperPlatform: boolean) => {
    if (isSuperPlatform) {
      setShowSubPlatforms(!showSubPlatforms);
      setSuperPlatformId(platformId);
      setPlatformId(0);
      setShowSubPrograms(false);
    } else {
      setShowSubPrograms(!showSubPrograms);
      setPlatformId(platformId);
      // setSuperPlatformId(0);
      // setShowSubPlatforms(false);
    }
  }

  const onEndedPrmogramsOpen = () => {
    // setShowSubPrograms(true);
    setShowEndedPrograms(!showEndedPrograms);
  };

  return (
    <div>
      <GenericInfiniteScroll
        {...{
          hasMore,
          isLoading,
          loadMore: handleLoadMore,
          height: '500',
          className: `${overflowHidden} ${customHeight} ${grid['container-fluid']}`
        }}
      >
        <div className={grid.row}>
          {
            nestedSuperPlatforms.map((platform, index) => {
              const canManagePlatform = hasAdminRights(platform);
              console.log(`platform_${platform.id || 0}_${index}`);

              return (
                <>
                  {
                    platform.hierarchicType == PLATFORM_HIERARCHIC_TYPE.SUPER_PLATFORM &&
                    <div key={`platform_${platform.id || 0}_${index}`} className={`${blockClassName4}`}>
                      <div key={index}>
                        <HyperPlatformBlock {...{ platform, canManagePlatform, enableOnly, onSelect, onPlatformDeveloppe }} />
                      </div>
                    </div>
                  }

                  {
                    platform.subPlatforms && showSubPlatforms && platform.id == superPlatformId &&
                    platform.subPlatforms?.map((subPlatform, id) => (
                      <>
                        <div key={`subplatform_${subPlatform.id || 0}_${id}`} className={`${blockClassName4}`}>
                          <HyperPlatformBlock {...{ platform: subPlatform, canManagePlatform, enableOnly, onSelect, onPlatformDeveloppe }} />
                        </div>
                        {
                          showSubPrograms && platform.id == superPlatformId && subPlatform.id == platformId &&
                          // Render the programs for the selected sub-platform                          
                          subPlatform.programs?.filter((p) => (new Date(p.endDate) >= new Date() || !p.endDate || p.endDate == ''))?.map(program => (
                            <div className={blockClassName4} key={`program_${program.id}`}>
                              <HyperProgramBlock {...{ program: program, platform: subPlatform, isDisabled: disableProgramBlocks, onEndedPrmogramsOpen: onEndedPrmogramsOpen }} />
                            </div>
                          ))
                        }
                        {
                          showSubPrograms && platform.id == superPlatformId && subPlatform.id == platformId &&
                          subPlatform.programs?.filter((p) => new Date() > new Date(p.endDate) && p.endDate && p.endDate != '').length > 0 &&
                          <div className={blockClassName4} key={`ended_program`}>
                            <HyperProgramBlock {...{ program: {}, platform: subPlatform, isDisabled: disableProgramBlocks, isEndedProgram: true, onEndedPrmogramsOpen }} />
                          </div>

                        }
                        {
                          showSubPrograms && platform.id == superPlatformId && subPlatform.id == platformId && showEndedPrograms &&
                          subPlatform.programs?.filter((p) => new Date() > new Date(p.endDate) && p.endDate && p.endDate != '')?.map(program => (
                            <div className={blockClassName4} key={`program_${program.id}`}>
                              <HyperProgramBlock {...{ program: program, platform: subPlatform, isDisabled: disableProgramBlocks, isEndedProgram: false, onEndedPrmogramsOpen }} />
                            </div>
                          ))
                        }
                      </>
                    ))
                  }
                </>
              );
            })
          }
        </div>

        {/* <div className={blocksWrapper}>
          <div className={grid['row-cols-4']}>
            {individualPlatforms.length && (
              <div className={blockClassName}>
                <HyperPlatformBlock
                  {...{
                    platform: {
                      name: <DynamicFormattedMessage id="platforms.placeholder.independent" tag={HTML_TAGS.SPAN} />
                    },
                    enableOnly,
                    onSelect: emptyFn,
                    onPlatformDeveloppe: onPlatformDeveloppe,
                  }}
                />
              </div>
            )}
            {individualPlatforms.map((platform, index) => (
              <>
                <div className={blockClassName} key={`single_platform_${platform.id}_${index}`}>
                  <HyperPlatformBlock
                    {...{ platform, canManagePlatform: hasAdminRights(platform), enableOnly, onSelect, onPlatformDeveloppe }}
                  />
                </div>
                <PlatformPrograms {...{ platform, isDisabled: disableProgramBlocks, blockClassName }} />
              </>
            ))}
          </div>
        </div> */}
      </GenericInfiniteScroll>
    </div>
  );
};

export default HyperProgramsList;

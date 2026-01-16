/* eslint-disable quotes */
import React from 'react';
import { useSelector } from 'react-redux';

import Loading from 'components/atoms/ui/Loading';
import GlobalSlider from 'components/molecules/wall/globalSlider/GlobalSlider';
import UserNumberWidget from 'components/molecules/wall/widgets/UserNumberWidget';
import UserDeclarationsWidget from 'components/molecules/wall/widgets/UserDeclarationsWidget';
import DashboardWidget from 'components/molecules/wall/widgets/DashboardWidget';
import UserRankingsWidget from 'components/molecules/wall/widgets/UserRankingsWidget';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { useUserRole } from 'hooks/user/useUserRole';
import { getUserAuthorizations, isAnyKindOfAdmin, isAnyKindOfManager, isUserBeneficiary } from 'services/security/accessServices';
import { IStore } from 'interfaces/store/IStore';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';

import style from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import sliderStyle from 'sass-boilerplate/stylesheets/components/wall/ProgramsSlider.module.scss';
import { FREEMIUM, PROGRAM_TYPES } from '../../../../constants/wall/launch';
import useSelectedProgram from '../../../../hooks/wall/useSelectedProgram';
import { TOOLTIP_FIELDS } from '../../../../constants/tootltip';
import ReactTooltip from 'react-tooltip';
import { DynamicFormattedMessage } from '../../../atoms/ui/DynamicFormattedMessage';
import { DEFAULT_ALL_PROGRAMS } from '../../../../constants/wall/programButtons';

/**
 * Molecule component used to render left wall block
 *
 * @constructor
 */

const WallLeftBlock = ({
  firstWrapperClass = style.baseColumnBlock,
  secondWrapperClass = `${style.fixedBlock} ${style.fixedBlockLeft}`,
  programDetails = null,
  modifyProgramDesign = null
}) => {
  const isLoading = useSelector<IStore, boolean>(state => state.generalReducer.globalLoading);
  const role = useUserRole();
  const {
    isProgramSelectionLocked,
    selectedProgramId,
    selectedPlatform: { id: platformId }
  } = useWallSelection();
  const selectedProgram = useSelectedProgram();
  const isBeneficiary = isUserBeneficiary(role);
  const isManager = isAnyKindOfManager(getUserAuthorizations(role));
  const isFreemium = selectedProgram && selectedProgram.programType === PROGRAM_TYPES[FREEMIUM];
  const allProgramsSelected = selectedProgram && selectedProgram.name === DEFAULT_ALL_PROGRAMS;

  if (isLoading) {
    return <Loading type={LOADER_TYPE.PAGE} />;
  }

  return (
    <div className={firstWrapperClass}>
      <div className={`${secondWrapperClass} ${sliderStyle.smallSlider}`}>
        <GlobalSlider key={`${selectedProgramId}${isProgramSelectionLocked}${platformId}`} />
        {!isBeneficiary && <UserNumberWidget programDetails={programDetails} modifyProgramDesign={modifyProgramDesign} />}
        {isBeneficiary && isFreemium && <UserNumberWidget programDetails={programDetails} modifyProgramDesign={modifyProgramDesign} />}
        {isBeneficiary && !allProgramsSelected && !isFreemium && <UserRankingsWidget />}
        <DashboardWidget programDetails={programDetails} modifyProgramDesign={modifyProgramDesign} />
        <UserDeclarationsWidget programDetails={programDetails} modifyProgramDesign={modifyProgramDesign} />
        {(((isBeneficiary || isManager) && isFreemium) || (!isBeneficiary && allProgramsSelected)) && (
          <ReactTooltip
            place={TOOLTIP_FIELDS.PLACE_TOP}
            effect={TOOLTIP_FIELDS.EFFECT_SOLID}
            id={'disabledWidget'}
            getContent={() => (
              <DynamicFormattedMessage
                tag={HTML_TAGS.DIV}
                id={allProgramsSelected ? 'wall.blocks.tooltip' : 'wall.freemium.tooltip'}
              />
            )}
          />
        )}
      </div>
    </div>
  );
};

export default WallLeftBlock;

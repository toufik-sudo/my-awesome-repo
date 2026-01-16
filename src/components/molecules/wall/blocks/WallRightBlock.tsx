/* eslint-disable quotes */
import React from 'react';

import AgendaWidget from 'components/molecules/wall/widgets/AgendaWidget';
import ContactUsWidget from 'components/molecules/wall/widgets/ContactUsWidget';
import PaymentWidget from 'components/molecules/wall/widgets/PaymentBlock';
import MobileApp from 'components/molecules/wall/widgets/MobileApp';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { useUserRole } from 'hooks/user/useUserRole';
import {
  getUserAuthorizations,
  isAnyKindOfAdmin,
  isAnyKindOfManager,
  isBlockedStatus
} from 'services/security/accessServices';
import { CONTACT_BLOCK, FAQ_BLOCK } from 'constants/wall/blocks';

import style from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import { DEFAULT_ALL_PROGRAMS } from 'constants/wall/programButtons';
import useSelectedProgram from 'hooks/wall/useSelectedProgram';


/**
 * Molecule component used to render right wall block with widgets
 * TopControlsList and CompanyLogo have been moved to WallRightSidebar
 *
 * @constructor
 */
const WallRightBlock = ({ programDetails, modifyProgramDesign }) => {
  const { baseColumnBlock, fixedBlock, fixedBlockRight } = style;
  const {
    selectedProgramId,
    selectedPlatform: { status, id },
    beneficiaryPoints: { platformProgramsPointsList, reloadKey },
    programs,
    selectedProgramIndex
  } = useWallSelection();
  const role = useUserRole();
  const userRights = getUserAuthorizations(role);
  const isAnyAdmin = isAnyKindOfAdmin(userRights);
  const isAnyManager = isAnyKindOfManager(userRights);
  const selectedProgram = useSelectedProgram();
  const allProgramsSelected = selectedProgram && selectedProgram.name === DEFAULT_ALL_PROGRAMS;

  return (
    <div className={baseColumnBlock}>
      <div className={`${fixedBlock} ${fixedBlockRight}`}>
        <AgendaWidget />
        {/* {isAnyManager && <ContactUsWidget {...{ ...FAQ_BLOCK, programDetails, modifyProgramDesign }} />} */}
        {/* {(!isAnyManager || (isAnyAdmin && !isBlockedStatus(status))) && (
          <PaymentWidget
            {...{
              isAdmin: isAnyAdmin,
              programDetails,
              modifyProgramDesign,
              platformProgramsPointsList,
              id,
              selectedProgramIdParam: selectedProgramId
            }}
          />
          )} */}

        <PaymentWidget
          {...{
            isAdmin: isAnyAdmin,
            programDetails,
            modifyProgramDesign,
            platformProgramsPointsList,
            id,
            selectedProgramIdParam: selectedProgramId,
            disabled: allProgramsSelected
          }}
        />

        <ContactUsWidget {...{ ...CONTACT_BLOCK, programDetails, modifyProgramDesign }} />
        {/* {userRights.isBeneficiary && <MobileApp />} */}
      </div>
    </div>
  );
};

export default WallRightBlock;

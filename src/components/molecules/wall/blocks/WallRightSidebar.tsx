import React from 'react';

import TopControlsList from 'components/molecules/wall/TopControlsList';
import CompanyLogo from 'components/atoms/ui/CompanyLogo';
import { useWallSelection } from 'hooks/wall/useWallSelection';

import style from 'assets/style/components/wall/WallRightSidebar.module.scss';

/**
 * Molecule component used to render right sidebar with top controls and company logo
 * Similar to left sidebar but without background
 *
 * @constructor
 */
const WallRightSidebar = () => {
  const { programs, selectedProgramIndex } = useWallSelection();
  
  const currentProgram = programs[selectedProgramIndex];
  const design = currentProgram && currentProgram.design;
  const companyLogoUrl = design && design.companyLogoUrl;

  return (
    <div className={style.rightSidebar}>
      <div className={style.rightSidebarContent}>
        {companyLogoUrl && <CompanyLogo companyLogo={companyLogoUrl} />}
        <TopControlsList />
      </div>
    </div>
  );
};

export default WallRightSidebar;

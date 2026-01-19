import React from 'react';

import TopControlsList from 'components/molecules/wall/TopControlsList';
import CompanyLogo from 'components/atoms/ui/CompanyLogo';
import { useWallSelection } from 'hooks/wall/useWallSelection';

import style from 'assets/style/components/wall/WallRightSidebar.module.scss';

/**
 * Molecule component used to render right sidebar with company logo and controls
 * Organized with logo at top and controls at bottom
 *
 * @constructor
 */
const WallRightSidebar = () => {
  const { programs, selectedProgramIndex } = useWallSelection();

  const currentProgram = programs[selectedProgramIndex];
  const design = currentProgram && currentProgram.design;
  const companyLogoUrl = design && design.companyLogoUrl;
  const [hideSidebar, setHideSidebar] = React.useState(true);
  const showRightSidebar = () => {
    setTimeout(() => {
      setHideSidebar(!hideSidebar);
    }, 500);
  };

  if (hideSidebar) {
    return (
      <div className={`${!hideSidebar ? style.hideSidebar : ''}`} style={{ border: 'none' }} >
        <button className={style.toggleBtn} onClick={showRightSidebar} >
          ☰
        </button>
      </div>
    );
  }

  return (
    <div className={`${style.rightSidebar} ${hideSidebar ? style.hideSidebar : ''}`}
      onMouseLeave={showRightSidebar} >
      <div className={style.rightSidebarContent}>
        {companyLogoUrl && (
          <div className={style.companyLogoWrapper}>
            <CompanyLogo companyLogo={companyLogoUrl} />
          </div>
        )}
      </div>
      <div className={style.rightSidebarControls}>
        <TopControlsList />
      </div>
    </div>
  );
};

export default WallRightSidebar;

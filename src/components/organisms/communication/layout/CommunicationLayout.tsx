import React from 'react';

import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import CommunicationRightBlock from 'components/organisms/communication/layout/CommunicationRightBlock';
import WallLeftBlock from 'components/molecules/wall/blocks/WallLeftBlock';
import { WALL_TYPE } from 'constants/general';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import communicationStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';

/**
 * Handles the rendering of communication blocks in order to design the components easier
 *
 * @param props
 * @constructor
 */

const CommunicationLayout = props => (
  <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
    <div className={`${grid['container-fluid']} ${communicationStyle.communication}`}>
      <div className={grid['row']}>
        <WallLeftBlock
          firstWrapperClass={`${grid['col-md-4']} ${grid['col-xl-3']} ${grid['p-0']} ${communicationStyle.customCol}`}
        />
        <CommunicationRightBlock>{props.children}</CommunicationRightBlock>
      </div>
    </div>
  </LeftSideLayout>
);

export default CommunicationLayout;

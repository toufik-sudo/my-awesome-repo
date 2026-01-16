import React from 'react';

import communicationStyle from 'sass-boilerplate/stylesheets/components/communication/Communication.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

/**
 *  Renders the content of each communication page
 *
 * @param props
 * @constructor
 */
const CommunicationRightBlock = props => {
  return (
    <div className={`${communicationStyle.customSpacing} ${grid['col-md-8']} ${grid['col-xl-9']}`}>
      {props.children}
    </div>
  );
};

export default CommunicationRightBlock;

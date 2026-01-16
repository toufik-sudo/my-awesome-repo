import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useIntl } from 'react-intl';
import LinkBack from 'components/atoms/ui/LinkBack';
import { WALL_COMMUNICATION_USER_LIST_ROUTE } from 'constants/routes';
import { HTML_TAGS } from 'constants/general';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';

function UserListSearchInput({ value, onChange, onSearch, titleId }) {
  const { displayFlex, withDefaultColor } = coreStyle;
  const { createListInput, createCampaignHeader, searchWrapper, linkBack } = componentStyle;
  const { formatMessage } = useIntl();
  const { colorSidebar } = useSelectedProgramDesign();

  return (
    <div className={`${createCampaignHeader} ${tableStyle.tableHeader}`} style={{ background: colorSidebar }}>
      <div className={grid.container}>
        <div className={`${grid.row} ${coreStyle.py1}`}>
          <div className={`${withDefaultColor} ${linkBack} ${grid['col-sm-4']}`}>
            <LinkBack to={WALL_COMMUNICATION_USER_LIST_ROUTE} messageId="communications.userList.link.back" />
          </div>
          <DynamicFormattedMessage className={`${grid['col-sm-4']}`} tag={HTML_TAGS.H4} id={titleId} />
          <div className={`${grid['col-sm-4']} ${displayFlex} ${searchWrapper}`}>
            <input
              className={createListInput}
              value={value}
              placeholder={formatMessage({ id: 'communication.userList.create.search.placeholder' })}
              onChange={onChange}
            />
            <FontAwesomeIcon icon={faSearch} onClick={onSearch} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserListSearchInput;

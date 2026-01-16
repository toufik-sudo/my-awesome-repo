import React from 'react';

import PointConversionsHeaderElement from './PointConversionsHeaderElement';
import { POINT_CONVERSION_HEADERS } from 'constants/wall/users';
import { useWindowSize } from 'hooks/others/useWindowSize';
import { WINDOW_SIZES } from 'constants/general';
import pointsStyle from 'sass-boilerplate/stylesheets/components/launch/Points.module.scss';
import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import bootstrap from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';


/**
 * Molecule component used to render Point Conversions Header
 *
 * @param props
 * @param props.sortState current sorting state
 * @param props.onSort callback to execute on sorting change
 * @constructor
 */
const PointConversionsHeader = ({ sortState, onSort, isLoading = false, headers = POINT_CONVERSION_HEADERS }) => {
  const { windowSize } = useWindowSize();
  const isSmallWindow = windowSize.width < WINDOW_SIZES.DESKTOP_SMALL;
  const { headerWidth24, headerWidth15 } = pointsStyle;
  const { colorSidebar } = useSelectedProgramDesign();

  return (
    <thead>
      <tr style={{ backgroundColor: colorSidebar, color: 'white', borderRadius: '5px' }}>
        {headers.map(header => {
          const skipSorting = isSmallWindow || (header as any).isNotSortable;
          return (
            <td key={header.id} className={header.id == 'orderUuid' || header.id == 'transactionRefId' || header.id == 'errorMessage' ? headerWidth24 : headerWidth15}>
              <PointConversionsHeaderElement {...header} {...{ skipSorting, sortState, onSort, isLoading }} />
            </td>
          );
        })}
      </tr>
    </thead>
  );
};

export default PointConversionsHeader;

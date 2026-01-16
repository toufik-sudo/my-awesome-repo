/* eslint-disable prefer-const */
/* eslint-disable quotes */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
// import { useDispatch } from 'react-redux';

// import GenericInfiniteScroll from 'components/atoms/list/GenericInfiniteScroll';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import PointConversionsHeader from 'components/molecules/wall/pointConversions/PointConversionsHeader';
// import ValidatePointConversionModal from 'components/organisms/modals/ValidatePointConversionModal';
// import PointConversionRow from 'components/organisms/wall/pointConversions/PointConversionRow';
import {
  DEFAULT_POINT_CONVERSION_STATUS_ERROR,
  DEFAULT_POINT_CONVERSION_STATUS_PENDING,
  HTML_TAGS,
  LOADER_TYPE
} from 'constants/general';
// import { VALIDATE_POINT_CONVERSION_MODAL } from 'constants/modal';
import { POINT_CONVERSION_HEADERS } from 'constants/wall/users';
// import { setModalState } from 'store/actions/modalActions';

import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
// import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import Multiselect from 'multiselect-react-dropdown';
import { useIntl } from 'react-intl';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import pointsStyle from 'sass-boilerplate/stylesheets/components/launch/Points.module.scss';
// import { ProductFromCatalogue } from 'api/huuray/models/ProductFromCatalogue';
import { IPointsConverion, PointsOption } from 'interfaces/components/wall/Ipoints';
// import { tr } from 'date-fns/locale';
import { ColDef, GridReadyEvent, IDateFilterParams, CellClassParams, RowClassParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
// import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Theme
import Loading from 'components/atoms/ui/Loading';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import CustomPointsTooltip from './CustomPointsTooltip';
// import ReactTooltip from 'react-tooltip';
// import { TOOLTIP_FIELDS } from 'constants/tootltip';

/**
 * Renders the list of point conversions
 *
 * @param hasMore
 * @param loadMore
 * @param scrollRef
 * @param isLoading
 * @param pointsConversions
 * @param listCriteria
 * @param onSort
 * @param onValidateSuccess
 * @constructor
 */
export const PointConversionsList = ({
  hasMore,
  loadMore,
  scrollRef,
  isLoading,
  pointsConversions,
  listCriteria,
  onSort,
  onValidateSuccess,
  setDataExport,
  setExportColDefs,
  setFileName
}) => {
  // const dispatch = useDispatch();
  const {
    textCenter,
    withDangerColor,
    mt2,
    text1Xs,
    pointer,
    secondaryColor,
    withAlertColor,
    withBoldFont
  } = coreStyle;
  const { tableRowHoverUser, tableUsers } = tableStyle;
  const [selectedListBrandName, setSelectedListBrandName] = useState < PointsOption[] > ([]);
  const [selectedListStatus, setSelectedListStatus] = useState < PointsOption[] > ([]);
  const [selectedListColumns, setSelectedListColumns] = useState < PointsOption[] > ([]);
  const [selectedListName, setSelectedListName] = useState < PointsOption[] > ([]);
  const [selectedListPlatform, setSelectedListPlatform] = useState < PointsOption[] > ([]);
  const [selectedListProgram, setSelectedListProgram] = useState < PointsOption[] > ([]);
  const [brandNameOptions, setBrandNameOptions] = useState < PointsOption[] > ([]);
  const [platformOptions, setPlatformOptions] = useState < PointsOption[] > ([]);
  const [programOptions, setProgramOptions] = useState < PointsOption[] > ([]);
  const [columnsOptions, setColumnsOptions] = useState < PointsOption[] > ([]);
  const [statusOptions, setStatusOptions] = useState < PointsOption[] > ([]);
  const [filtredData, setFiltredData] = useState < IPointsConverion[] > ([]);
  const [selectedRow, setSelectedRow] = useState < IPointsConverion > ({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [colFiledData, setColFiledData] = useState('');
  const [selectedRowId, setSelectedRowId] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { formatMessage } = useIntl();
  const [dataToCopy, setDataToCopy] = useState('');
  const [colDefs, setColDefs] = useState([]);

  const { customMultiselect } = eCardStyle;
  // const onValidateRow = pointConversion => {
  //   dispatch(setModalState(true, VALIDATE_POINT_CONVERSION_MODAL, { pointConversion }));
  // };

  const multiFilterData = (selectedList: PointsOption[], selectedItem: PointsOption) => {
    // unSelectAll();
    let dataSearch = [];
    let data = pointsConversions;
    if (selectedItem.isBrandName) {
      setSelectedListBrandName(selectedList);
    } else if (selectedItem.isStatus) {
      setSelectedListStatus(selectedList);
    } else if (selectedItem.isPlatform) {
      setSelectedListPlatform(selectedList);
    } else if (selectedItem.isProgram) {
      setSelectedListProgram(selectedList);
    }

    if (selectedItem.isPlatform || selectedListPlatform?.length > 0) {
      let selection = selectedItem.isPlatform ? selectedList : selectedListPlatform;
      dataSearch = data?.filter((element: IPointsConverion) => {
        return selection.filter((f: PointsOption) => element.platform.id == f.value).length != 0;
      });
    }
    if (selectedItem.isProgram || selectedListProgram?.length > 0) {
      let selection = selectedItem.isProgram ? selectedList : selectedListProgram;
      let dataFilter = dataSearch && dataSearch.length > 0 ? dataSearch : data;
      dataSearch = dataFilter?.filter((element: IPointsConverion) => {
        return selection.filter((f: PointsOption) => element.program.id == f.value).length != 0;
      });
    }
    if (selectedItem.isBrandName || selectedListBrandName?.length > 0) {
      let selection = selectedItem.isBrandName ? selectedList : selectedListBrandName;
      let dataFilter = dataSearch && dataSearch.length > 0 ? dataSearch : data;
      dataSearch = dataFilter?.filter((element: IPointsConverion) => {
        return selection.filter((f: PointsOption) => element.brandName.indexOf(f.value) >= 0).length != 0;
      });
    }
    if (selectedItem.isStatus || selectedListStatus?.length > 0) {
      let dataFilter = dataSearch && dataSearch.length > 0 ? dataSearch : data;
      let selection = selectedItem.isStatus ? selectedList : selectedListStatus;
      if (selection?.length > 0) {
        dataSearch = dataFilter?.filter((element: IPointsConverion) => {
          return selection.filter((f: PointsOption | any) => element.status == f.value).length != 0;
        });
      }
      // else {
      //   dataSearch = data;
      // }
    }
    setFiltredData(dataSearch);
    // setFiltredData(dataSearch);
    // setEcardFiltredList(dataSearch);
  };

  const setFiltersdata = async () => {
    let status = [];
    let brandNames = [];
    let platforms = [];
    let programs = [];
    pointsConversions.forEach((element: IPointsConverion) => {
      if (
        (brandNames.length == 0 || !brandNames.some(e => e.value == element.brandName || element.brandName == '')) &&
        element.brandName &&
        element.brandName != '' &&
        element.brandName != ' '
      ) {
        brandNames.push({
          value: element.brandName,
          label: element.brandName,
          color: '',
          isFixed: false,
          isDisabled: false,
          isBrandName: true
        });
      }
      if ((status.length == 0 || !status.some(e => e.value == element.status)) && element.status) {
        status.push({
          value: element.status,
          label: element.statusName,
          color: '',
          isFixed: false,
          isDisabled: false,
          isStatus: true
        });
      }
      if (
        (platforms.length == 0 || !platforms.some(e => e.value == element.platform.id || element.platform.id == '')) &&
        element.platform.id &&
        element.platform.id != '' &&
        element.platform.id != ' '
      ) {
        platforms.push({
          value: element.platform.id,
          label: element.platform.name,
          color: '',
          isFixed: false,
          isDisabled: false,
          isPlatform: true
        });
      }
      if (
        (programs.length == 0 || !programs.some(e => e.value == element.program.id || element.program.id == '')) &&
        element.program.id &&
        element.program.id != '' &&
        element.program.id != ' '
      ) {
        programs.push({
          value: element.program.id,
          label: element.program.name,
          color: '',
          isFixed: false,
          isDisabled: false,
          isProgram: true
        });
      }
    });
    setBrandNameOptions(brandNames);
    setStatusOptions(status);
    setPlatformOptions(platforms);
    setProgramOptions(programs);
  };
  // const [colDefs, setColDefs] = useState([]);
  const [defaultColDef, setDefaultColDef] = useState({});
  const [gridApi, setGridApi] = useState < any > ({});
  const [columnApi, setColumnApi] = useState < any > ({});
  // const [isTooltipOpen, setIsTooltipOpen] = useState(true);
  const getRowClass = (params: RowClassParams) => {
    return params.node.data.status == 2
      ? `${withBoldFont} ${withDangerColor}`
      : params.node.data.status == 3
        ? `${withBoldFont} ${withAlertColor}`
        : '';
  };
  const setGridColDefs = () => {
    const columns: PointsOption[] = [];
    if (!colDefs || colDefs?.length == 0) {
      let coldef = [];
      let coldefExp = [];
      setExportColDefs([]);

      POINT_CONVERSION_HEADERS.forEach((col: any) => {
        const obj = {
          field: col.field,
          headerName: formatMessage({ id: col.headerName }),
          pinned: col.pinned,
          minWidth: col.minWidth,
          maxWidth: col.maxWidth
        };
        // col.headerName = formatMessage({id: col.headerName});
        // col.cellClass = cellClass;
        const col1 = Object.assign({}, col, {})
        coldefExp.push({
          field: col1.field,
          headerName: formatMessage({ id: col1.headerName })
        });

        coldef.push(obj);
        columns.push({
          label: obj.headerName,
          value: obj.field
        });
      });
      const cols = Object.assign([], coldefExp);
      setExportColDefs(cols);

      setColDefs(coldef);
      setDefaultColDef({
        flex: 1,
        minWidth: 110,
        maxWidth: 130,
        resizable: true,
        filter: 'agTextColumnFilter',
        menuTabs: ['filterMenuTab']
      });
      setColumnsOptions(columns);
      setSelectedListColumns(columns);
    } else if (!columnsOptions || columnsOptions?.length == 0) {
      colDefs.forEach((col: any) => {
        columns.push({
          label: col.headerName,
          value: col.field
        });
        setColumnsOptions(columns);
        setSelectedListColumns(columns);
      });
    }
  };

  const performData = () => {
    pointsConversions.map((elem: IPointsConverion) => {
      elem.superplatformName = elem.superplatform.name;
      elem.superPlatformId = elem.superplatform.id;
      elem.platformName = elem.platform.name;
      elem.platformId = elem.platform.id;
      elem.programName = elem.program.name;
      elem.programId = elem.program.id;
      elem.company = elem.program.company;
      elem.statusName = formatMessage({ id: `pointConversions.status.${elem.status}` });
      return elem;
    });
    const data = Object.assign([], pointsConversions);
    setDataExport(data);
  };

  useEffect(() => {
    performData();
    setFiltredData(pointsConversions);
    setFiltersdata();
    setGridColDefs();
  }, [pointsConversions]);

  /**
   * AG Grid data table
   */

  // const defaultColDef = useMemo(() => {
  //   return {
  //     flex: 1,
  //     minWidth: 150,
  //     filter: 'agTextColumnFilter',
  //     menuTabs: ['filterMenuTab'],
  //   };
  // }, []);
  const onGridReady = useCallback(params => {
    // fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
    //   .then((resp) => resp.json())
    //   .then((data) => setRowData(data));
    if (params) {
      setGridApi(params.api);
      setColumnApi(params.columnApi);
    }
  }, []);

  const resetFilters = () => {
    setSelectedListBrandName([]);
    setSelectedListPlatform([]);
    setSelectedListProgram([]);
    setSelectedListStatus([]);
    setSelectedListColumns([]);
    setTimeout(() => {
      setSelectedListColumns(columnsOptions);
      showAllColumns();
    }, 100);
    // console.log(statusOptions);
    setFiltredData(pointsConversions);
  };

  const onRowClicked = e => {
    const row = e.data;
    let rowData = {};
    colDefs.forEach(col => {
      let key = col.headerName;
      let colField = col.field;
      rowData[key] = row[colField];
    });
    setSelectedRow(rowData);
    const colData = e.event.target.innerHTML;
    setColFiledData(colData);
    setPosition({ x: e.event.clientX, y: e.event.clientY });
    setIsVisible(true);
  };

  const showColumns = (selectedList: PointsOption[], selectedItem: PointsOption) => {
    const colDef = columnApi.api.getColumn(selectedItem.value);
    columnApi.api.setColumnVisible(colDef, true);
  };
  const hideColumns = (selectedList: PointsOption[], selectedItem: PointsOption) => {
    const colDef = columnApi.api.getColumn(selectedItem.value);
    columnApi.api.setColumnVisible(colDef, false);
  };

  const showAllColumns = () => {
    const colDefs = columnApi.api.getColumns();
    columnApi.api.setColumnsVisible(colDefs, true);
  };

  if (isLoading || !pointsConversions || pointsConversions?.length == 0) {
    return <Loading type={LOADER_TYPE.PAGE} />;
  }

  if ((!isLoading && pointsConversions?.length > 0) || pointsConversions?.length > 0) {
    {
      return (
        <div className={pointsStyle.gridPoints}>
          <div className={pointsStyle.gridPointsFilter}>
            <Multiselect
              options={platformOptions} // Options to display in the dropdown
              onSelect={multiFilterData} // Function will trigger on select event
              onRemove={multiFilterData} // Function will trigger on remove event
              selectedValues={selectedListPlatform}
              displayValue="label" // Property name to display in the dropdown options
              placeholder={formatMessage({ id: 'points.filter.platform.placeholder' })}
              className={`input-group ${customMultiselect}`}
              showCheckbox={true}
              showArrow={true}
              customArrow={true}
              selectedValueDecorator={(selectedList, _renderChip) => {
                console.log('_renderChip', _renderChip);
                console.log('selectedList', selectedList);
                return (
                  <div
                    style={{ display: selectedListPlatform.length > 2 && selectedListPlatform[0].value != _renderChip.value ? 'none' : 'block' }}
                    className={selectedListPlatform.length > 2 && selectedListPlatform[0].value != _renderChip.value ? 'hide-selected-items' : 'first-selected-item'}
                  >
                    {selectedListPlatform.length <= 2 && selectedList}
                    {selectedListPlatform.length > 2 && selectedListPlatform.length + formatMessage({ id: 'ddl.selected.items' })}
                  </div>
                );
              }
              }
            />
            <Multiselect
              options={programOptions} // Options to display in the dropdown
              onSelect={multiFilterData} // Function will trigger on select event
              onRemove={multiFilterData} // Function will trigger on remove event
              selectedValues={selectedListProgram}
              displayValue="label" // Property name to display in the dropdown options
              placeholder={formatMessage({ id: 'points.filter.program.placeholder' })}
              className={`input-group ${customMultiselect}`}
              showCheckbox={true}
              showArrow={true}
              customArrow={true}
              selectedValueDecorator={(selectedList, _renderChip) => {
                console.log('_renderChip', _renderChip);
                console.log('selectedList', selectedList);
                return (
                  <div
                    style={{ display: selectedListProgram.length > 2 && selectedListProgram[0].value != _renderChip.value ? 'none' : 'block' }}
                    className={selectedListProgram.length > 2 && selectedListProgram[0].value != _renderChip.value ? 'hide-selected-items' : 'first-selected-item'}
                  >
                    {selectedListProgram.length <= 2 && selectedList}
                    {selectedListProgram.length > 2 && selectedListProgram.length + formatMessage({ id: 'ddl.selected.items' })}
                  </div>
                );
              }
              }
            />
            <Multiselect
              options={brandNameOptions} // Options to display in the dropdown
              onSelect={multiFilterData} // Function will trigger on select event
              onRemove={multiFilterData} // Function will trigger on remove event
              selectedValues={selectedListBrandName}
              displayValue="label" // Property name to display in the dropdown options
              placeholder={formatMessage({ id: 'points.filter.brandName.placeholder' })}
              className={`input-group ${customMultiselect}`}
              showCheckbox={true}
              showArrow={true}
              customArrow={true}
              selectedValueDecorator={(selectedList, _renderChip) => {
                console.log('_renderChip', _renderChip);
                console.log('selectedList', selectedList);
                return (
                  <div
                    style={{ display: selectedListBrandName.length > 2 && selectedListBrandName[0].value != _renderChip.value ? 'none' : 'block' }}
                    className={selectedListBrandName.length > 2 && selectedListBrandName[0].value != _renderChip.value ? 'hide-selected-items' : 'first-selected-item'}
                  >
                    {selectedListBrandName.length <= 2 && selectedList}
                    {selectedListBrandName.length > 2 && selectedListBrandName.length + formatMessage({ id: 'ddl.selected.items' })}
                  </div>
                );
              }
              }
            />
          </div>
          <div className={pointsStyle.gridPointsFilter}>
            <Multiselect
              id="id1"
              options={statusOptions} // Options to display in the dropdown
              onSelect={multiFilterData} // Function will trigger on select event
              onRemove={multiFilterData} // Function will trigger on remove event
              selectedValues={selectedListStatus}
              displayValue="label" // Property name to display in the dropdown options
              placeholder={formatMessage({ id: 'points.filter.status.placeholder' })}
              className={`input-group ${customMultiselect}`}
              showCheckbox={true}
              showArrow={true}
              customArrow={true}
              selectedValueDecorator={(selectedList, _renderChip) => {
                console.log('_renderChip', _renderChip);
                console.log('selectedList', selectedList);
                return (
                  <div
                    style={{ display: selectedListStatus.length > 2 && selectedListStatus[0].value != _renderChip.value ? 'none' : 'block' }}
                    className={selectedListStatus.length > 2 && selectedListStatus[0].value != _renderChip.value ? 'hide-selected-items' : 'first-selected-item'}
                  >
                    {selectedListStatus.length <= 2 && selectedList}
                    {selectedListStatus.length > 2 && selectedListStatus.length + formatMessage({ id: 'ddl.selected.items' })}
                  </div>
                );
              }
              }
            />
            <Multiselect
              options={columnsOptions} // Options to display in the dropdown
              onSelect={showColumns} // Function will trigger on select event
              onRemove={hideColumns} // Function will trigger on remove event
              selectedValues={selectedListColumns}
              displayValue="label" // Property name to display in the dropdown options
              placeholder={formatMessage({ id: 'points.filter.column.placeholder' })}
              className={`input-group ${customMultiselect}`}
              showCheckbox={true}
              showArrow={true}
              customArrow={true}
              selectedValueDecorator={(selectedList, _renderChip) => {
                console.log('_renderChip', _renderChip);
                console.log('selectedList', selectedList);
                return (
                  <div
                    style={{ display: selectedListColumns.length > 2 && selectedListColumns[0].value != _renderChip.value ? 'none' : 'block' }}
                    className={selectedListColumns.length > 2 && selectedListColumns[0].value != _renderChip.value ? 'hide-selected-items' : 'first-selected-item'}
                  >
                    {selectedListColumns.length <= 2 && selectedList}
                    {selectedListColumns.length > 2 && selectedListColumns.length + formatMessage({ id: 'ddl.selected.items' })}
                  </div>
                );
              }
              }
            />
            <ButtonFormatted
              onClick={resetFilters}
              variant={BUTTON_MAIN_VARIANT.INVERTED}
              type={BUTTON_MAIN_TYPE.PRIMARY}
              buttonText="btn.label.resetFilters"
              isLoading={isLoading}
            />
          </div>
          <div className={`${pointsStyle.gridPointsContent} ag-theme-quartz`}>
            <AgGridReact
              rowData={filtredData}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              onGridReady={onGridReady}
              pagination={true}
              enableBrowserTooltips={true}
              getRowClass={getRowClass}
              tooltipInteraction={true}
              onRowClicked={e => onRowClicked(e)}
              suppressMenuHide={true}
              sideBar={'columns'}
            />
            <CustomPointsTooltip
              data={selectedRow}
              position={position}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
              dataToCopy={dataToCopy}
              setDataToCopy={setDataToCopy}
              colFiledData={colFiledData}
            />
          </div>
        </div>
      );
    }
  }
};

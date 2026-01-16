/* eslint-disable prefer-const */
/* eslint-disable quotes */
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
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
import { BDC_DEMAND_HEADERS, POINT_CONVERSION_HEADERS } from 'constants/wall/users';
// import { setModalState } from 'store/actions/modalActions';

import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
// import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import Multiselect from 'multiselect-react-dropdown';
import { useIntl } from 'react-intl';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import pointsStyle from 'sass-boilerplate/stylesheets/components/launch/Points.module.scss';
// import { ProductFromCatalogue } from 'api/huuray/models/ProductFromCatalogue';
// import { tr } from 'date-fns/locale';
import { ColDef, GridReadyEvent, IDateFilterParams, CellClassParams, RowClassParams } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react'; // React Grid Logic
// import 'ag-grid-community/styles/ag-grid.css'; // Core CSS
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Theme
import Loading from 'components/atoms/ui/Loading';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
// import CustomPointsTooltip from './CustomPointsTooltip';
import { BDC_DEMAND_STATUS, BdcDemandModelApi, BdcInvoiceOption, getBdcInvoiceParamsApi, getBdcInvoiceResponseApi, getBdcInvoiceResponseData, BDC_DEMAND_DATES } from 'components/pages/wall/bdcWinsDemand/BdcDemandModel';
import BdcDemandApi from 'api/BdcDemandApi';
import { UserContext } from 'components/App';
import CustomPointsTooltip from '../pointConversions/CustomPointsTooltip';
import moment from 'moment';
// import ReactTooltip from 'react-tooltip';
// import { TOOLTIP_FIELDS } from 'constants/tootltip';
import winsStyle from 'assets/style/components/wins/wins.module.scss';

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
const BdcInvoiceCompanyHistory = ({ setDataExport = null, setExportColDefs = null, setFileName = null, isDisplayModal = null }) => {
  // const dispatch = useDispatch();
  const {
    textCenter,
    withDangerColor,
    mt2,
    text1Xs,
    pointer,
    secondaryColor,
    withAlertColor,
    withThirdColor,
    withBoldFont
  } = coreStyle;

  // const { tableRowHoverUser, tableUsers } = tableStyle;
  const [selectedListUsername, setSelectedListUsername] = useState < BdcInvoiceOption[] > ([]);
  const [selectedListStatus, setSelectedListStatus] = useState < BdcInvoiceOption[] > ([]);
  const [selectedListColumns, setSelectedListColumns] = useState < BdcInvoiceOption[] > ([]);
  const [selectedListBdcDate, setSelectedListBdcDate] = useState < BdcInvoiceOption[] > ([]);
  const [selectedListInvoiceDate, setSelectedListInvoiceDate] = useState < BdcInvoiceOption[] > ([]);
  const [userOptions, setUserOptions] = useState < BdcInvoiceOption[] > ([]);
  const [bdcDateOptions, setBdcDateOptions] = useState < BdcInvoiceOption[] > ([]);
  const [invoiceDateOptions, setInvoiceDateOptions] = useState < BdcInvoiceOption[] > ([]);
  const [columnsOptions, setColumnsOptions] = useState < BdcInvoiceOption[] > ([]);
  const [statusOptions, setStatusOptions] = useState < BdcInvoiceOption[] > ([]);
  const [filtredData, setFiltredData] = useState < getBdcInvoiceResponseApi[] > ([]);
  const [cacheRowData, setCacheRowData] = useState < getBdcInvoiceResponseApi[] > ([]);
  const [selectedRow, setSelectedRow] = useState < getBdcInvoiceResponseApi | any > ({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [colFiledData, setColFiledData] = useState('');
  // const [selectedRowId, setSelectedRowId] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dataToCopy, setDataToCopy] = useState('');
  let [selectedListData, setSelectedListData] = useState();

  const { customMultiselect } = eCardStyle;
  // const onValidateRow = pointConversion => {
  //   dispatch(setModalState(true, VALIDATE_POINT_CONVERSION_MODAL, { pointConversion }));
  // };

  const { formatMessage } = useIntl();
  const { userData } = useContext(UserContext);


  const multiFilterData = (selectedList: BdcInvoiceOption[], selectedItem: BdcInvoiceOption) => {
    // unSelectAll();
    let dataSearch = cacheRowData;
    let data = cacheRowData;
    if (selectedItem.isUsername) {
      setSelectedListUsername(selectedList);
    } else if (selectedItem.isStatus) {
      setSelectedListStatus(selectedList);
    } else if (selectedItem.isBdcDate) {
      setSelectedListBdcDate(selectedList);
    } else if (selectedItem.isInvoiceDate) {
      setSelectedListInvoiceDate(selectedList);
    }

    if (selectedItem.isBdcDate || selectedListBdcDate?.length > 0) {
      let selection = selectedItem.isBdcDate ? selectedList : selectedListBdcDate;
      dataSearch = data?.filter((element: getBdcInvoiceResponseApi) => {
        return selection.filter((f: BdcInvoiceOption) => {
          const v = f.value;
          let val: any = v.split(',');
          let elemDate = moment(element.bdcDate, 'YYYY-MM-DD;hh:mm:ss');
          let today = moment(new Date(), 'YYYY-MM-DD;hh:mm:ss');
          let fDate = moment(new Date(), 'YYYY-MM-DD;hh:mm:ss').subtract(val[0], val[1]);
          return elemDate <= today && elemDate >= fDate;
        }).length != 0;
      });
    }

    if (selectedItem.isInvoiceDate || selectedListInvoiceDate?.length > 0) {
      let selection = selectedItem.isInvoiceDate ? selectedList : selectedListInvoiceDate;
      let dataFilter = dataSearch && dataSearch.length > 0 ? dataSearch : data;
      dataSearch = dataFilter?.filter((element: getBdcInvoiceResponseApi) => {
        return selection.filter((f: BdcInvoiceOption) => {
          const v = f.value;
          let val: any = v.split(',');
          let elemDate = moment(element.invoiceDate, 'YYYY-MM-DD;hh:mm:ss');
          let today = moment(new Date(), 'YYYY-MM-DD;hh:mm:ss');
          let fDate = moment(new Date(), 'YYYY-MM-DD;hh:mm:ss').subtract(val[0], val[1]);
          return elemDate <= today && elemDate >= fDate;
        }).length != 0;
      });
    }

    if (selectedItem.isUsername || selectedListUsername?.length > 0) {
      let selection = selectedItem.isUsername ? selectedList : selectedListUsername;
      let dataFilter = dataSearch && dataSearch.length > 0 ? dataSearch : data;
      dataSearch = dataFilter?.filter((element: getBdcInvoiceResponseApi) => {
        return selection.filter((f: BdcInvoiceOption) => element.username?.indexOf(f.value) >= 0).length != 0;
      });
    }

    if (selectedItem.isStatus || selectedListStatus?.length > 0) {
      let dataFilter = dataSearch && dataSearch.length > 0 ? dataSearch : data;
      let selection = selectedItem.isStatus ? selectedList : selectedListStatus;
      if (selection?.length > 0) {
        dataSearch = dataFilter?.filter((element: getBdcInvoiceResponseApi) => {
          return selection.filter((f: BdcInvoiceOption | any) => element.status == f.value).length != 0;
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

  const setFiltersdata = async (data) => {
    let status = [];
    let usernames = [];
    let bdcDates = [];
    let invoiceDates = [];
    data.forEach((element: getBdcInvoiceResponseApi) => {
      if (
        (usernames.length == 0 || !usernames.some(e => e.value == element.username || element.username == '')) &&
        element.username &&
        element.username != '' &&
        element.username != ' '
      ) {
        usernames.push({
          value: element.username,
          label: element.username,
          color: '',
          isFixed: false,
          isDisabled: false,
          isUsername: true
        });
      }
    });
    for (let s in BDC_DEMAND_STATUS) {
      status.push({
        value: s,
        label: formatMessage({ id: `wall.pointConversions.${s}` }),
        color: '',
        isFixed: false,
        isDisabled: false,
        isStatus: true
      });
    }
    for (let date in BDC_DEMAND_DATES) {
      let obj: any = {
        value: BDC_DEMAND_DATES[date],
        label: formatMessage({ id: `wall.pointConversions.${date}` }),
        color: '',
        isFixed: false,
        isDisabled: false
      };
      obj.isBdcDate = true;
      bdcDates.push(obj);
      let obj1 = Object.assign({}, obj);
      obj1.isBdcDate = false;
      obj1.isInvoiceDate = true;
      invoiceDates.push(obj1);
    }


    setUserOptions(usernames);
    setStatusOptions(status);
    setBdcDateOptions(bdcDates);
    setInvoiceDateOptions(invoiceDates);
  };

  const [bdcColDefs, setBdcColDefs] = useState([]);
  const [bdcDefaultColDef, setBdcDefaultColDef] = useState({});
  const [gridApi, setGridApi] = useState < any > ({});
  const [columnApi, setColumnApi] = useState < any > ({});
  // const [isTooltipOpen, setIsTooltipOpen] = useState(true);

  const getRowClass = (params: RowClassParams) => {
    const status = params.node.data.status;
    return status == BDC_DEMAND_STATUS.IN_ERROR || status == BDC_DEMAND_STATUS.CANCELLED
      ? `${withBoldFont} ${withDangerColor}`
      : status == BDC_DEMAND_STATUS.IN_PROGRESS
        ? `${withBoldFont} ${withAlertColor}`
        : (status == BDC_DEMAND_STATUS.TERMINATED ? `${withBoldFont} ${withThirdColor}` : '');
  };

  const setGridColDefs = () => {
    const columns: BdcInvoiceOption[] = [];
    if (!bdcColDefs || bdcColDefs?.length == 0) {
      const coldef = [];
      const coldefExp = [];
      if (setExportColDefs) {
        setExportColDefs([]);
      }

      BDC_DEMAND_HEADERS.forEach((col: any) => {
        const obj = {
          field: col.field,
          headerName: formatMessage({ id: col.headerName }),
          pinned: col.pinned,
          minWidth: col.minWidth,
          maxWidth: col.maxWidth
        };

        let col1 = Object.assign({}, col);
        coldefExp.push({
          field: col1.field,
          headerName: formatMessage({ id: col1.headerName })
        });

        if (col.field == "bdcPdf" || col.field == "invoicePdf") {
          obj.cellClass = params => {
            console.log(params);
            return (params.data.status == BDC_DEMAND_STATUS.IN_PROGRESS || params.data.status == BDC_DEMAND_STATUS.TERMINATED) ? `${winsStyle.btnDownload}` : '';
          }
        }
        // col.headerName = formatMessage({id: col.headerName});
        // col.cellClass = cellClass;

        coldef.push(obj);
        columns.push({
          label: obj.headerName,
          value: obj.field
        });
      });
      const cols = Object.assign([], coldefExp);
      if (setExportColDefs) {
        setExportColDefs(cols);
      }
      if (setFileName) {
        setFileName('Historique_des_BDC');
      }

      setBdcColDefs(coldef);
      setBdcDefaultColDef({
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
      bdcColDefs.forEach((col: any) => {
        columns.push({
          label: col.headerName,
          value: col.field
        });
        setColumnsOptions(columns);
        setSelectedListColumns(columns);
      });
    }
  };

  const getBdcDemandHistory = async () => {
    try {
      const bdcDemandApi = new BdcDemandApi();
      const userUuid = userData.uuid;
      // const data: BdcDemandModelApi = await bdcDemandApi.getWinsCompany(selectedProgramId, userUuid);
      // setEtsActualAccountWins(data.data.wallletCompany.wins);  
      // setCompanyWins(data.data.company); 
      // setIsActualWinsSetted(true);
      const params: getBdcInvoiceParamsApi = {
        userAdminUuId: userUuid
      }
      const dataResp: getBdcInvoiceResponseData = await bdcDemandApi.getBdcDemandHistory(params);
      let data: getBdcInvoiceResponseApi[] = dataResp.data;
      data = data.map(row => {
        row.statusName = formatMessage({ id: `wall.pointConversions.${row.status}` });
        return row;
      })
      setFiltredData(data);
      setCacheRowData(data);
      setFiltersdata(data);
      const dataExp = Object.assign([], data);
      if (setDataExport) {
        setDataExport(dataExp);
      }
      // console.log(data);
    } catch (error) {
      // setIsActualWinsSetted(false);
      console.error('ERRORS Occured wile requestting getWinsCompany Api !')
    }
  }

  useEffect(() => {
    getBdcDemandHistory();
    setGridColDefs();
  }, [userData]);

  /**
   * AG Grid data table
   */

  // const bdcDefaultColDef = useMemo(() => {
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
    setSelectedListUsername([]);
    setSelectedListBdcDate([]);
    setSelectedListInvoiceDate([]);
    setSelectedListStatus([]);
    setSelectedListColumns([]);
    setTimeout(() => {
      setSelectedListColumns(columnsOptions);
      showAllColumns();
    }, 100);
    // console.log(statusOptions);
    // setFiltredData(pointsConversions);
  };

  const downloadPDF = (pdf) => {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "file.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const getPdf = async (row: getBdcInvoiceResponseApi, colId: string) => {
    if (row.bdcId && row.status == BDC_DEMAND_STATUS.TERMINATED) {
      const bdcDemandApi = new BdcDemandApi();
      const userUuid = userData.uuid;
      const params: getBdcInvoiceParamsApi = {
        userAdminUuId: userUuid,
        bdcId: row.bdcId,
        invoiceId: row.invoiceId,
      }
      let dataResp = null;
      if (colId == "bdcPdf") {
        dataResp = await bdcDemandApi.getBdcDetails(params);
      } else if (colId == "invoicePdf") {
        dataResp = await bdcDemandApi.getInvoiceDetails(params);
      }
      if (dataResp == null || dataResp && !dataResp.data || dataResp && dataResp.data?.length == 0 || dataResp && dataResp.data?.length > 0 && !dataResp.data[0]) {
        alert("Le document n'existe pas, veuillez contacter le support RewardzAi !");
      } else {
        const pdf = dataResp.data[0];
        downloadPDF(pdf);
      }

    } else {
      alert("Le status de la demndes n'est pas terminé !");
    }
  }

  const onRowClicked = e => {
    const row = e.data;
    const colId = e.api.getFocusedCell().column.colId;
    if (colId == "bdcPdf" || colId == "invoicePdf") {
      getPdf(row, colId);
      // alert(colId);
    } else {
      let rowData: getBdcInvoiceResponseApi | any = {};
      bdcColDefs.forEach(col => {
        let key = col.headerName;
        let colField = col.field;
        rowData[key] = row[colField];
      });
      setSelectedRow(rowData);
      const colData = e.event.target.innerHTML;
      setColFiledData(colData);
      setPosition({ x: e.event.clientX, y: e.event.clientY });
      setIsVisible(true);
    }
  };

  const showColumns = (selectedList: BdcInvoiceOption[], selectedItem: BdcInvoiceOption) => {
    const colDef = columnApi.api.getColumn(selectedItem.value);
    columnApi.api.setColumnVisible(colDef, true);
  };

  const hideColumns = (selectedList: BdcInvoiceOption[], selectedItem: BdcInvoiceOption) => {
    const colDef = columnApi.api.getColumn(selectedItem.value);
    columnApi.api.setColumnVisible(colDef, false);
  };

  const showAllColumns = () => {
    const bdcColDefs = columnApi.api.getColumns();
    columnApi.api.setColumnsVisible(bdcColDefs, true);
  };

  // if (isLoading || !pointsConversions || pointsConversions?.length == 0) {
  //   return <Loading type={LOADER_TYPE.PAGE} />;
  // }

  // if ((!isLoading && pointsConversions?.length > 0) || pointsConversions?.length > 0) {
  if (true) {
    {
      return (
        <div className={`${pointsStyle.gridPoints} ${isDisplayModal ? pointsStyle.gridPointsHeight : ''}`}>
          <div className={pointsStyle.gridPointsFilter}>
            <Multiselect
              singleSelect={true}
              options={bdcDateOptions} // Options to display in the dropdown
              onSelect={multiFilterData} // Function will trigger on select event
              onRemove={multiFilterData} // Function will trigger on remove event
              selectedValues={selectedListBdcDate}
              displayValue="label" // Property name to display in the dropdown options
              placeholder={formatMessage({ id: 'points.filter.bdcDate.placeholder' })}
              className={`input-group ${customMultiselect}`}
              showArrow={true}
              customArrow={true}

            />
            <Multiselect
              singleSelect={true}
              options={invoiceDateOptions} // Options to display in the dropdown
              onSelect={multiFilterData} // Function will trigger on select event
              onRemove={multiFilterData} // Function will trigger on remove event
              selectedValues={selectedListInvoiceDate}
              displayValue="label" // Property name to display in the dropdown options
              placeholder={formatMessage({ id: 'points.filter.invoiceDate.placeholder' })}
              className={`input-group ${customMultiselect}`}
              showCheckbox={true}
              showArrow={true}
              customArrow={true}
            />
            <Multiselect
              options={userOptions} // Options to display in the dropdown
              onSelect={multiFilterData} // Function will trigger on select event
              onRemove={multiFilterData} // Function will trigger on remove event
              selectedValues={selectedListUsername}
              displayValue="label" // Property name to display in the dropdown options
              placeholder={formatMessage({ id: 'points.filter.username.placeholder' })}
              className={`input-group ${customMultiselect}`}
              showCheckbox={true}
              showArrow={true}
              customArrow={true}
              selectedValueDecorator={(selectedList, _renderChip) => {
                console.log('_renderChip', _renderChip);
                console.log('selectedList', selectedList);
                return (
                  <div
                    style={{ display: selectedListUsername.length > 2 && selectedListUsername[0].value != _renderChip.value ? 'none' : 'block' }}
                    className={selectedListUsername.length > 2 && selectedListUsername[0].value != _renderChip.value ? 'hide-selected-items' : 'first-selected-item'}
                  >
                    {selectedListUsername.length <= 2 && selectedList}
                    {selectedListUsername.length > 2 && selectedListUsername.length + formatMessage({ id: 'ddl.selected.items' })}
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
              isLoading={false}
            />
          </div>
          <div className={`${pointsStyle.gridPointsContent} ag-theme-quartz`}>
            <AgGridReact
              rowData={filtredData}
              columnDefs={bdcColDefs}
              defaultColDef={bdcDefaultColDef}
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

export default BdcInvoiceCompanyHistory;



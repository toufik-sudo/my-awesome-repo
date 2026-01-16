import React, { useContext, useEffect, useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useHistory } from 'react-router';
import { UserContext } from '../../App';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import { PointConversionsList } from 'components/organisms/wall/pointConversions/PointConversionsList';
import { WALL_ROUTE } from 'constants/routes';
import { LOADER_TYPE, WALL_TYPE } from 'constants/general';
import { usePointConversionsPage } from 'hooks/pointConversions/usePointConversionsPage';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { isUserHyperAdmin } from 'services/security/accessServices';

import tableStyle from 'sass-boilerplate/stylesheets/components/tables/Table.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import bootstrap from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import postTabStyle from 'sass-boilerplate/stylesheets/components/wall/PostTabs.module.scss';
import pointsStyle from 'sass-boilerplate/stylesheets/components/launch/Points.module.scss';

import {
  LineChart,
  BarChart,
  Bar,
  LabelList,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { BalanceResponse, BalanceService } from 'api/huuray';
import { IPointsConverion } from 'interfaces/components/wall/Ipoints';
import { CatalogueParamsApi } from 'api/huuray/models/HuurayParams';
import { HuurayrequestService } from 'api/huuray/services/HuurayrequestService';
import Loading from 'components/atoms/ui/Loading';
import * as FileSaver from 'file-saver';
import XLSX from 'sheetjs-style';
// import { relative } from 'path';
import buttonStyle from 'assets/style/common/Button.module.scss';
import BdcInvoiceCompanyHistory from 'components/organisms/wall/BdcInvoiceCompany/BdcInvoiceCompanyHistory'
import { style } from 'sass-boilerplate/stylesheets/components/wall/PostList.module.scss';
import BdcDemandApi from 'api/BdcDemandApi';
import { GetExpiredWinsModelApi } from './bdcWinsDemand/BdcDemandModel';

/**
 * Component used for rendering point conversions table for hyper admins
 *
 * @constructor
 */
const PointConversionPage = () => {
  const history = useHistory();
  const { userData } = useContext(UserContext);
  const [balance, setBalance] = useState<any>({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [totalExpiredWins, setTotalExpiredWins] = useState(0);
  const [totalExpiredAmounts, setTotalExpiredAmounts] = useState(0);
  const [transactions, setTransactions] = useState(0);
  const [datatGraphProg, setDatatGraphProg] = useState<any>([]);
  const [datatGraphPlatform, setDatatGraphPlatform] = useState<any>([]);
  const [datatGraphUser, setDatatGraphGraphUser] = useState<any>([]);
  const [dataExport, setDataExport] = useState<any>([]);
  
  const [exportColDefs, setExportColDefs] = useState([]);
  const {
    pointsConversions,
    hasMore,
    isLoading,
    loadMore,
    scrollRef,
    listCriteria,
    onSort,
    onValidateSuccess
  } = usePointConversionsPage();
  console.log(pointsConversions)
  const { colorSidebar } = useSelectedProgramDesign();
  const {
    postTab,
    postTabList,
    postTabItem,
    postTabItemSelected,
    postTabItemPost,
    postTabItemTask,
    postTabBaseBlock,
    postTabBaseBlockOpen,
    postTabBaseBlockClosed,
    postIcon,
    postLine
  } = postTabStyle;

  const { overflowYauto, mt2 } = coreStyle;
  const [fileName, setFileName] = useState('');

  if (userData.highestRole && !isUserHyperAdmin(userData.highestRole)) {
    history.push(WALL_ROUTE);
    return null;
  }

  const getAllExpiredWins = async () => {
    let expiredWinsService = new BdcDemandApi();
    const data: GetExpiredWinsModelApi = await expiredWinsService.getAllExpiredWins(userData.uuid, null, null);
    const allExpiredWins = data.data.allExpiredWins || 0;
    setTotalExpiredWins(allExpiredWins);
    const allExpiredAmount = allExpiredWins * 0.04;
    setTotalExpiredAmounts(allExpiredAmount);

  }

  const getBalance = async () => {
    try {
      let huurayrequestService = new HuurayrequestService();
      let params: CatalogueParamsApi = huurayrequestService.getHuurayRequest();
      // const post =  CatalogueService.postV31Catalogue(params.xApiNonce, params.xApiHash, body);  
      const post = BalanceService.getV31Balance(params.xApiNonce, params.xApiHash);
      const response: any = await post;
      const data: BalanceResponse | any = await response;
      const balance = data.data ? data.data : data || {};
      setBalance(balance);
      // if (typeof result.Products == 'string') {
      //   products = JSON.parse(result.Products);
      // } else {
      //   products = result.Products;
      // }
      
    } catch (error) {
      console.log(error);
    }
  }

  const buildGraphicProgramPointsAmounts = () => {
    const data: IPointsConverion[] = pointsConversions;
    let arrProg = [];
    let arrUser = [];
    let arrPlatform = [];
    let totalAmount = 0;
    let totalUser = 0;
    const reduceArr = data.reduce((group, item) => {
      let progId = item.program.id;
      let platformId = item.platform.id;
      let userUuid = item.userUuid;
      if (!group[progId]) {
        group[progId] = [];
      }
      if (!group[platformId]) {
        group[platformId] = [];
      }
      if (userUuid) {
        if (!group[userUuid]) {
          group[userUuid] = [];
        }
        group[userUuid].push({ userUuid: userUuid, userName: item.name || userUuid, amount: item.amount, isUser: true });
      }
      group[progId].push({ programId: progId, amount: item.amount || 0, programName: item.program.name, isProgram: true });
      group[platformId].push({ platformId: platformId, amount: item.amount, platformName: item.platform.name, isPlatform: true });

      return group;
    }, {});
    Object.keys(reduceArr).forEach(key => {
      let arrElem = reduceArr[key];
      let amount = 0;
      let amountUser = 0;
      arrElem.forEach(element => {
        amount += element.amount || 0;
        if (element.isProgram) {
          totalAmount += element.amount || 0;
        }
        if (element.isUser) {
          amountUser += element.amount || 0;
        }
      });
      if (arrElem[0].isProgram) {
        arrProg.push({ programId: key, programName: arrElem[0].programName, programAmount: amount });
      } else if (arrElem[0].isPlatform) {
        arrPlatform.push({ platformId: key, platformName: arrElem[0].platformName, platformAmount: amount });
      } else if (arrElem[0].isUser) {
        arrUser.push({ userUuid: arrElem[0].userUuid, userName: arrElem[0].userName, userAmount: amountUser });
        totalUser += 1;
      }
    });
    setTotalAmount(totalAmount);
    setDatatGraphProg(arrProg);
    setDatatGraphPlatform(arrPlatform);
    setTransactions(pointsConversions.length || 0);
    setDatatGraphGraphUser(arrUser);
    setTotalUser(totalUser);
  }
  
  useEffect(() => {
    if(userData && userData.uuid){
      getAllExpiredWins();
      getBalance();
    }
  }, [userData]);

  useEffect(() => {
    // getBalance();
    buildGraphicProgramPointsAmounts();
  }, [isLoading]);


  const CustomTooltipProgram = ({ active, payload, label }) => {
    console.log(payload);
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ background: 'white', border: '1px solid #82ca9d', borderRadius: '5px', padding: '10px' }}>
          <p className="label">{`${payload[0].payload.programName} ( ${payload[0].payload.programId} )`}</p>
          <p className="intro" style={{ color: '#82ca9d' }}>{`Total : ${payload[0].payload.programAmount}  EUR`}</p>
        </div>
      );
    }

    return null;
  };

  const CustomTooltipPlatform = ({ active, payload, label }) => {
    console.log(payload);
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ background: 'white', border: '1px solid #8884d8', borderRadius: '5px', padding: '10px' }}>
          <p className="label">{`${payload[0].payload.platformName} ( ${payload[0].payload.platformId})`}</p>
          <p className="intro" style={{ color: '#8884d8' }}>{`Total : ${payload[0].payload.platformAmount} EUR`}</p>
        </div>
      );
    }

    return null;
  };
  
  const CustomTooltipUser = ({ active, payload, label }) => {
    console.log(payload);
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ background: 'white', border: '1px solid #8884d8', borderRadius: '5px', padding: '10px' }}>
          <p className="label">{`${payload[0].payload.userName}`}</p>
          <p className="intro" style={{ color: '#8884d8' }}>{`Total : ${payload[0].payload.userAmount} EUR`}</p>
        </div>
      );
    }

    return null;
  };

  /**
   * Export Hist to excel
   */
  
  const exportToExcel = (e)=>{
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    let excelData = [];
    dataExport.forEach((row: any) => {
      let obj: any = {};
      exportColDefs.forEach(col=>{
        obj[col.headerName] = row[col.field];
      });
      excelData.push(obj);
    });
    exportAsExcel(excelData, 'Historique_des_points');
  }

  const exportAsExcel = async(excelData, fileName)=>{
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    const fileExt = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new() ;
    wb.Sheets = {'data': ws};
    wb.SheetNames = ['data']; 
    const excelBuffer = XLSX.write(wb , {bookType : 'xlsx', type: 'array'});
    const data = new Blob([excelBuffer], {type : fileType});
    FileSaver.saveAs(data, fileName + fileExt);
  }

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <div className={`${tableStyle.table}  ${coreStyle.px3}`}>
        {/* <div
          className={`${tableStyle.tableHeaderResponsiveMobile} ${coreStyle.py3} ${bootstrap['text-white']} ${tableStyle.tablePage} ${coreStyle.px6} ${coreStyle['flex-space-between']}`}
          style={{ backgroundColor: colorSidebar }}
        /> */}
        <Tabs className={postTab} style={{fontSize: "1.8rem"}}>
          <TabList className={pointsStyle.pointsTabList} style={{cursor: 'pointer'}}>
            <Tab key='0'
              selectedClassName={postTabItemSelected}
              style={{ color: '#78bb7bcf' }}
            >
              Historique des convertions
            </Tab>
            <Tab key = '1'
              selectedClassName={postTabItemSelected}
              style={{ color: '#EC407A' }}
            >
              Les graphes
            </Tab>
            <Tab key = '2'
              selectedClassName={postTabItemSelected}
              style={{ color: coreStyle.secondaryColor }}
            >
              Historique des BDC
            </Tab>

            <Tab key = '3' style={{position: 'relative', left: '70%'}} >
              <button className={buttonStyle.secondary}  onClick={exportToExcel}>Export excel</button>
            </Tab>
          </TabList>

          <TabPanel>
            <PointConversionsList
              {...{ hasMore, loadMore, scrollRef, isLoading, pointsConversions, listCriteria, onSort, onValidateSuccess,  setDataExport, setExportColDefs, setFileName }}
            />
          </TabPanel>
          <TabPanel>
            {/* <ResponsiveContainer width="100%" height="100%"> */}
            {(isLoading || hasMore) && <Loading type={LOADER_TYPE.DROPZONE} className={mt2} />}
            {(!isLoading && !hasMore) &&
              <div>
                <div style={{
                  display: 'grid',
                  columnGap: '2rem',
                  gridTemplateColumns: '80% 20%',
                  marginBottom: '2rem'
                }}>
                  <BarChart
                    width={500}
                    height={300}
                    data={datatGraphProg}
                    margin={{
                      top: 20,
                      right: 15,
                      left: 15,
                      bottom: 5
                    }}
                  >
                    <XAxis dataKey="programName" />
                    <YAxis label={{ value: 'Montant (EUR)', angle: -90, position: 'insideLeft' }} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.9} />
                    <Tooltip render={()=> <CustomTooltipProgram/>} />
                    <Legend />
                    {/* <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />
                    <ReferenceLine y={9800} label="Max" stroke="red" /> */}
                    <Bar name="Programme" type="monotone" dataKey="programAmount" fill="#82ca9d" barCategoryGap={20} barGap={5} barSize={30} >
                      <LabelList dataKey="programAmount" position="top" fill="#82ca9d" />
                    </Bar>
                    {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                  </BarChart>

                  <div style={{ fontSize: '2rem' }}>
                    <p><b style={{ color: '#68758b' }}>Balance Hurray : </b> {`${balance && balance.Balances?.length > 0 ? balance.Balances[0].Balance / 100 : 0} ${balance && balance.Balances?.length > 0 ? balance.Balances[0].Currency : 'EUR'}`}</p> <br />
                    <p><b style={{ color: '#68758b' }}>Total converti : </b> {`${totalAmount} EUR`}</p> <br />
                    <p><b style={{ color: '#68758b' }}>Total des transactions : </b> {`${transactions}`}</p> <br />
                    <p><b style={{ color: '#68758b' }}>Total des Utilisateurs : </b> {`${totalUser}`}</p><br />
                    <p><b style={{ color: '#68758b' }}>Total des Wins non consommés : </b> {`${totalExpiredWins} Wins`}</p><br />
                    <p><b style={{ color: '#68758b' }}>Montant total du non consommés : </b> {`${totalExpiredAmounts} EUR`}</p>
                  </div>
                </div>
                <div style={{
                    display: 'grid',
                    columnGap: '2rem',
                    gridTemplateColumns: '50% 50%'
                  }}>
                  <BarChart
                    width={500}
                    height={300}
                    data={datatGraphPlatform}
                    margin={{
                      top: 20,
                      right: 15,
                      left: 15,
                      bottom: 5
                    }}
                  >
                    <XAxis dataKey="platformName" />
                    <YAxis label={{ value: 'Montant (EUR)', angle: -90, position: 'insideLeft' }} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.9} />
                    <Tooltip content={<CustomTooltipPlatform />} />
                    <Legend />
                    {/* <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />
                    <ReferenceLine y={9800} label="Max" stroke="red" /> */}
                    <Bar maxBarSize="20" name="Platform" type="monotone" dataKey="platformAmount" fill="#8884d8" barCategoryGap={30} barGap={5} barSize={30} >
                      <LabelList dataKey="platformAmount" fill="#8884d8" position="top" />
                    </Bar>
                    {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                  </BarChart>

                  <BarChart
                    width={500}
                    height={300}
                    data={datatGraphUser}
                    margin={{
                      top: 20,
                      right: 15,
                      left: 15,
                      bottom: 5
                    }}
                  >
                    <XAxis dataKey="userName" />
                    <YAxis label={{ value: 'Montant (EUR)', angle: -90, position: 'insideLeft' }} />
                    <CartesianGrid strokeDasharray="3 3" opacity={0.9} />
                    <Tooltip content={<CustomTooltipUser />} />
                    <Legend />
                    {/* <ReferenceLine x="Page C" stroke="red" label="Max PV PAGE" />
                      <ReferenceLine y={9800} label="Max" stroke="red" /> */}
                    <Bar maxBarSize="20" name="Utilisateur" type="monotone" dataKey="userAmount" fill="#6b6e8d" barCategoryGap={30} barGap={5} barSize={30} >
                      <LabelList dataKey="userAmount" fill="#6b6e8d" position="top" />
                    </Bar>
                    {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
                  </BarChart>
                </div>
              </div>
            }
            {/* </ResponsiveContainer> */}
          </TabPanel>
          <TabPanel>
            <BdcInvoiceCompanyHistory  setDataExport={setDataExport} setExportColDefs ={setExportColDefs} setFileName={setFileName}/>
          </TabPanel>
        </Tabs>
      </div>
    </LeftSideLayout>
  );
};

export default PointConversionPage;
import React, { useContext, useEffect, useState } from 'react';
import coreStyle from "sass-boilerplate/stylesheets/style.module.scss";
import EcardPage from '../../EcardPage';
import postTabStyle from 'sass-boilerplate/stylesheets/components/wall/PostTabs.module.scss';
import pointsStyle from 'sass-boilerplate/stylesheets/components/launch/Points.module.scss';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import TextInput from 'components/atoms/ui/TextInput';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import inputStyle from 'assets/style/common/Input.module.scss';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import buttonStyle from 'assets/style/common/Button.module.scss';
import Button from 'components/atoms/ui/Button';
import { useIntl } from 'react-intl';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import BdcDemandApi from 'api/BdcDemandApi';
import { UserContext } from 'components/App';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { BdcDemandModelApi, companyModelApi, setBdcDemandModelApi, BDC_DEMAND_STATUS } from './BdcDemandModel';
import { PENDING } from 'constants/wall/users';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import style from 'sass-boilerplate/stylesheets/components/wall/PostMedia.module.scss';
import styles from 'assets/style/components/BDC/BdcWinsDemandModal.module.scss'
const { withBoldFont, displayFlex, mt2, mb2, textLeft, mt1, bfVisibilityHidden } = coreStyle;
import request, { AxiosError } from "axios";
import axios from 'axios';
import { components } from 'react-select';



const { pt3, pb3 } = coreStyle;

const BdcWinsDemand = ({onRewardsRedirectClick}) => {

  const [isActualWinsSetted, setIsActualWinsSetted] = useState<boolean>(false);
  const [etsActualAccount, setEtsActualAccount] = useState<number>();
  const [etsActualAccountWins, setEtsActualAccountWins] = useState<number>();
  
  
  const [bdCDemandAmount, setBdcDemandAmount] = useState<number>();
  const [bdcDemandAmountTxt, setBdcDemandAmountTxt] = useState<string>();
  const [bdcDemandAmountWins, setBdcDemandAmountWins] = useState<number>();
  const [companyWins, setCompanyWins] = useState<companyModelApi>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOK, setIsOk] = useState(false);
  const [isLimit, setIsLimit] = useState(false);
  const [isSameAmount, setIsSameAmount] = useState(false);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [isWarning, setIsWarning] = useState(false);
  const {
    inputBlock,
    customTextInputBcd,
    marginTop0,
    cardTemplate,
    cardTemplateConvert,
    bdcDemand,
    bdcDemandInput
  } = eCardStyle;

  const { formatMessage } = useIntl();
  const { userData } = useContext(UserContext);
  const { selectedProgramId, selectedPlatform: { id: platformId } } = useWallSelection();

  const getActualWinsCompany = async ()=>{
    try {
      const bdcDemandApi = new BdcDemandApi();
      const userUuid = userData.uuid;
      const data: BdcDemandModelApi = await bdcDemandApi.getWinsCompany(selectedProgramId, userUuid);
      
      
      console.log("HADA DATA: " + {data})
      setEtsActualAccountWins(data.data.wallletCompany.wins);  
      setCompanyWins(data.data.company); 
      setIsActualWinsSetted(true);
      // const data1: BdcDemandModelApi = await bdcDemandApi.getBdcDemandHistory();
      // console.log(data1);
      } catch (error) {
      setIsActualWinsSetted(false);
      
      console.error('ERRORS Occured wile requestting getWinsCompany Api !')
    }
  }

  const getEtsActualAccount = () => {
    
    // if (etsActualAccount && etsActualAccount > 0) {
    //   const wins = etsActualAccount / 0.04;
    //   setEtsActualAccountWins(wins);
    // }
  }

  useEffect(() => {
    getActualWinsCompany();
    // getEtsActualAccount();
  }, [])

  
  const sendBdcDemand = async(isUserAcceptDuplicatedAmounts: boolean) =>{
    setIsOk(false);
    setIsLimit(false);
    setIsSameAmount(false);
    if (isActualWinsSetted && bdCDemandAmount && parseFloat(bdCDemandAmount?.toString()) > 0) {
      const bdcDemandApi = new BdcDemandApi();
      const userUuid = userData.uuid;
      let body : setBdcDemandModelApi = {
        platformId: platformId,
        userAdminUuId:userUuid,
        bdcId: '', 
        bdcDateExp:'',
        invoiceId:'',
        invoiceDate:'',
        amount: parseFloat(bdCDemandAmount?.toString()||'') ,
        wins: bdcDemandAmountWins,
        companyIban: companyWins.iban,
        companyBic: companyWins.bic,
        companySiretSiren: companyWins.siretSiren,
        status: BDC_DEMAND_STATUS.PENDING,
        comment: "",
        errorCode: null,
        errorMsg: null,
        isUserAcceptDuplicatedAmounts : isUserAcceptDuplicatedAmounts,
        isBdcSending: true

      }
      try {
        const data = await bdcDemandApi.setBdcDemandHisory(body);
        setModalMessage("bdc.modal.ok");
        setIsOk(true);
        setIsLimit(false);
        setIsSameAmount(false);
        // closeModal(isOk, isSameAmount, isLimit );
        // setIsModalOpen(true);
        showModal(true, false, false );
      }  catch(err) {
        // body.errorCode = error.code;
        // body.errorMsg = error.message;
        // const data = await bdcDemandApi.updateBdcDemanHistory(body);
        const errors = err as AxiosError;
        // if(!axios.isAxiosError(error)){
        //   // do whatever you want with native error
        // }
        console.log(errors?.response)
        console.error('ERRORS Occured wile requestting getWinsCompany Api !');
        setIsOk(false);
        const isLimit  = errors?.response.data?.field == "USER LIMIT";
        const isSameAmount  = errors?.response.data?.field == "SAME AMOUNT";
        // const errorMsg =  errors?.response.data.message ? errors?.response.data.message : "Erreurs lors de l'envoi du bon de commande";
        setIsLimit(isLimit);
        setIsSameAmount(isSameAmount );
        setModalMessage("bdc.modal.error");
        showModal(false, isSameAmount, isLimit);
      }
      
    } else {
      alert('Erreurs lors de la récupération des wins, veuillez contacter le support Yoowin')
    }
  }

  const currencyFormatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2

  });

  const nbrFormatter = new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  });

  const setBdcDemandAmountFn = (value) => {
    if (value) {
      if (value.indexOf('€') > 0 || value.indexOf(',') > 0) {
        value = parseFloat(value.replaceAll('€', '').replaceAll(',','.').replace(/[^\d.]/g, ""));        
      }
      setBdcDemandAmount(value);
      const wins = value / 0.04;
      setBdcDemandAmountWins(wins);
      setBdcDemandAmountTxt(value);
    }
  }

  const onMouseOut = (value)=>{
    setBdcDemandAmountTxt(currencyFormatter.format(value));
  }
  const onMouseIn = (value)=>{
    if (value.indexOf('€') > 0 || value.indexOf(',') > 0) {
      value = parseFloat(value.replaceAll('€', '').replaceAll(',','.').replace(/[^\d.]/g, ""));        
    }
    setBdcDemandAmountTxt(value);
  }

  const onClickOk = ()=>{
    setIsModalOpen(false)
  }

  const onClickOkWarning = ()=>{
    setIsModalOpen(false)
    sendBdcDemand(true)
  }

  const closeModal = (isOk, isSameAmount, isLimit)=>{
    onRewardsRedirectClick();
  }

  const showModal = (isOk, isSameAmount, isLimit)=>{
    if(isOk){
      setModalMessage("bdc.modal.ok")
      setIsWarning(false)
      setIsModalOpen(true)
    }else{
      if(isLimit){
        setModalMessage("bdc.limitError.modal")
        setIsWarning(false)
        setIsModalOpen(true)
      }
      if(isSameAmount){
        setModalMessage("bdc.sameAmountError.modal")
        setIsWarning(true)
        setIsModalOpen(true)
      } else {
        setModalMessage('bdc.default.error');
        setIsWarning(false)
        setIsModalOpen(true)
      }
    }
  }



  return (
    <div className={bdcDemand}>
      <div className={`${inputBlock} ${bdcDemandInput}`}>
        {/* <TextInput
          value={currencyFormatter.format(etsActualAccount)}
          disabled={true}
          onChange={({ target }) => null}
          wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${customTextInputBcd}`}
          hasLabel={true}
          labelId="bdcDemand.etsActualAccount"
        /> */}
        <TextInput
          value={nbrFormatter.format(etsActualAccountWins)}
          disabled={true}
          onChange={({ target }) => null}
          wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${customTextInputBcd}`}
          hasLabel={true}
          labelId="bdcDemand.etsActualAccountWins"
        />
        <DynamicFormattedMessage
          tag="span"
          className={`${coreStyle.mxAuto}`}
          id="bdcDemand.bdcDemandQuestion"
        />
        <TextInput
          value={bdcDemandAmountTxt}
          disabled={false}
          onChange={({ target }) => setBdcDemandAmountFn(target.value)}
          wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${customTextInputBcd}`}
          hasLabel={true}
          labelId="bdcDemand.bdcDemandAmount"
          onBlur = {({ target }) => onMouseOut(target.value)}
          onFocus = {({ target }) => onMouseIn(target.value)}
        />
        <TextInput
          value={nbrFormatter.format(bdcDemandAmountWins || 0)}
          disabled={true}
          onChange={({ target }) => null}
          wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${customTextInputBcd}`}
          hasLabel={true}
          labelId="bdcDemand.bdcDemandAmountWins"
        />
      </div>

      <Button
        onClick={()=>{sendBdcDemand(false)}}
        type={BUTTON_MAIN_TYPE.SECONDARY}
        disabled={!(bdCDemandAmount && parseFloat(bdCDemandAmount?.toString()) > 0)}
        className={`${marginTop0}`}
      >
        {formatMessage({ id: 'btn.label.sendBdcDemand' })}
      </Button>
      
      <FlexibleModalContainer
        className={`${styles.modalContainer}`}
        fullOnMobile={false}
        closeModal={() => onRewardsRedirectClick()}
        isModalOpen={isModalOpen}
      >
        <div>
          <div className={styles.modalText}>
            <DynamicFormattedMessage
              tag="span"
              className={coreStyle.mxAuto}
              id={modalMessage}
            />
          </div>
          <div className={styles.buttonContainer}>
            {!isWarning && !isLimit && isOK && (
              <DynamicFormattedMessage
                onClick={() => onClickOk()}
                tag={Button}
                className={coreStyle.mxAuto}
                id="label.yes.modal"
              />
            )}
            {isWarning && (
              <DynamicFormattedMessage
                onClick={() => onClickOkWarning()}
                tag={Button}
                className={coreStyle.mxAuto}
                id="label.warning.modal"
              />
            )}
            <DynamicFormattedMessage
              onClick={() => onRewardsRedirectClick()}
              tag={Button}
              className={coreStyle.mxAuto}
              id="label.no.modal"
            />
          </div>
        </div>
      </FlexibleModalContainer>
    </div>

  )
}

export default BdcWinsDemand;
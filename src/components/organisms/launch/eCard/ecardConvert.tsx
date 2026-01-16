/* eslint-disable quotes */
import React, { ChangeEvent, useEffect, useState } from 'react';
import MediaBlock from 'components/molecules/wall/postBlock/media/MediaBlock';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import Multiselect from 'multiselect-react-dropdown';
import { useIntl } from 'react-intl';
import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
// import useDashboardNumber from 'hooks/wall/useDashboardNumber';
// import { getUserCookie } from 'utils/general';
import { HTML_TAGS, LOADER_TYPE, USER_COOKIE_FIELDS } from 'constants/general';
import useUpdateUserData from 'hooks/wall/useUpdateUserData';
import { OrderRequest, OrderResponse, OrderService } from 'api/huuray';
import { HuurayrequestService } from 'api/huuray/services/HuurayrequestService';
import { CatalogueParamsApi } from 'api/huuray/models/HuurayParams';
import TextInput from 'components/atoms/ui/TextInput';
import inputStyle from 'assets/style/common/Input.module.scss';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { POINT_VALUE } from 'constants/wall/launch';
import PointConversionsApi from 'api/PointConversionsApi';
import { POINT_CONVERSION_VALIDATE_OPERATION, POINT_CONVERSION_DECLINE_OPERATION } from 'constants/api';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import style from 'assets/style/components/Modals/LogoutModal.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Loading from 'components/atoms/ui/Loading';
import buttonStyle from 'assets/style/common/Button.module.scss';

export interface EcardOption {
  readonly value?: string;
  readonly label?: string;
  readonly color?: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
  readonly isCats?: boolean;
}

/**
 * Page component used to render EcardContent content section
 *
 * @constructor
 */
const EcardConVert = ({
  element,
  totalPoints,
  setTotalPoints,
  totalAmount,
  setTotalAmount,
  setShowConvertionEcard,
  programDetails
}) => {
  const [showModal, setShowModal] = useState(false);
  // const [showConvertionEcard, setShowConvertionEcard] = useState(false);
  const [denominations, setDenominations] = useState < EcardOption[] > ([]);
  const [selectedConvertAmount, setSelectedConvertAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [titleId, setTitleId] = useState('');
  const [isInError, setIsInError] = useState(false);

  const { formatMessage } = useIntl();
  // const [eCardSelectedList, setEcardSelectedList] = useState<ProductFromCatalogue[]>([]);
  const {
    cardContent,
    cardElemConvert,
    cardCountryText,
    active,
    card,
    cardCountryTextConvert,
    cardContentConvert,
    blockFilter,
    inputBlock,
    blockFilterCatConvert,
    customMultiselect,
    blockFilterBrand,
    paddingLeft5,
    searchBar,
    cardConvert,
    marginTop10,
    paddingLeft20,
    customTextInput,
    limitWidthMultiSelect,
    marginTop0,
    marginBottom15,
    iconTitle
  } = eCardStyle;
  const { logOutModal, title } = style;

  const onCancel = () => {
    setIsVisible(false);
  };

  const onDisplayPopup = (isOrderError?: boolean, isUpdateError?: boolean, isAmountError?: boolean) => {
    setIsConverting(false);
    setIsInError(true);
    if (isOrderError) {
      setTitleId('wall.beneficiary.wins.demand.ko');
    } else if (isUpdateError) {
      setTitleId('wall.beneficiary.wins.demand.ko');
    } else if (isAmountError) {
      setIsInError(false);
      setTitleId("wall.beneficiary.wins.notSuffisent");
    } else {
      setIsInError(false);
      setTitleId('wall.beneficiary.wins.demand.ok');
    }
    setIsVisible(true);
  };

  // const { points, isBeneficiary, isPointsComponentLoading } = useDashboardNumber();
  const {
    linkedEmails,
    formLoading,
    setFormLoading,
    avatarContext,
    fields,
    userData,
    personalInformationFields,
    userEmail,
    setUserEmail,
    personalInformation,
    imageError,
    setImageError,
    safeToDelete
  } = useUpdateUserData();
  // let uuid = getUserCookie(USER_COOKIE_FIELDS.UUID);
  const username = userData['firstName'] + ' ' + userData['lastName'];
  const email = userData['email'];
  const phone = userData['mobilePhoneNumber'] ? userData['mobilePhoneNumber'] : userData['phoneNumber'] || null;
  const uuid = userData['uuid'];
  let programId: any = Object.keys(programDetails)[0];
  programId = parseInt(programId);
  const program = programDetails[programId];
  const companyName = program ? program.design?.companyName : '';

  useEffect(() => {
    const array = element.Denominations && element.Denominations != '' ? element.Denominations.split(',') : [];
    const p = [];
    array.forEach(elem => {
      const val = parseInt(elem?.trim());
      if (val && val <= totalPoints) {
        p.push({
          value: val,
          label: `${val} ${element.Currency}`,
          color: '',
          isFixed: false,
          isDisabled: false,
          isCats: false
        });
      }
    });
    setDenominations(p);
  }, []);

  const createUpdatePointsConversion = async (
    // params: CatalogueParamsApi,
    selectedConvertAmount,
    programId,
    pointConversion,
    isUpdate
  ) => {
    const body: OrderRequest | any = !isUpdate
      ? {
        programId: programId,
        currency: element.Currency,
        quantity: 1,
        productToken: element.ProductToken,
        brandName: element.BrandName,
        points: selectedConvertAmount / 0.04,
        amount: selectedConvertAmount,
        deliveryTemplateId: 2607,
        sync: false,
        personalMessage: 'Your Gift Card !!!',
        // transactionRefId: params.xApiNonce + '-' + uuid,
        email: email,
        name: username,
        phone: phone,
        userUuid: uuid
      }
      : pointConversion;

    try {
      const pointConversionsApi = new PointConversionsApi();
      const data = (await !isUpdate)
        ? pointConversionsApi.postPointConversions(body)
        : pointConversionsApi.validatePointConversion(pointConversion);
      return data;
    } catch (error) {
      toast('Errors occured when perform update points conversion !!!');
      return null;
    }
  };

  // const setOrder = async params => {
  //   const body: OrderRequest = {
  //     Product: {
  //       Currency: element.Currency,
  //       Quantity: 1,
  //       Token: element.ProductToken,
  //       Value: selectedConvertAmount
  //     },
  //     DeliveryTemplateId: 2607,
  //     Sync: false,
  //     PersonalMessage: 'Your Gift Card !!!',
  //     RefID: params.xApiNonce + '-' + uuid,
  //     Recipients: [
  //       {
  //         Email: email,
  //         Name: username,
  //         Phone: phone,
  //         RefID: companyName || 'RewardzAi'
  //       }
  //     ]
  //   };
  //   let orderUuid = '';
  //   try {
  //     // let orderUuid = '564497941-5949-4494';
  //     const post = OrderService.postV31Order(params.xApiNonce + '646666rzv4664', params.xApiHash, body);
  //     const response: any = await post;
  //     const data: OrderResponse = await response;
  //     orderUuid = data.OrderUID;
  //     const remained = totalAmount - selectedConvertAmount;
  //     setTotalAmount(remained);
  //     const points = totalPoints - remained / 0.04;
  //     setTotalPoints(points);
  //     setShowConvertionEcard(false);

  //     return { orderUuid: orderUuid, isError: false, error: null };
  //   } catch (error) {
  //     return { orderUuid: null, isError: true, error: error };
  //   }
  // };

  const convertPoints = async () => {
    if (selectedConvertAmount && selectedConvertAmount != 0 && selectedConvertAmount < totalAmount) {
      setIsConverting(true);
      // const huurayrequestService = new HuurayrequestService();
      // const params: CatalogueParamsApi = huurayrequestService.getHuurayRequest();
      let programId: any = Object.keys(programDetails)[0];
      programId = parseInt(programId);

      try {
        const resp: any = await createUpdatePointsConversion(selectedConvertAmount, programId, {}, false);
        onDisplayPopup(false, false, false);
      } catch (errror) {
        onDisplayPopup(true, false, false);
      }

      // if (resp) {
      //   const respOrder = await setOrder(params);
      //   if (!respOrder.isError && respOrder.orderUuid) {
      //     const updatePointsConversionOk = await createUpdatePointsConversion(
      //       params,
      //       selectedConvertAmount,
      //       programId,
      //       {
      //         id: resp.id,
      //         orderUuid: respOrder.orderUuid,
      //         operation: POINT_CONVERSION_VALIDATE_OPERATION
      //       },
      //       true
      //     );
      //     onDisplayPopup(false, false, false);
      //   } else {
      //     const updatePointsConversionKo = await createUpdatePointsConversion(
      //       params,
      //       selectedConvertAmount,
      //       programId,
      //       {
      //         id: resp.id,
      //         operation: POINT_CONVERSION_DECLINE_OPERATION,
      //         errorCode: respOrder.error.body.Status,
      //         errorMessage: respOrder.error.body.Message
      //       },
      //       true
      //     );
      //     onDisplayPopup(true, false);
      //   }
      // }
      // else {
      //   // toast(formatMessage({ id: actionSuccessMessageId }));
      //   toast('Errors occured when perform update points conversion !!!');
      // }
    } else {
      onDisplayPopup(false, false, true);
      // console.info ('Amount is not suffisante to convert !!!');
    }
  };

  function setSelectedAmount(event: ChangeEvent<HTMLInputElement> | EcardOption[] | any): void {
    if (event.target && event.target.value) {
      const val = parseInt(event.target.value) || 0;
      setSelectedConvertAmount(val);
    } else if (event && event.length > 0) {
      const val = event[0].value ? event[0].value : 0;
      setSelectedConvertAmount(val);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function setTextValue(_arg0: { otherProductName: any; key: string }) {

  }

  return (
    <>
      {isConverting && <Loading type={LOADER_TYPE.FULL_PAGE} className={coreStyle.mt2} />}
      <div className={`${cardConvert}`}>
        <div className={active}>
          <div className={`card-body ${cardElemConvert}`}>
            <MediaBlock
              mediaType="image"
              showModal={false}
              setShowModal={setShowModal}
              media={{
                url: element.LogoFile, //file and video
                ext: element.LogoFile?.substring(element.LogoFile?.lastIndexOf('.') + 1) || 'jpg',
                src: element.LogoFile, //src for image
                size: 100,
                title: 'Bloc image file',
                alt: 'Bloc image file'
              }}
            />
            <h5 className="card-title">{element.BrandName}</h5>
          </div>
        </div>
      </div>
      <div className={`${marginTop10} ${marginBottom15}`}>
        <DynamicFormattedMessage tag="p" id="launchProgram.rewards.note" values={{ pointValue: POINT_VALUE }} />
      </div>
      <div className={inputBlock}>
        <TextInput
          value={totalPoints}
          disabled={true}
          onChange={({ target }) => setTextValue({ otherProductName: target.value, key: 'POINTS' })}
          wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${customTextInput}`}
          hasLabel={true}
          labelId="eCard.filter.remainedPoints"
        />
        <TextInput
          value={`${totalAmount} ${element.Currency}`}
          disabled={true}
          onChange={({ target }) => setTextValue({ otherProductName: target.value, key: 'AMOUNT' })}
          wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${customTextInput}`}
          hasLabel={true}
          labelId="eCard.filter.remainedAmount"
        />
        <TextInput
          value={username}
          disabled={true}
          onChange={({ target }) => setTextValue({ otherProductName: target.value, key: 'USERNAME' })}
          wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${customTextInput}`}
          hasLabel={true}
          labelId="eCard.filter.username"
        />
        <TextInput
          value={email}
          disabled={true}
          onChange={({ target }) => setTextValue({ otherProductName: target.value, key: 'EMAIL' })}
          wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${customTextInput}`}
          hasLabel={true}
          labelId="eCard.filter.email"
        />
        <TextInput
          value={phone || ''}
          disabled={true}
          onChange={({ target }) => setTextValue({ otherProductName: target.value, key: 'PHONE' })}
          wrapperClass={`${inputStyle.container} ${inputStyle.floating} ${customTextInput}`}
          hasLabel={true}
          labelId="eCard.filter.phone"
        />
        {/* <div className={`${'input-group'} ${blockFilter} ${blockFilterBrand}`}>
          <label className={`input-group-label ${paddingLeft5}`} > {formatMessage({ id: 'eCard.filter.username' })} </label>
          <input disabled={true} className={`'form-control ' ${searchBar}`}
            id='adresse' type="text" value={adresse} />
        </div> */}
        {(!element.Denominations || element.Denominations == '') && (
          <TextInput
            value={denominations}
            onChange={({ target }) => setTextValue({ otherProductName: target.value, key: 'DENOMINATIONS' })}
            wrapperClass={`${inputStyle.container} ${inputStyle.floating}`}
            hasLabel={true}
            labelId="eCard.filter.denominatioputns"
          />
        )}

        {element.Denominations && element.Denominations != '' && (
          <Multiselect
            singleSelect={true}
            options={denominations} // Options to display in the dropdown
            onSelect={setSelectedAmount} // Function will trigger on select event
            // onRemove={multiFilterData} // Function will trigger on remove event
            displayValue="label" // Property name to display in the dropdown options
            // disable={isAllCheckedFilter}
            placeholder={formatMessage({ id: 'eCard.filter.denominations' })}
            className={`input-group ${customMultiselect} ${paddingLeft20} ${limitWidthMultiSelect}`}
            showCheckbox={false}
            showArrow={true}
            customArrow={true}
          />
        )}
      </div>
      <div>
        <FlexibleModalContainer
          fullOnMobile={false}
          className={logOutModal}
          closeModal={onCancel}
          isModalOpen={isVisible}
          animationClass={coreStyle.widthFull}
        >
          <div className={coreStyle.widthFull} style={{ whiteSpace: "pre-line" }}>
            <DynamicFormattedMessage tag={HTML_TAGS.H4} className={`${title} ${iconTitle}`} id={titleId} />
            {isInError && (
              <h4 style={{ position: 'relative', top: '-54px', left: '50%' }} className={iconTitle}>
                <a
                  href="mailto: support@rewardzai.com"
                  target="_blank"
                  onClick={() => {
                    setIsVisible(false);
                  }}
                >
                  <FontAwesomeIcon icon={faQuestionCircle}></FontAwesomeIcon>
                </a>
              </h4>
            )}
            <DynamicFormattedMessage tag={Button} onClick={onCancel} id="modal.confirmation.ok" />
          </div>
        </FlexibleModalContainer>
        <Button
          onClick={convertPoints}
          type={BUTTON_MAIN_TYPE.SECONDARY}
          disabled={!selectedConvertAmount || selectedConvertAmount == 0}
          className={`${marginTop0} ${selectedConvertAmount && selectedConvertAmount > 0 ? '' : buttonStyle.disabled}`}
        >
          {formatMessage({ id: 'btn.label.convertPoints' })}
        </Button>
      </div>
    </>
  );
};

export default EcardConVert;

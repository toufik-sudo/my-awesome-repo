/* eslint-disable react/jsx-key */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { ProductFromCatalogue } from 'api/huuray/models/ProductFromCatalogue';
import MediaBlock from 'components/molecules/wall/postBlock/media/MediaBlock';
import React, { useEffect, useState } from 'react';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import DesignNextStep from 'components/atoms/launch/design/DesignNextStep';
// import { useEcardDataSave } from 'hooks/launch/eCards/useEcardDataSave';
import { ECARD_SELECTED_LIST } from 'constants/wall/launch';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import { useDispatch } from 'react-redux';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { useIntl } from 'react-intl';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import Button from 'components/atoms/ui/Button';
import style from 'sass-boilerplate/stylesheets/components/wall/PostMedia.module.scss';
import EcardConVert from './ecardConvert';
import useDashboardNumber from 'hooks/wall/useDashboardNumber';
import { getUserAuthorizations, isAnyKindOfAdmin } from 'services/security/accessServices';
import { useUserRole } from 'hooks/user/useUserRole';
import { BUTTON_MAIN_TYPE } from 'constants/ui';


/**
 * Page component used to render EcardContent content section
 *
 * @constructor
 */
const EcardContent = ({
  eCardList,
  eCardFiltredList,
  allCheckedList,
  setAllCheckedList,
  eCardSelectedList,
  setEcardSelectedList,
  isConversionEcard,
  programDetails,
  setDataStep,
  ecardDataSave,
  isShowValidateStateEcard,
  setIsShowValidateStateEcard,
  canConvert
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showConvertionEcard, setShowConvertionEcard] = useState(false);
  const [showValidateEcard, setShowValidateEcard] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const { formatMessage } = useIntl();
  const [eCardSelected, setEcardSelected] = useState < ProductFromCatalogue > ();
  const { cardContent, cardElem, cardCountryText, active, card, cardCountryTextConvert, cardDenominationsText, cardDenominationsTextConvert,
    cardContentConvert, customModal, marginTopImp0 } = eCardStyle;


  const { points, isBeneficiary, isPointsComponentLoading } = useDashboardNumber();
  const role = useUserRole();
  const userRights = getUserAuthorizations(role);
  const isAnyAdmin = isAnyKindOfAdmin(userRights);

  const onCardClick = (element: ProductFromCatalogue, isActive: boolean): void => {
    // setAllCheckedList(false);
    element.isActive = !isActive;
    eCardList.map(elem => {
      if (elem.ecardId == element.ecardId) {
        elem.isActive = !isActive;
      };
      return elem;
    })
    if (isConversionEcard) {
      setEcardSelected(element);
      if (totalPoints < 250 || isAnyAdmin || !canConvert) {
        if (isAnyAdmin) {
          alert("Vous êtes un administrateur, vous ne pouvez pas faire votre demande de cartes cadeaux");
        }  else if(!canConvert){
          alert("Vous devez attendre la fin du challenge ou vous WINS sont malheureusement expirés");
        }  else if (totalPoints < 250 && !isAnyAdmin) {
          alert("Vous n'avez pas assez de WINS pour faire votre demande de cartes cadeaux");
        }
      } else {
        setShowConvertionEcard(true);
      }
    }
    if (!isActive) {
      // setTimeout(()=>{}, 500);
      // let data = Object.assign(eCardSelectedList, []);
      // data = data ? data : [];
      eCardSelectedList.push(element);
      const data = eCardSelectedList.filter(e => {
        return e != undefined;
      });
      eCardFiltredList.sort((a, b) => {
        // const aIndexOf = defautSort.indexOf(a.BrandName);
        // const bIndexOf = defautSort.indexOf(b.BrandName);
        if (a.isActive && b.isActive || a.isActive && !b.isActive) {
          return -1;
        }
        if (!a.isActive && !b.isActive || !a.isActive && b.isActive) {
          return 1;
        }
        return 0;
      });
      setEcardSelectedList(data);
      setDataStep(ecardDataSave(data));
      // setEcardSelectedList(element);
    } else if (eCardSelectedList && eCardSelectedList.length > 0) {
      const data1 = eCardSelectedList.filter(e => {
        return element.ecardId != e.ecardId;
      });
      eCardFiltredList.sort((a, b) => {
        // const aIndexOf = defautSort.indexOf(a.BrandName);
        // const bIndexOf = defautSort.indexOf(b.BrandName);
        if (a.isActive && b.isActive || a.isActive && !b.isActive) {
          return -1;
        }
        if (!a.isActive && !b.isActive || !a.isActive && b.isActive) {
          return 1;
        }
        return 0;
      })
      setEcardSelectedList(data1 || []);
      setDataStep(ecardDataSave(data1));
    }
  }
  useEffect(() => {
    setTotalPoints(points);
    const amount = points * 0.04 || 0;
    setTotalAmount(amount);
    if (allCheckedList) {
      setEcardSelectedList(eCardFiltredList);
      setDataStep(ecardDataSave(eCardFiltredList));
    }
  }, [allCheckedList, points]);

  const showValidateModal = () => {
    setIsShowValidateStateEcard(true);
  }

  return (
    <>
      <div id="ecrad-content" className={`${cardContent} ${isConversionEcard ? cardContentConvert : ""}`}>
        {
          eCardFiltredList.map((element: ProductFromCatalogue) => {
            let denoms = element.Denominations.split(', ');
            let denomsStr1 = '';
            let denomsStr2 = '';
            let denomsStr = '';
            let dots = denoms?.length > 10 ? ' ... ' : '';
            if (denoms?.length > 5) {
              denomsStr1 = denoms.slice(0, 5).join(", ");
              denomsStr2 = denoms.slice(5, 10).join(", ");
              denomsStr = `[ ${denomsStr1} ] \n [ ${denomsStr2} ${dots} ] EUR`;
            } else {
              denomsStr1 = denoms.slice(0, denoms.length).join(", ");
              denomsStr = `[ ${denomsStr1} ] EUR`;
            }
            return (
              <div className={`${card} ${allCheckedList || element.isActive ? active : ''}`} id={element.BrandName}
                onClick={
                  (e: any) => {
                    // e.currentTarget.classList.toggle(`${active}`);
                    // const isActive = e.currentTarget.classList.contains(`${active}`) ? true : false;
                    onCardClick(element, element.isActive);
                  }
                }>
                <div className={`card-body ${cardElem}`} >
                  <MediaBlock
                    mediaType='image'
                    showModal={false}
                    setShowModal={setShowModal}
                    media={{
                      url: element.LogoFile, //file and video
                      ext: element.LogoFile?.substring(element.LogoFile?.lastIndexOf('.') + 1) || 'jpg',
                      src: element.LogoFile, //src for image
                      size: 100,
                      title: "Bloc image file",
                      alt: "Bloc image file"
                    }}
                  />
                  <h5 className="card-title">{element.BrandName}</h5>
                  <div className={`${coreStyle.withGrayColor} ${cardCountryTextConvert}`}> {element.Country} {` [ ${element.Currency} ]`}</div>
                  <div className={`${coreStyle.withGrayColor} ${cardCountryTextConvert}`}> {
                    element.Denominations && element.Denominations != "" ?
                      `${formatMessage({ id: 'eCard.content.denominations' })}` :
                      formatMessage({ id: 'eCard.content.allDenominations' })
                  }
                  </div>
                  {(element.Denominations && element.Denominations != "") && 
                    <div className={`${coreStyle.withGrayColor} ${cardDenominationsTextConvert}`}>
                      {denomsStr}
                    </div>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
      {!isConversionEcard && !isShowValidateStateEcard &&
        <div className={coreStyle.btnCenter}>
          <Button
            onClick={() => showValidateModal()}
            type={BUTTON_MAIN_TYPE.PRIMARY}
          >
            {formatMessage({ id: 'form.submit.next' })}
          </Button>
        </div>
      }
      {
        isConversionEcard &&
        <FlexibleModalContainer
          fullOnMobile={false}
          className={`${style.mediaModal} ${customModal}`}
          closeModal={() => setShowConvertionEcard(false)}
          isModalOpen={showConvertionEcard}
        >
          <div className={style.mediaModalContent}>
            <EcardConVert element={eCardSelected} totalPoints={totalPoints} setTotalPoints={setTotalPoints} totalAmount={totalAmount}
              setTotalAmount={setTotalAmount} setShowConvertionEcard={setShowConvertionEcard} programDetails={programDetails} >
            </EcardConVert>
            <DynamicFormattedMessage
              onClick={() => setShowConvertionEcard(false)}
              tag={Button}
              className={`${coreStyle.mxAuto} ${marginTopImp0}`}
              id="label.close.modal"
            />
          </div>
        </FlexibleModalContainer>
      }

    </>
  );
};

export default EcardContent;

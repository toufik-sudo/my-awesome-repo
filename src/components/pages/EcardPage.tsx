/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import {
  CatalogueService,
  SearchService,
  OpenAPI,
  CatalogueRequest,
  ProductFromCatalogue,
} from '../../api/huuray';
import { CatalogueResponse } from 'api/huuray/models/CatalogueResponse'
import { HuurayrequestService } from 'api/huuray/services/HuurayrequestService';
import { CatalogueParamsApi } from 'api/huuray/models/HuurayParams';
import EcardContent from 'components/organisms/launch/eCard/eCardContent';
import EcardFilter from 'components/organisms/launch/eCard/eCardFilter';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
import LaunchProgramTitle from 'components/molecules/launch/LaunchProgramTitle';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { useHistory, useLocation, useParams } from 'react-router-dom';
// import { ProductList } from 'components/organisms/declarations/upload/ProductList';
import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import { useDispatch, useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { FREEMIUM, LAUNCH_TO_DESIGN } from 'constants/routes';
import { setLaunchDataStep } from 'store/actions/launchActions';
import { ECARD_SELECTED_LIST } from 'constants/wall/launch';
import { useMultiStep } from 'hooks/launch/useMultiStep';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import DesignNextStep from 'components/atoms/launch/design/DesignNextStep';
import style from 'sass-boilerplate/stylesheets/components/wall/PostMedia.module.scss';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { useIntl } from 'react-intl';
import Button from 'components/atoms/ui/Button';
// import { redirectToRoute } from 'services/LaunchServices';

/**
 * Page component used to render eCard page
 *
 * @constructor
 */
const EcardPage = ({ isConversionEcard, canConvert= null }) => {
  const [eCardList, setEcardList] = useState<ProductFromCatalogue[]>([]);
  const [eCardFiltredList, setEcardFiltredList] = useState<ProductFromCatalogue[]>([]);
  const [eCardSelectedList, setEcardSelectedList] = useState<any[]>([]);
  const [allCheckedList, setAllCheckedList] = useState<boolean>(false);
  const [isValidateStateEcard, setIsValidateStateEcard] = useState<boolean>(false);
  const [isShowValidateStateEcard, setIsShowValidateStateEcard] = useState<boolean>(false);
  const [catalogueStatus, setCatalogueStatus] = useState<number>(0);
  const [catalogueMsg, setCatalogueMsg] = useState<string>('');
  const { cardTemplate, ecarsContainer, cardTemplateConvert, customModal, customValidateModal } = eCardStyle;
  const [sortCountiesList, setSortCountiesList] = useState(null);
  const { selectedProgramId, programDetails } = useWallSelection();
  const [isAllLoaded, setIsAllLoaded] = useState<boolean>(true);
  const { step, stepIndex } = useParams();
  const { type } = useSelector((store: IStore) => store.launchReducer);
  const history = useHistory();
  const dispatch = useDispatch();
  const { stepSet: { setNextStep } } = useMultiStep();
  const { formatMessage } = useIntl();

  const ecardDataSave = (selectedList) => {
    let allDataValid = true;
    let isLoading = false;
    if (!selectedList || selectedList && selectedList.length == 0) {
      allDataValid = false;
    }

    const handleNextStep = async () => {
      isLoading = true;
      // If companyAvatar was changed or a new picture was uploaded (companyCroppedAvatar has base64 representation),
      // we need to upload the new image to server and set info in localstorage
      if (selectedList && selectedList.length > 0) {
        try {
          const eCardSelectedListParam = [];
          selectedList.map(elem => {
            const obj = {
              ecardId: elem.ecardId
            };
            eCardSelectedListParam.push(obj);
          });
          dispatch(setLaunchDataStep({ key: ECARD_SELECTED_LIST, value: eCardSelectedListParam }));
          // setCompanyCroppedAvatar(avatarResponse[0].publicPath);
        } catch (e) {
          throw new Error(e);
        }
      }

      isLoading = false;
      setNextStep();
    };

    return { handleNextStep, allDataValid, isLoading };
  };

  const [dataStep, setDataStep] = useState({ handleNextStep: null, allDataValid: false, isLoading: false });

  const isProgramLoaded = Object.keys(programDetails).length > 0;
  // setIsAllLoaded(isProgramLoaded);
  const location = useLocation();
  // const [error, setError] = useState<ApiError|null>();
  const getEcardList = async (sortList, pathname) => {
    setIsAllLoaded(false);
    const body: CatalogueRequest = {
      All: true,
    }
    const huurayrequestService = new HuurayrequestService();
    const params: CatalogueParamsApi = huurayrequestService.getHuurayRequest();
    // const post =  CatalogueService.postV31Catalogue(params.xApiNonce, params.xApiHash, body);   
    let products = [];
    let productList = [];
    try {
      if (isConversionEcard) {
        const ecardPrograms = programDetails[selectedProgramId] ? programDetails[selectedProgramId]['ecardPrograms'] : [];
        ecardPrograms.forEach(element => {
          products.push(element.ecard);
        });
        // setIsConversionEcard(true);
        setCatalogueStatus(200);
        setCatalogueMsg('Catalogue is successfully loaded !!!');
        setIsAllLoaded(isProgramLoaded);
      } else {
        // setIsConversionEcard(false);
        const post = CatalogueService.postV31CatalogueDb();
        const response: any = await post;
        const data: CatalogueResponse | any = await response;
        const result = data.Products ? data : data.data || {};
        if (typeof result.Products == 'string') {
          products = JSON.parse(result.Products);
        } else {
          products = result.Products;
        }
        setIsAllLoaded(true);
        setCatalogueStatus(result.Status || 200);
        setCatalogueMsg(result.Message || 'Catalogue is successfully loaded !!!');
      }
      if (sortList && sortList["DEFAULT"] && sortList["DEFAULT"].length > 0 && products?.length > 0) {
        const defautSort = sortList["DEFAULT"];
        productList = products.sort((a, b) => {
          const aIndexOf = defautSort.indexOf(a.BrandName);
          const bIndexOf = defautSort.indexOf(b.BrandName);
          if (aIndexOf == -1 && bIndexOf == -1 || a.CountryCode != 'FR') {
            return 0;
          }
          if (aIndexOf == bIndexOf) {
            return 0;
          }
          if (aIndexOf > bIndexOf) {
            return -1;
          }
          if (bIndexOf > aIndexOf && b.CountryCode == 'FR') {
            return 1;
          }
        })
      } else {
        productList = products || [];
      }
      productList.map(elem => {
        if (elem.Denominations && elem.Denominations.length > 0) {
          const filter = elem.Denominations.split(',').filter(e => e <= 250);
          elem.Denominations = filter.toString();
        }
        return elem;
      });
      setEcardFiltredList(productList);
      setEcardList(productList);
    } catch (error) {
      setIsAllLoaded(true);
      console.error(error);
      setCatalogueStatus(error.Status);
      setCatalogueMsg(error.Message);
    }
  };
  const getCatalogueSortData = async (pathname) => {
    setIsAllLoaded(false);
    const post = (await CatalogueService.postV31CatalogueSort()).json();
    post.then(response => {
      const result = response;
      if (!result) {
        setSortCountiesList(result);
      }
      getEcardList(result, pathname);
    })
    post.catch(error => {
      console.log(error);
      getEcardList([], pathname);
    });
  };

  if (type == FREEMIUM) {
    history.push(LAUNCH_TO_DESIGN);
    // redirectToRoute(LAUNCH_TO_DESIGN);
  }

  useEffect(() => {
    const pathname = window.location.pathname;
    setIsAllLoaded(isProgramLoaded);
    // if (pathname?.indexOf('/wall/ecard/conversion') >= 0) {      
    //   setIsConversionEcard(true);
    // } else {
    //   setIsConversionEcard(false);
    // }
    getCatalogueSortData(pathname);
    //   .then((ecardList) => setEcardList(ecardList))
    //   .catch((error) => setError(error));
  },
    []);

  const closeModal = () =>{
    setIsShowValidateStateEcard(false);
    setIsValidateStateEcard(false);
  }


  return (
    <div className={ecarsContainer}>
      {
        (!isAllLoaded &&
          <div>
            <Loading className={coreStyle.withSecondaryColor} type={LOADER_TYPE.DROPZONE} />
          </div>
        )
      }
      {isAllLoaded && !isConversionEcard && <LaunchProgramTitle
        titleId="launchProgram.title"
        subtitleId="launchProgram.ecard.subtitle"
        subtitleCustomClass={coreStyle.withSecondaryColor}
      />}
      {isAllLoaded && eCardList.length > 0 &&
        (
          <div className={`${cardTemplate} ${isConversionEcard ? cardTemplateConvert : ''}`}>
            <EcardFilter eCardList={eCardList} eCardFiltredList={eCardFiltredList} setEcardFiltredList={setEcardFiltredList}
              setAllCheckedList={setAllCheckedList} eCardSelectedList={eCardSelectedList} setEcardSelectedList={setEcardSelectedList}
              isConversionEcard={isConversionEcard} sortCountiesList={sortCountiesList} setDataStep={setDataStep}
              ecardDataSave={ecardDataSave}>
            </EcardFilter>
            <EcardContent eCardList={eCardList} eCardFiltredList={eCardFiltredList} allCheckedList={allCheckedList} setAllCheckedList={setAllCheckedList}
              eCardSelectedList={eCardSelectedList} setEcardSelectedList={setEcardSelectedList} isConversionEcard={isConversionEcard}
              programDetails={programDetails} setDataStep={setDataStep} ecardDataSave={ecardDataSave}
              isShowValidateStateEcard={isShowValidateStateEcard} setIsShowValidateStateEcard={setIsShowValidateStateEcard}
              canConvert={canConvert}
            ></EcardContent>
          </div>
        )
      }
      {
        isShowValidateStateEcard &&
        <FlexibleModalContainer
          fullOnMobile={false}
          className={`${style.mediaModal} ${customModal} ${customValidateModal}`}
          closeModal={() => closeModal}
          isModalOpen={isShowValidateStateEcard}
        >
          <div className={style.mediaModalContent}>
            <div>
             <p style={{'fontSize': '1.5rem'}}> Vous avez sélectionné <b> {eCardSelectedList.length || 0} </b> cartes cadeaux.</p>
            </div>
            <EcardContent eCardList={eCardList} eCardFiltredList={eCardSelectedList} allCheckedList={allCheckedList} setAllCheckedList={setAllCheckedList}
              eCardSelectedList={eCardSelectedList} setEcardSelectedList={setEcardSelectedList} isConversionEcard={isConversionEcard}
              programDetails={programDetails} setDataStep={setDataStep} ecardDataSave={ecardDataSave}
              isShowValidateStateEcard={isShowValidateStateEcard} setIsShowValidateStateEcard={setIsShowValidateStateEcard}
            >
            </EcardContent>
            <div className={coreStyle.btnCenter} style={{columnGap: '1rem'}}>
              <DesignNextStep {...dataStep} />
              <Button
                onClick={() => setIsShowValidateStateEcard(false)}
                type={BUTTON_MAIN_TYPE.SECONDARY}
              >
                {formatMessage({ id: 'form.submit.previous' })}
              </Button>
            </div>
          </div>
        </FlexibleModalContainer>
      }
    </div>
  );
};

export default EcardPage;



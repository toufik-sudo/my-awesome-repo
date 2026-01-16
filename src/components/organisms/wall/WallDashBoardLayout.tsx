/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import GoogleFontLoader from 'react-google-font-loader';

import ProgramsApi from 'api/ProgramsApi';
import WallRightBlock from 'components/molecules/wall/blocks/WallRightBlock';
import WallRightSidebar from 'components/molecules/wall/blocks/WallRightSidebar';
import WallLeftBlock from 'components/molecules/wall/blocks/WallLeftBlock';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import useWallLayoutData from 'hooks/wall/useWallLayoutData';
import WallCover from './WallCover';
import { REGISTER_DATA_COOKIE, WALL_TYPE } from 'constants/general';
import buttonStyle from 'assets/style/common/Button.module.scss';
import {
  CHALLENGE,
  CHECKOUT_STRIPE,
  FREEMIUM,
  LAUNCH_TO_SOCIAL_NETWORKS,
  ONBOARDING_BENEFICIARY_REGISTER_BASE_ROUTE,
  REDIRECT_MAPPING,
  ROOT,
  WALL
} from 'constants/routes';
import { redirectBasedOnCurrentStep } from 'services/WallServices';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { setProgramDetails } from 'store/actions/wallActions';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import style from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { WALL_BLOCK } from 'constants/wall/blocks';
import { useLaunchData } from 'hooks/launch/useLaunchData';
import { IStore } from 'interfaces/store/IStore';
import { setJourneyType, setLaunchDataStep, setMultipleData, setStoreData } from 'store/actions/launchActions';
import { redirectToRoute } from 'services/LaunchServices';
import {
  LAUNCH_CONTENTS_SECOND,
  LAUNCH_CONTENTS_THIRD,
  LAUNCH_CONTENTS_FOUR,
  LAUNCH_CONTENTS_FIVE,
  LAUNCH_DESIGN_FIRST,
  LAUNCH_CONTENTS_FIRST,
  CORRELATED,
  FREQUENCY_TYPE_VALUES_NAMES
} from 'constants/wall/launch';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import { PROGRAMS } from 'constants/api';
import { useUserData } from 'hooks/user/useUserData';
import { useIntl } from 'react-intl';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { useUserRole } from 'hooks/user/useUserRole';
import { getUserAuthorizations, isAnyKindOfAdmin, isUserBeneficiary } from 'services/security/accessServices';
// import { setLocalStorage } from 'services/StorageServies';

const programsApi = new ProgramsApi();
/**
 * Organism component used to render wall dashboard layout
 *
 * @constructor
 */
const WallDashBoardLayout = ({ children, hasRightWidgets = true }) => {
  const { formatMessage } = useIntl();
  const { history, userDetails, currentStep } = useWallLayoutData();
  const { wallSingleWidget, wallCenterBlock } = style;

  const { selectedProgramId, programDetails, selectedProgramName } = useWallSelection();
  const { font } = useSelectedProgramDesign();
  const dispatch = useDispatch();
  const { simpleAllocation, cube, platform } = useLaunchData(useSelector((store: IStore) => store.launchReducer));

  const [showPopup, setShowPopup] = useState(false);

  const userData = useUserData();
  const role = useUserRole();

  useEffect(() => {
    const userRights = getUserAuthorizations(role);
    const isAnyAdmin = isAnyKindOfAdmin(userRights);
    const isBeneficiary = isUserBeneficiary(role);
    if (!selectedProgramId) {
      return;
    }
    programsApi
      .getProgramDetails(selectedProgramId)
      .then(data => dispatch(setProgramDetails(selectedProgramId, { ...data, didLoad: true })))
      .catch((error) => {
        dispatch(setProgramDetails(selectedProgramId, { didLoad: true }));
        if (error.response?.data.message?.indexOf('Active subscription, but latest invoice is not paid') >= 0 ||
          error.response?.data.message == 'No active subscription found for the specified product.' ||
          error.response?.data.message == 'Subscription is not associated with a customer.') {
          // If program is not paid, redirect to payment page
          // history.push(`${ROOT}programs`);
          if (isBeneficiary && !isAnyAdmin) {
            setShowPopup(true);
          }
          // return;
        }

        // If program not found, redirect to root
      });
  }, [selectedProgramId]);

  if (history.location.pathname.includes(WALL) && !userDetails) {
    return <Redirect to={ROOT} />;
  }

  redirectBasedOnCurrentStep(currentStep, history, [REDIRECT_MAPPING.WALL_ROUTE_STEP, REDIRECT_MAPPING.NOT_PAID_STEP]);
  // console.log('programDetails : ' );
  const currentProgramDetails = programDetails[selectedProgramId] || {};
  // console.log(currentProgramDetails );
  const modifyProgramDesign = (programType, Progtype): any => {
    const programDetails = currentProgramDetails;
    const getValueFromPages = key => {
      let retValue = '';
      let index = Progtype == FREEMIUM ? 5 : 1;
      const content = programDetails?.pages[index] ? JSON.parse(programDetails.pages[index].content) : [];
      if (content?.length == 0) {
        return '';
      }
      console.log(content)
      const filtered = content.filter(e => e[key]);
      retValue = filtered && filtered.length > 0 ? filtered[0][key] || '' : '';
      // content.forEach((element) => {
      //   if (element[key]) {
      //     retValue=  element[key];
      //   }
      // });
      return retValue;
    };
    console.log('d1')
    if (programDetails) {
      const payload: any = {
        category: 'launchProgram',
        programJourney: 'full',
        duration: { start: programDetails.startDate, end: programDetails.endDate },
        startDate: programDetails.startDate,
        endDate: programDetails.endDate,
        termsAndConditionsUrl: programDetails.termsAndConditionsUrl,
        platformId: programDetails.platformId,
        currency: programDetails.currency,
        creationType: programDetails.creationType,
        type: Progtype,
        invitedUsersFiles: programDetails.invitedUsersFiles,
        manualValidation: programDetails.registerManualValidation,
        notifyOfNewRegistrations: programDetails.notifyOfNewRegistrations,
        resultsManualValidation: programDetails.declarationManualValidation,
        resultsEmailNotify: programDetails.notifyOfNewResultsDeclaration,
        products: programDetails.products,
        categoryIds: programDetails.categoryIds,
        resultChannel: {
          declarationForm: programDetails.resultsDeclarationForm,
          fileImport: programDetails.fileImport
        },
        uploadResultsFile: programDetails.uploadResultsFile,
        resultsFormFields: programDetails.resultsFormFields,
        visitedWall: programDetails.visitedWall,
        slideshow: programDetails.slideshow,
        confidentiality: programDetails.open ? 'open' : 'close',
        globalError: '',
        design: programDetails.design,
        programName: programDetails.name,
        url: window.location.hostname + '/programs/freemium/identifier/' + programDetails.customUrl,
        extendUrl: programDetails.customUrl,
        invitedUsersFields: ['civility', 'firstName', 'name', 'email'],
        acceptedEmailInvitation: programDetails.sendEmailInvites,
        companyLogo: getValueFromPages('companyLogo') || '',
        backgroundCover: getValueFromPages('backgroundCover') || '',
        companyName: programDetails.design.companyName || '',
        companyAvatar: {
          croppedAvatar: programDetails.design.companyLogoUrl,
          avatarConfig: {
            zoom: 1,
            rotate: 0,
            name: getValueFromPages('companyAvatarImgName') || ''
          }
        },
        companyCover: {
          croppedAvatar: programDetails.design.backgroundCoverUrl,
          avatarConfig: {
            zoom: 1,
            rotate: 0,
            name: getValueFromPages('companyCoverImgName') || ''
          }
        },
        identificationCoverId: getValueFromPages('identificationCoverId') || '',
        identificationCover: {
          croppedAvatar: programDetails.landingPictureUrl,
          avatarConfig: {
            zoom: 1,
            rotate: 0,
            name: getValueFromPages('identificationCoverImgName') || ''
          }
        },
        identificationTitle: programDetails.landingTitle,
        identificationText: programDetails.landingDescription,
        contentsCoverId: getValueFromPages('contentsCoverId') || '',
        contentsCover: {
          croppedAvatar: programDetails.pages[0].pictureUrl,
          avatarConfig: {
            zoom: 1,
            rotate: 0,
            name: getValueFromPages('contentsCoverIdImgName') || ''
          }
        },
        contentsTitle: programDetails.pages[0]?.menuTitle || '',
        bannerTitle: programDetails.pages[0]?.bannerTitle || '',
        wysiwigDataField: programDetails.pages[0]?.content || '',

        contentsCoverId1: getValueFromPages('contentsCoverId1') || '',
        contentsCover1: {
          croppedAvatar: programDetails.pages[1]?.pictureUrl || '',
          avatarConfig: {
            zoom: 1,
            rotate: 0,
            name: getValueFromPages('contentsCoverId1ImgName') || ''
          }
        },
        contentsTitle1: programDetails.pages[1]?.menuTitle || '',
        bannerTitle1: programDetails.pages[1]?.bannerTitle || '',
        wysiwigDataField1: programDetails.pages[1]?.content || '',

        contentsCoverId2: getValueFromPages('contentsCoverId2') || '',
        contentsCover2: {
          croppedAvatar: programDetails.pages[2]?.pictureUrl || '',
          avatarConfig: {
            zoom: 2,
            rotate: 0,
            name: getValueFromPages('contentsCoverId2ImgName') || ''
          }
        },
        contentsTitle2: programDetails.pages[2]?.menuTitle || '',
        bannerTitle2: programDetails.pages[2]?.bannerTitle || '',
        wysiwigDataField2: programDetails.pages[2]?.content || '',

        contentsCoverId3: getValueFromPages('contentsCoverId3') || '',
        contentsCover3: {
          croppedAvatar: programDetails.pages[3]?.pictureUrl || '',
          avatarConfig: {
            zoom: 3,
            rotate: 0,
            name: getValueFromPages('contentsCoverId3ImgName') || ''
          }
        },
        contentsTitle3: programDetails.pages[3]?.menuTitle || '',
        bannerTitle3: programDetails.pages[3]?.bannerTitle || '',
        wysiwigDataField3: programDetails.pages[3]?.content || '',

        contentsCoverId4: getValueFromPages('contentsCoverId4') || '',
        contentsCover4: {
          croppedAvatar: programDetails.pages[4]?.pictureUrl || '',
          avatarConfig: {
            zoom: 4,
            rotate: 0,
            name: getValueFromPages('contentsCoverId4ImgName') || ''
          }
        },
        contentsTitle4: programDetails.pages[4]?.menuTitle || '',
        bannerTitle4: programDetails.pages[4]?.bannerTitle || '',
        wysiwigDataField4: programDetails.pages[4]?.content || '',

        socialMediaAccounts: {
          facebook: programDetails.socialMediaAccounts.facebook,
          twitter: programDetails.socialMediaAccounts.twitter,
          linkedin: programDetails.socialMediaAccounts.linkedin,
          custom: programDetails.socialMediaAccounts.custom,
          instagram: programDetails.socialMediaAccounts.instagram
        },
        programId: selectedProgramId
      };

      let cubeModify: any = {};
      if (programDetails.cube) {
        cubeModify = {
          goals: programDetails.cube.goals,
          frequencyAllocation: FREQUENCY_TYPE_VALUES_NAMES[programDetails.cube.frequencyOfAllocation],
          correlated: programDetails.cube.correlatedGoals,
          rewardPeopleManagers: programDetails.cube.rewardManagers,
          spendType: programDetails.cube.spendType,
          validityPoints: { value: programDetails.cube.validityOfPoints },
          rewardPeopleManagerAccepted: programDetails.cube.rewardPeopleManagerAccepted,

        }

      }
      payload.cube = cubeModify ? cubeModify : cube;
      payload.simpleAllocation = programDetails.simpleAllocation ? programDetails.simpleAllocation : simpleAllocation;
      if (platform) {
        platform.id = programDetails.platformId;
      }
      payload.platform = programDetails.platform ? programDetails.platform : platform;
      payload.isModify = true;
      payload.ecardPrograms = programDetails.ecardPrograms || [];

      try {
        console.log("done 1")
        dispatch(setStoreData(payload));
        console.log("done 2")
        // dispatch(setJourneyType(null, dispatch));
        // Object.keys(payload).forEach(key => {
        //   const val = payload[key];
        // });
        dispatch(setLaunchDataStep(setLaunchDataStep(payload)));
        console.log("done 3")
        // setLocalStorage(REGISTER_DATA_COOKIE, payload);
        switch (programType) {
          case WALL_BLOCK.USER_BLOCK:
            history.push(`${LAUNCH_CONTENTS_SECOND}`);
            // redirectToRoute(LAUNCH_CONTENTS_FIRST);
            break;
          case WALL_BLOCK.POINTS_BLOCK:
            history.push(`${LAUNCH_CONTENTS_THIRD}`);
            // redirectToRoute(LAUNCH_CONTENTS_FIRST);
            break;
          case WALL_BLOCK.DECLARATIONS_BLOCK:
            history.push(`${LAUNCH_CONTENTS_FOUR}`);
            // redirectToRoute(LAUNCH_CONTENTS_FIRST);
            break;
          case WALL_BLOCK.PAYMENT_BLOCK:
            history.push(`${LAUNCH_CONTENTS_FIVE}`);
            // redirectToRoute(LAUNCH_CONTENTS_FIRST);
            break;
          case WALL_BLOCK.SETTINGS_BLOCK:
            history.push(`${LAUNCH_DESIGN_FIRST}`);
            // redirectToRoute(LAUNCH_DESIGN_FIRST);
            break;

          default:
            break;
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const redirectToStripeCheckoutRoute = (route: string) => {
    const host = window.location.hostname;
    const protocol = window.location.protocol;
    const port = window.location.port ? `:${window.location.port}` : '';
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const programNameFromUrl = urlParams.get('programName');
    const platformFromUrl = urlParams.get('platformId');
    const redirectUrl = `${protocol}//${host}${port}${route}?programId=${selectedProgramId}&userEmail=${userData?.userData.email}&programName=${programNameFromUrl || ''}&platformId=${platformFromUrl || ''}`;
    window.location.href = redirectUrl;
    // history.push(route);
    return;
  }

  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '17px',
    marginBottom: '16px',
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#1a1a1a',
    textAlign: 'left',
  };

  return (
    <>
      <FlexibleModalContainer
        fullOnMobile={false}
        className={`${style.mediaModal}`}
        closeModal={() => redirectToRoute(ROOT + PROGRAMS)}
        isModalOpen={showPopup}
      >
        <div>
          <div className={style.modalContent}>
            <div style={titleStyle}>
              {formatMessage({ id: "modal.title.noaccess.subscription" })} <strong>{selectedProgramName}</strong>.
            </div>
            <div style={textStyle}>
              <p className={style.modalText}>
                💳 {formatMessage({ id: "modal.text.noaccess.subscription" })}
              </p>
            </div>
            <br />

            <DynamicFormattedMessage
              tag={Button}
              onClick={() => {
                redirectToStripeCheckoutRoute(CHECKOUT_STRIPE);
              }}
              type={BUTTON_MAIN_TYPE.PRIMARY}
              id="modal.btn.pay.subscription"
            />

            <br /><br />
            <DynamicFormattedMessage
              tag={Button}
              onClick={() => {
                redirectToRoute(ROOT + PROGRAMS);
              }}
              type={BUTTON_MAIN_TYPE.SECONDARY}
              id="modal.btn.nopay.subscription"
            />
          </div>
        </div>
      </FlexibleModalContainer>

      {!showPopup && (
        <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
          {font && <GoogleFontLoader fonts={[{ font }]} />}
          <div className={style.wallBaseStructure} style={{ fontFamily: font }}>
            <WallCover />
            <WallLeftBlock programDetails={currentProgramDetails} modifyProgramDesign={modifyProgramDesign} />
            <div className={`${wallCenterBlock} ${!hasRightWidgets ? wallSingleWidget : ''} ${coreStyle.mt1}`}>
              {children}
            </div>
            {hasRightWidgets && (
              <WallRightBlock programDetails={currentProgramDetails} modifyProgramDesign={modifyProgramDesign} />
            )}
          </div>
          <WallRightSidebar />
        </LeftSideLayout>)
      }
    </>
  );
};

export default WallDashBoardLayout;

/* eslint-disable quotes */
import React, { useContext, useMemo, useState } from 'react';
import { Tabs, Tab, TabList, TabPanel } from 'react-tabs';
import { useLocation } from 'react-router-dom';
import { UserContext } from 'components/App';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import Loading from 'components/atoms/ui/Loading';
import GeneralBlock from 'components/molecules/block/GeneralBlock';
import PaymentMethodBlockList from 'components/molecules/onboarding/PaymentMethodBlockList';
import Accordion from 'components/organisms/accordion/Accordion';
import WallCreateAccountFormWrapper from 'components/organisms/form-wrappers/updateAccountInformation/WallCreateAccountFormWrapper';
import WallSettingsChangePasswordFormWrapper from 'components/organisms/form-wrappers/WallSettingsChangePasswordFormWrapper';
import StaticSubscriptionSection from 'components/organisms/onboarding/StaticSubscriptionSection';
import WallGdprBlock from 'components/organisms/wall/WallGdprBlock';
import WallSettingsAdministrators from 'components/organisms/wall/WallSettingsAdministrators';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { ACCOUNT, ADMINISTRATORS, CHANGE_PASSWORD, GDPR, PAYMENT } from 'constants/wall/settings';
import { useSettingsData } from 'hooks/wall/settings/useSettingsData';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import {
  isUserHyperAdmin,
  getPlatformSuperUserIsLoggedInto,
  hasAtLeastSuperRole,
  isAnyKindOfManager,
  isUserBeneficiary
} from 'services/security/accessServices';
import { getUserHighestRole } from 'services/UserDataServices';
import modalStyle from 'assets/style/components/Modals/Modal.module.scss';
import style from 'sass-boilerplate/stylesheets/components/wall/WallSettingsBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import tableStyle from "../../../sass-boilerplate/stylesheets/components/tables/Table.module.scss";
import { WALL_ROUTE } from "../../../constants/routes";
import LinkBack from "../../atoms/ui/LinkBack";
import ButtonWithIcon from 'components/atoms/ui/ButtonWithIcon';
// import { Button } from 'react-scroll';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import { BUTTON_MAIN_VARIANT, BUTTON_MAIN_TYPE } from 'constants/ui';
import { useUserRole } from 'hooks/user/useUserRole';
import UserApi from 'api/UsersApi';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';
import buttonStyle from 'assets/style/common/Button.module.scss';
import FlexibleModalContainer from 'containers/FlexibleModalContainer';
import Button from 'components/atoms/ui/Button';


/**
 * Organism component used to render settings block/tabs
 *
 * @constructor
 */
const SettingsMainBlock = () => {
  const { formatMessage } = useIntl();
  const [showPopup, setShowPopup] = useState(false);
  const langKeyPrefix = 'wall.settings.';
  const { settingsTabList, settingsTab, settingsActiveTab, settingsBtn } = style;
  const { withGrayAccentColor, withBoldFont, pointer, mt3, mt0, pt2, dMediumPx0 } = coreStyle;
  const { state } = useLocation < any > ();
  const { userData = {}, componentLoading: loadingUserData } = useContext(UserContext);
  const highestRole = userData.highestRole || getUserHighestRole();
  const stripeEnvProgramList = process.env.REACT_APP_STRIPE_PROGRAM_LIST || "";
  const stripeProgramList = JSON.parse(stripeEnvProgramList);
  const role = useUserRole();
  const isBeneficiary = isUserBeneficiary(role);
  const { selectedProgramId, selectedPlatform = {}, loadingPlatforms, selectedProgramName } = useWallSelection();
  const [isCancelled, setIsCancelled] = useState(false);
  const platform =
    useMemo(
      () =>
        // for super users, settings are relative to their platform (super/hyper platform)
        isUserHyperAdmin(highestRole) || hasAtLeastSuperRole(selectedPlatform.role)
          ? getPlatformSuperUserIsLoggedInto(userData)
          : selectedPlatform,
      [selectedPlatform, userData, highestRole]
    ) || selectedPlatform;
  const { index, setTabIndex, tabHeaders, hasAdminRights, userRights } = useSettingsData(platform);

  if (loadingPlatforms || loadingUserData) {
    return <Loading type={LOADER_TYPE.DROPZONE} />;
  }

  const cancelUserStripeSubscription = async () => {
    setShowPopup(true);
  }
  const cancelUserStripeSubscriptionApi = async () => {
    if (selectedProgramId && stripeProgramList?.includes(selectedProgramId) && isBeneficiary && userData?.email) {
      const userApi = new UserApi();
      const payload = {
        programId: selectedProgramId,
        email: userData.email
      }
      try {
        const response = await userApi.cancelStripeUserSubscription(payload);
        setIsCancelled(response.data?.data.isCancelled);
        if (response.data?.data.isCancelled) {
          // toast("Votre abonnement a été résilié avec succès, votre abonnement est toujours valide jusqu'au :" + response.data?.data.cancelledAt || "");
          toast(
            `${formatMessage({ id: "modal.title.cancel.sucess.subscription" })} ${response.data?.data.cancelledAt || ""}.
             ${formatMessage({ id: "modal.text.cancel.sucess.subscription" })} « ${selectedProgramName} ».`
          );

        } else {
          // toast("L'annulation de l'abonnement n'est pas abouti, veuillez contacter l'administrateur par mail : hello@rewardzai.com");
          toast.error(formatMessage({ id: "modal.confirm.cancel.error.text.subscription" }));

        }
      } catch (error) {
        // toast(formatMessage({ id: 'toast.message.generic.error' }));
        // toast("L'annulation de l'abonnement n'est pas abouti, veuillez contacter l'administrateur par mail : hello@rewardzai.com");
        toast.error(formatMessage({ id: "modal.confirm.cancel.error.text.subscription" }));
      }
    }
  }

  const titleStyle = {
    fontWeight: 'bold',
    fontSize: '17px',
    marginBottom: '16px',
  };

  const listStyle = {
    paddingLeft: '20px',
    marginTop: '10px',
    marginBottom: '10px',
  };

  const textStyle = {
    fontSize: '16px',
    lineHeight: 1.6,
    color: '#1a1a1a',
    textAlign: 'left',
  };

  return (
    <GeneralBlock className={mt0}>
      <LinkBack
        className={`${tableStyle.tableHeaderElem}`}
        to={WALL_ROUTE}
        messageId="wall.userDeclarations.back.to.wall"
      />
      <Tabs selectedIndex={index} onSelect={setTabIndex}>
        <TabList className={settingsTabList}>
          {tabHeaders.map(objKey => (
            <Tab
              key={objKey}
              className={`${settingsTab} ${withGrayAccentColor} ${withBoldFont}`}
              selectedClassName={settingsActiveTab}
            >
              <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id={`${langKeyPrefix}${objKey}`} className={pointer} />
            </Tab>
          ))}
          {isBeneficiary && selectedProgramId && stripeProgramList && stripeProgramList?.includes(selectedProgramId) &&
            (
              <Tab
                className={`${settingsTab} ${withGrayAccentColor} ${withBoldFont} ${settingsBtn}`}
                selectedClassName={settingsActiveTab}
              >
                <DynamicFormattedMessage
                  tag={Button}
                  onClick={cancelUserStripeSubscription}
                  type={BUTTON_MAIN_TYPE.PRIMARY}
                  id="form.submit.cancelStripeSubscription"
                  className={`${isCancelled && buttonStyle.disabled}`}
                />
              </Tab>
            )
          }
        </TabList>
        {tabHeaders.includes(ACCOUNT) && (
          <TabPanel>
            <GeneralBlock isShadow={false}>
              <WallCreateAccountFormWrapper isSettingForm={true} />
            </GeneralBlock>
          </TabPanel>
        )}
        {tabHeaders.includes(CHANGE_PASSWORD) && (
          <TabPanel>
            <GeneralBlock isShadow={false}>
              <div className={mt3}>
                <WallSettingsChangePasswordFormWrapper />
              </div>
            </GeneralBlock>
          </TabPanel>
        )}
        {(hasAdminRights || isAnyKindOfManager(userRights)) && (
          <>
            {!isAnyKindOfManager(userRights) && tabHeaders.includes(ADMINISTRATORS) && (
              <TabPanel>
                <div className={mt3}>
                  <WallSettingsAdministrators platform={platform} />
                </div>
              </TabPanel>
            )}
            {tabHeaders.includes(PAYMENT) && (
              <TabPanel>
                <GeneralBlock className={dMediumPx0} isShadow={false}>
                  <>
                    {platform && platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT && (
                      <Accordion title={<DynamicFormattedMessage id="subscription.title" tag={HTML_TAGS.P} />}>
                        <StaticSubscriptionSection />
                      </Accordion>
                    )}

                    <Accordion
                      shouldBeOpened={state && state.fromSetCard}
                      title={<DynamicFormattedMessage id="payment.rewards.title" tag={HTML_TAGS.P} />}
                    >
                      <div className={pt2}>
                        <DynamicFormattedMessage id="payment.rewards.points.info" tag={HTML_TAGS.P} />
                        <DynamicFormattedMessage id="payment.rewards.points.label" tag={HTML_TAGS.P} />
                      </div>
                      <PaymentMethodBlockList platformId={(selectedPlatform && selectedPlatform.id) || platform.id} />
                    </Accordion>
                  </>
                </GeneralBlock>
              </TabPanel>
            )}
          </>
        )}
        {tabHeaders.includes(GDPR) && (
          <TabPanel>
            <GeneralBlock isShadow={false}>
              <WallGdprBlock />
            </GeneralBlock>
          </TabPanel>
        )}

      </Tabs>

      <FlexibleModalContainer
        fullOnMobile={false}
        className={`${style.mediaModal} ${modalStyle.mediumModal}`}
        isModalOpen={showPopup}
        closeModal={() => setShowPopup(false)}
      >
        <div>
          <div className={style.modalContent}>
            {/* <h3 className={style.modalTitle}>⚠️ Confirmer l’annulation de votre abonnement</h3> */}
            <div style={titleStyle}>
              ⚠️ {formatMessage({ id: "modal.title.confirm.cancel.subscription" })}
            </div>
            <div style={textStyle}>
              <p>{formatMessage({ id: "modal.text.confirm.cancel.subscription" })} </p>
              <p>👉 {formatMessage({ id: "modal.text1.confirm.cancel.subscription" })}</p>
              <ul style={listStyle}>
                <li>{formatMessage({ id: "modal.text2.confirm.cancel.subscription" })}</li>
                <li>{formatMessage({ id: "modal.text3.confirm.cancel.subscription" })}</li>
                <li>{formatMessage({ id: "modal.text4.confirm.cancel.subscription" })}</li>
              </ul>

              <p>❗{formatMessage({ id: "modal.text5.confirm.cancel.subscription" })} <strong>{selectedProgramName}</strong>{formatMessage({ id: "modal.text6.confirm.cancel.subscription" })}</p>

              <p><strong>{formatMessage({ id: "modal.text7.confirm.cancel.subscription" })}</strong></p>

            </div>
            <br />

            <DynamicFormattedMessage
              tag={Button}
              onClick={() => {
                cancelUserStripeSubscriptionApi();
                setShowPopup(false);
              }}
              type={BUTTON_MAIN_TYPE.SECONDARY}
              id="modal.btn.cancel.subscription"

            />
            <br /><br />

            <DynamicFormattedMessage
              tag={Button}
              onClick={() => {
                setShowPopup(false);
              }}
              type={BUTTON_MAIN_TYPE.PRIMARY}
              id="modal.btn.continu.subscription"

            />
          </div>
        </div>
      </FlexibleModalContainer>

    </GeneralBlock>
  );
};

export default SettingsMainBlock;

import React, { createContext, useEffect } from 'react';
import { useHistory } from 'react-router';

import HeadingAtom from 'components/atoms/ui/Heading';
import NavLanguageSelector from 'components/molecules/onboarding/NavLanguageSelector';
import PersonalInformationFormWrapper from 'components/organisms/form-wrappers/PersonalInformationFormWrapper';
import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import FraudInfoModal from 'components/organisms/modals/FraudInfoModal';
import ImageUploadModal from 'components/organisms/modals/ImageUploadModal';
import { useAvatarPictureConfigurations } from 'hooks/useAvatarPictureConfigurations';
import { SECONDARY } from 'constants/general';
import { checkIsFreePlanCookie } from 'utils/general';
import { createPlatform } from 'store/actions/boardingActions';
import { getUserSessionSelectedPlatform } from 'services/UserDataServices';

import style from 'assets/style/components/LeftSideLayout.module.scss';
import componentStyle from 'assets/style/components/LeftSideLayout.module.scss';

export const AvatarContext = createContext(null);

/**
 * Page component used to display personal information page
 *
 * @constructor
 */
const PersonalInformationPage = () => {
  const { container, basicContainer, centerContainer } = style;
  const history = useHistory();
  const sliderConfig = useAvatarPictureConfigurations();
  const platformId = getUserSessionSelectedPlatform();

  useEffect(() => {
    if (checkIsFreePlanCookie() && !platformId) {
      createPlatform(platformId, history);
    }
  }, []);

  return (
    <LeftSideLayout theme={SECONDARY} optionalClass={componentStyle.sidebarMenuIconRight}>
      <NavLanguageSelector />
      <AvatarContext.Provider value={sliderConfig}>
        <div className={`${container} ${basicContainer} ${centerContainer}`}>
          <HeadingAtom size="3" textId="personalInformation.title" className="primary" />
          <PersonalInformationFormWrapper />
          <FraudInfoModal />
          <ImageUploadModal context={AvatarContext} imageModal="imageUploadModal" />
        </div>
      </AvatarContext.Provider>
    </LeftSideLayout>
  );
};

export default PersonalInformationPage;

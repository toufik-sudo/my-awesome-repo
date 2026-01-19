import React from 'react';

import IntroductionBanner from 'components/molecules/wall/introduction/IntroductionBanner';
import IntroductionBody from 'components/molecules/wall/introduction/IntroductionBody';
import IntroPlaceholder from 'components/molecules/wall/placeholders/IntroPlaceholder';
import RewardsMechanismBlock from 'components/organisms/wall/beneficiary/RewardsMechanismBlock';
import { useIntroBlockData } from 'hooks/wall/beneficiary/useIntroBlockData';
import { FREEMIUM, PROGRAM_TYPES } from '../../../../constants/wall/launch';

/**
 * Organism component used to render introduction block
 *
 * @constructor
 */
const IntroductionBlock = () => {
  const {
    isProgramSelected,
    programDetails,
    isPeopleManager,
    isIntroLoading,
    isBodyOpen,
    setBody
  } = useIntroBlockData();

  if (!Object.keys(programDetails).length || !isProgramSelected) return null;
  const { startDate, endDate, socialMediaAccounts, termsAndConditionsUrl, type } = programDetails;
  const { menuTitle, pictureUrl, content, bannerTitle } = programDetails && programDetails.pages?.length > 0 ? programDetails.pages[0] : {menuTitle: '', pictureUrl: '', content: '', bannerTitle:''};

  if (isIntroLoading) return <IntroPlaceholder />;

  return (
    <div>
      <IntroductionBanner {...{ image: pictureUrl, title: bannerTitle }} />
      {/* <IntroductionBody
        {...{
          content,
          date: { startDate, endDate },
          socialMedia: socialMediaAccounts || {},
          title: menuTitle,
          termsAndConditionsUrl,
          isBodyOpen,
          setBody
        }}
      /> */}
      {type !== PROGRAM_TYPES[FREEMIUM] && <RewardsMechanismBlock {...{ programDetails, isPeopleManager }} />}
    </div>
  );
};

export default IntroductionBlock;

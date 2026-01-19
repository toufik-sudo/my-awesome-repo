import React from 'react';
import ReactTooltip from "react-tooltip";
import { CLOUD_REWARDS_COMPANY_LOGO_ALT } from 'constants/general';

import style from 'assets/style/components/LeftSideLayout.module.scss';
import IntroductionBody from '../../molecules/wall/introduction/IntroductionBody';
import { useIntroBlockData } from '../../../hooks/wall/beneficiary/useIntroBlockData';
import { TOOLTIP_FIELDS } from '../../../constants/tootltip';

/**
 *  Molecule component used to render user company logo in left side panel
 * @param companyLogo
 * @constructor
 */
const CompanyLogo = ({ companyLogo }) => {
  const { userWrapper, icon, userWrapperLoaded, iconCompany } = style;
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
  const { menuTitle, pictureUrl, content, bannerTitle } = programDetails && programDetails.pages?.length > 0
    ? programDetails.pages[0]
    : { menuTitle: '', pictureUrl: '', content: '', bannerTitle: '' };

  return (
    <div className={`${userWrapper} ${userWrapperLoaded}`}>
      <div className={`${icon} ${iconCompany}`} style={{ marginTop: '0' }}>
        <img
          src={companyLogo}
          data-tip
          data-for="tooltip-company-logo"
        />
      </div>

      <ReactTooltip
        id="tooltip-company-logo"
        clickable={true}
        place={TOOLTIP_FIELDS.PLACE_LEFT}
        effect={TOOLTIP_FIELDS.EFFECT_SOLID}
        className="nav-tooltip-company"
        delayShow={300}
        delayHide={300}
        getContent={() => (
          <IntroductionBody
            content={content}
            date={{ startDate, endDate }}
            socialMedia={socialMediaAccounts || {}}
            title={menuTitle}
            termsAndConditionsUrl={termsAndConditionsUrl}
            isBodyOpen={true}
            setBody={setBody}
          />
        )}
      />
    </div>
  );
};

export default CompanyLogo;

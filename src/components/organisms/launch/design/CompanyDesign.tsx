import React, { useEffect } from 'react';

import CompanyAvatar from 'components/organisms/launch/design/CompanyAvatar';
import CompanyBackgroundCover from 'components/organisms/launch/design/CompanyBackgroundCover';
import CompanyName from 'components/molecules/launch/design/CompanyName';
import { useSelector } from 'react-redux';
import { IStore } from 'interfaces/store/IStore';
import { COMPANY_NAME } from 'constants/wall/launch';

/**
 * Organism component used to render company design column
 *
 * @param companyNameState
 * @constructor
 */
const CompanyDesign = ({ companyNameState }) => {
  const [companyName, setCompanyName] = companyNameState;
  const { companyName: storeCompanyName } = useSelector((store: IStore) => store.launchReducer);

  useEffect(() => {
    if (storeCompanyName) setCompanyName(storeCompanyName);
  }, [storeCompanyName]);

  return (
    <div>
      <CompanyName {...{ companyName, setCompanyName, type: COMPANY_NAME }} />
      <CompanyAvatar />
      <CompanyBackgroundCover />
    </div>
  );
};

export default CompanyDesign;

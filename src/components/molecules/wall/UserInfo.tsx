import React, { useContext } from 'react';

import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import { getLoadedClass } from 'services/AccountServices';
import { UserContext } from 'components/App';
import { Link } from 'react-router-dom';
import { SETTINGS, WALL } from 'constants/routes';
import { FIRST_SETTINGS_TAB } from 'constants/wall/settings';

import style from 'assets/style/components/LeftSideLayout.module.scss';

/**
 * Molecule component used to render user information in left side panel
 */
const UserInfo = () => {
  const { userWrapper, icon, userWrapperLoaded, userInfo } = style;
  const { userData, imgLoaded, setImgLoaded } = useContext(UserContext);
  const { firstName, lastName, companyRole, croppedPicturePath } = userData;
  const loadedImageClass = getLoadedClass(imgLoaded, userWrapperLoaded);

  if (!userData.firstName && !imgLoaded) return <Loading type={LOADER_TYPE.LOCAL} />;

  return (
    <Link to={`/${WALL}${SETTINGS}/${FIRST_SETTINGS_TAB}`}>
      <div className={`${userWrapper} ${loadedImageClass}`}>
        <div className={icon}>
          <img src={croppedPicturePath} alt="user icon" onLoad={() => setImgLoaded(true)} />
        </div>
        <div className={userInfo}>
          <div>{firstName}</div>
          <div>{lastName}</div>
          <div>{companyRole}</div>
        </div>
      </div>
    </Link>
  );
};

export default UserInfo;

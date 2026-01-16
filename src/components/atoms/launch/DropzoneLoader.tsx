import React from 'react';

import Loading from 'components/atoms/ui/Loading';
import { LOADER_TYPE } from 'constants/general';
import style from 'assets/style/components/launch/UserListDownload.module.scss';

/**
 * Atom component used to render userInviteList loader
 * @constructor
 *
 * @see DropzoneLoaderStory
 */
const DropzoneLoader = () => (
  <div className={style.userListDropzone}>
    <Loading type={LOADER_TYPE.DROPZONE} />
  </div>
);

export default DropzoneLoader;

import React from 'react';

import ExtendedProgramsActions from 'components/organisms/programs/ExtendedProgramsActions';
import HyperProgramsList from 'components/molecules/programs/HyperProgramsList';
import Loading from 'components/atoms/ui/Loading';
import CreatePlatformModal from 'components/organisms/modals/CreatePlatformModal';
import { LOADER_TYPE } from 'constants/general';
import { useHyperProgramsList } from 'hooks/programs/useHyperProgramsList';
import { useParentPlatformSelection } from 'hooks/programs/useParentPlatformSelection';

import hyperStyle from 'sass-boilerplate/stylesheets/components/hyperadmin/Hyperadmin.module.scss';

/**
 * Handles the rendering of program blocks in order to design the components easier
 *
 * @constructor
 */
const HyperProgramPage = () => {
  const {
    userRole,
    platform,
    nestedSuperPlatforms,
    individualPlatforms,
    hasMore,
    isLoading,
    handleLoadMore
  } = useHyperProgramsList();

  const { enableOnly, setEnableOnly, setParentPlatform } = useParentPlatformSelection();

  if (isLoading && !nestedSuperPlatforms.length && !individualPlatforms.length)
    return <Loading type={LOADER_TYPE.DROPZONE} />;

  return (
    <div className={hyperStyle.programHyperContainer}>
      <ExtendedProgramsActions {...{ platform, userRole, nestedSuperPlatforms, individualPlatforms, setEnableOnly }} />
      <HyperProgramsList
        {...{
          individualPlatforms,
          nestedSuperPlatforms,
          hasMore,
          isLoading,
          handleLoadMore,
          enableOnly,
          setParentPlatform
        }}
      />
      <CreatePlatformModal
        onPlatformCreateDone={platformAdded => {
          setEnableOnly(null);
          platformAdded && handleLoadMore(0);
        }}
      />
    </div>
  );
};

export default HyperProgramPage;

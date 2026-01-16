import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import PlatformSettingsBlock from 'components/organisms/programs/PlatformSettingsBlock';
import Loading from 'components/atoms/ui/Loading';
import { WALL_TYPE, LOADER_TYPE } from 'constants/general';
import { useWallSelection } from 'hooks/wall/useWallSelection';

/**
 * Page component used to render platform settings page
 *
 * @constructor
 */
const PlatformSettingsPage = () => {
  const { hierarchicType, id } = useParams();
  const { platforms, loadingPlatforms, superPlatforms } = useWallSelection();

  const platform = useMemo(() => {
    // Check if selected platform is in normal or super platforms, and add the information to the returned object
    let selectedPlatform = { role: null };

    const selectedSuperPlatforms =
      (superPlatforms && superPlatforms.filter(platform => platform.id === Number(id) && platform)) || [];
    if (selectedSuperPlatforms.length > 0) {
      selectedPlatform = selectedSuperPlatforms[0];
    }

    const selectedPlatforms = (platforms && platforms.filter(platform => platform.id === Number(id) && platform)) || [];
    if (selectedPlatforms.length > 0) {
      selectedPlatform = selectedPlatforms[0];
    }

    return {
      id: Number(id),
      hierarchicType: Number(hierarchicType),
      ...selectedPlatform
    };
  }, [id, platforms, superPlatforms]);

  if (loadingPlatforms) {
    return <Loading type={LOADER_TYPE.FULL_PAGE} />;
  }

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <PlatformSettingsBlock platform={platform} />
    </LeftSideLayout>
  );
};

export default PlatformSettingsPage;

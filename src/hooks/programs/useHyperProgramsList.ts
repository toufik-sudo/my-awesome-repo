import { useEffect, useState, useContext, useCallback } from 'react';

import UsersApi from 'api/UsersApi';
import useUserPlatformRole from 'hooks/user/useUserPlatformRole';
import useInfiniteScrollLoader from 'hooks/general/useInfiniteScrollLoader';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { getRolesArrayFromPrograms } from 'services/HyperProgramService';
import { UserContext } from 'components/App';
import { DEFAULT_HYPER_PROGRAMS_LIST_SIZE, DEFAULT_HYPER_PROGRAMS_OFFSET } from 'constants/programs';
import { getGlobalUserRole } from 'services/security/accessServices';
import { PLATFORM_HIERARCHIC_TYPE } from 'constants/platforms';
import { useUpdateEffect } from 'hooks/general/useUpdateEffect';

export const useHyperProgramsList = () => {
  const { userData = {} } = useContext(UserContext);
  const { selectedPlatform } = useWallSelection();
  const [role, setUserRole] = useState(userData.highestRole);
  const userRole = useUserPlatformRole(role);
  const [nestedSuperPlatforms, setNestedSuperPlatforms] = useState([]);
  const [individualPlatforms, setIndividualPlatforms] = useState([]);

  useEffect(() => {
    setUserRole(state => Math.max(userData.highestRole, state));
  }, [userData.highestRole]);

  const loadPrograms = useCallback(
    async criteria => {
      if (!userData.uuid) {
        return { total: 0, entries: [] };
      }

      const { offset, size, ...rest } = criteria;

      const programsCriteria = {
        platformsOffset: offset,
        platformsSize: size <= DEFAULT_HYPER_PROGRAMS_LIST_SIZE ? DEFAULT_HYPER_PROGRAMS_LIST_SIZE : size,
        ...rest
      };

      return new UsersApi().getAdminPrograms(userData.uuid, programsCriteria);
    },
    [userData.uuid]
  );

  const { entries, hasMore, isLoading, handleLoadMore, setListCriteria } = useInfiniteScrollLoader({
    loadMore: loadPrograms,
    pageSize: DEFAULT_HYPER_PROGRAMS_LIST_SIZE
  });

  useUpdateEffect(() => setListCriteria({}), [loadPrograms, setListCriteria]);

  useEffect(() => {
    if (!entries.length) {
      return;
    }

    const roles = getRolesArrayFromPrograms(entries);
    const userRole = getGlobalUserRole(roles);
    const superPlatforms = entries.filter(
      platform =>
        platform.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.HYPER_PLATFORM &&
        platform.hierarchicType !== PLATFORM_HIERARCHIC_TYPE.INDEPENDENT
    );
    const onlyIndividualPlatforms = entries.filter(
      platform => platform.hierarchicType === PLATFORM_HIERARCHIC_TYPE.INDEPENDENT
    );

    setNestedSuperPlatforms(superPlatforms);
    setIndividualPlatforms(onlyIndividualPlatforms);
    setUserRole(state => Math.max(state, userRole));
  }, [entries]);

  return {
    platform: selectedPlatform,
    userRole,
    nestedSuperPlatforms,
    individualPlatforms,
    hasMore,
    isLoading,
    handleLoadMore
  };
};

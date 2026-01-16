import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { DASHBOARD_ROUTE, WALL_ROUTE } from 'constants/routes';
import { setIsProgramSelectionLocked, forceActiveProgram } from 'store/actions/wallActions';
import { PLATFORM_SELECTION_DELAY } from 'constants/general';
import { isUserAdmin } from 'services/security/accessServices';

/**
 * Hook used to handle redirect on program details request
 *
 * @param program
 */
const useProgramDetailsRedirect = program => {
  const openToRoute = isUserAdmin(program.platform.role) ? DASHBOARD_ROUTE : WALL_ROUTE;
  const history = useHistory();
  const dispatch = useDispatch();

  const onOpen = useCallback(() => {
    dispatch(forceActiveProgram({ programId: program.id, forcedPlatformId: program.platform.id }));
    setTimeout(() => dispatch(setIsProgramSelectionLocked(false)), PLATFORM_SELECTION_DELAY);

    history.push(openToRoute);
  }, [program, openToRoute, history, dispatch]);

  return { onOpen };
};

export default useProgramDetailsRedirect;

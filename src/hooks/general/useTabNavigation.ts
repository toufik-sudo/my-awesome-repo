import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';

/**
 * Hook used to handle navigation between tabs
 * @param tabHeaders
 * @param baseUrl
 */
export const useTabNavigation = (tabHeaders, baseUrl) => {
  const history = useHistory();
  const { tab } = useParams();
  const { state, search } = useLocation();
  const [index, setIndex] = useState(0);

  const setTabIndex = i => {
    setIndex(i);
    history.push({ pathname: `${baseUrl}/${tabHeaders[i]}`, search, state });
  };

  useEffect(() => {
    const currentTab = Math.max(tabHeaders.indexOf(tab), 0);
    setTabIndex(currentTab);
  }, [tab, tabHeaders]);

  return { index, setTabIndex };
};

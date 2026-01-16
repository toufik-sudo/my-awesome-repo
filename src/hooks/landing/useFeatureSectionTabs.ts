import { useState } from 'react';
import { useIntl } from 'react-intl';

import { processTranslations } from 'services/SectionsServices';

/**
 * Hook used to handle feature section tabs
 */
export const useFeatureSectionTabs = () => {
  const { messages } = useIntl();
  const labels = processTranslations(messages, 'features.', '.info');
  const options = processTranslations(messages, 'option.');
  const [activeBox, setActiveBox] = useState<number>(0);

  return { labels, options, activeBox, setActiveBox };
};

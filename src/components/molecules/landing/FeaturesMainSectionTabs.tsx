import React from 'react';

import FeaturesContainer from 'components/molecules/landing/FeatureSingleBox';
import { useFeatureSectionTabs } from 'hooks/landing/useFeatureSectionTabs';

/**
 * Molecule component used to render tabs on feature section
 *
 * @constructor
 */
const FeaturesMainSectionTabs = () => {
  const { activeBox, setActiveBox, labels } = useFeatureSectionTabs();

  return (
    <>
      {labels.map((label, index) => (
        <FeaturesContainer {...{ index, label, activeBox, setActiveBox }} key={label} />
      ))}
    </>
  );
};

export default FeaturesMainSectionTabs;

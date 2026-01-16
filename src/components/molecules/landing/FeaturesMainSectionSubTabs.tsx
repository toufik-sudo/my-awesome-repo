import React, { memo } from 'react';

import FeatureSubcategory from 'components/atoms/landing/FeatureSubcategory';
import { FEATURE_SUBCATEGORY_ICONS } from 'constants/landing';
import { useFeatureSectionTabs } from 'hooks/landing/useFeatureSectionTabs';

import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/Features.module.scss';

/**
 * Molecule component used to render features sub tabs
 *
 * @constructor
 */
const FeaturesMainSectionSubTabs = () => {
  const { options } = useFeatureSectionTabs();

  return (
    <div className={`${grid['container-fluid']} ${componentStyle.featuresSubTabSection}`}>
      <div className={`${grid['row']} ${grid['justify-content-between']}`}>
        {options.map((key, index) => (
          <FeatureSubcategory iconBlock={FEATURE_SUBCATEGORY_ICONS[key]} titleId={key} key={key} index={index} />
        ))}
      </div>
    </div>
  );
};

export default memo(FeaturesMainSectionSubTabs);

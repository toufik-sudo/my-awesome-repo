import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';

/**
 * Component used to render products linked to goal
 * @param moreProductsCount
 * @constructor
 */
const GoalMoreProducts = ({ moreProductsCount }) => (
  <DynamicFormattedMessage
    id="wall.intro.rewards.products.more"
    tag={HTML_TAGS.SPAN}
    values={{
      moreProductsCount
    }}
  />
);

export default GoalMoreProducts;

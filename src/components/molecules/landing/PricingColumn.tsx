import PricingRow from 'components/molecules/landing/PricingRow';
import { TDynamicObject } from 'interfaces/IGeneral';
import React from 'react';

/**
 * Molecule component used to render a column for pricing section
 * @param sortedPricingData
 * @constructor
 */
const PricingColumn = (sortedPricingData: TDynamicObject[]) =>
  sortedPricingData.map((pricingElement, key) => (
    <PricingRow key={key} pricingElement={pricingElement} columnIndex={key + 1} />
  ));

export default PricingColumn;

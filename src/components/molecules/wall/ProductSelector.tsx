import React, { useMemo } from 'react';
import Select from 'react-select';
import { FormattedMessage, useIntl } from 'react-intl';
import { LayoutList } from 'lucide-react';

import { IFormDropdownOption } from 'interfaces/forms/IForm';
import { PRODUCT_ID_FIELD, PROGRAM_ID_FIELD } from 'constants/formDefinitions/genericFields';

import style from 'assets/style/common/Input.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render products dropdown input field
 *
 * @param field
 * @param selectedProduct
 * @param onProductChange
 * @param products
 * @param error
 * @constructor
 *
 */
const ProductSelector = ({
  field = PRODUCT_ID_FIELD,
  selectedProduct,
  onProductChange,
  products,
  error = undefined,
  className = ''
}) => {
  const intl = useIntl();
  const { label } = field;
  const { defaultInputStyle } = style;
  const options = useMemo(
    () =>
      products
        .filter(product => !!product.id)
        .map(product => ({
          ...product,
          label: product.name,
          value: product.id
        })),
    [products]
  );
  const { displayFlex, flexSpace1, flexSpace8, flexSpace05, withPrimaryColorHover, withGrayAccentColor } = coreStyle;

  return (
    <div className={displayFlex}>
      <div className={`${flexSpace05} ${coreStyle['flex-center-vertical']} ${className}`}>
        <LayoutList size={18} strokeWidth={1.75} className={`${flexSpace1} ${withPrimaryColorHover} ${withGrayAccentColor}`} />
        <Select
          name={label}
          value={selectedProduct}
          isSearchable={true}
          id={label}
          className={`${defaultInputStyle} ${flexSpace8}`}
          onChange={(option: IFormDropdownOption) => onProductChange(option)}
          options={options}
          placeholder={intl.formatMessage({ id: `form.placeholder.${label}` })}
        />
        {error && (
          <div className={style.error}>
            <FormattedMessage id={`form.validation.${error}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSelector;

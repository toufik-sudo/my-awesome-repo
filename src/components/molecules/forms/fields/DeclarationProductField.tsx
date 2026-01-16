import React from 'react';
import Select from 'react-select';
import { useIntl } from 'react-intl';

import TextInput from 'components/atoms/ui/TextInput';
import SpringAnimation from 'components/molecules/animations/SpringAnimation';
import { setTranslate } from 'utils/animations';
import { DELAY_TYPES } from 'constants/animations';
import { ValidationMessage } from 'components/molecules/forms/fields/ValidationMessage';
import { useDeclarationProductFieldData } from 'hooks/declarations/useDeclarationProductFieldData';
import { DeclarationProductCheckbox } from 'components/molecules/forms/contents/DeclarationProductCheckbox';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/WallUserDeclarationsBlock.module.scss';
import style from 'assets/style/components/Navbar.module.scss';
import inputStyle from 'assets/style/common/Input.module.scss';

/**
 * Field rendered inside a generic form used for handling the product mapping when created a declaration
 *
 * @param field
 * @param form
 * @constructor
 */
const DeclarationProductField = ({ field, form, setMeasurementName = null }) => {
  const { formatMessage } = useIntl();
  const { fieldError, hasValue } = style;
  const { values, errors, touched } = form;
  const { extraConstraints, label } = field;
  const inputIsValid = errors[label] && touched[label] && errors[label];
  const inputHasValue = values[label] ? hasValue : '';
  const inputHasError = inputIsValid ? fieldError : '';
  const {
    hasOnlySpecificGoals,
    hasMixedData,
    currentProducts,
    isPlainText,
    selectedProductOption,
    setIsPlainText,
    reloadKey,
    setProductData
  } = useDeclarationProductFieldData(form, field, setMeasurementName);

  return (
    <div className={componentStyle.createDeclarationCustomInput}>
      <div className={`${inputHasValue} ${inputHasError}`}>
        <DeclarationProductCheckbox
          labelId="wall.userDeclarations.products.checkbox"
          hasMixedData={hasMixedData}
          onClick={() => setIsPlainText(false)}
          isChecked={!isPlainText}
        />

        {(hasOnlySpecificGoals || hasMixedData) && (
          <>
            <Select
              placeholder={formatMessage({ id: 'wall.userDeclarations.products.checkbox' })}
              key={reloadKey}
              value={selectedProductOption}
              onChange={({ value: productId }) => setProductData({ productId })}
              options={currentProducts}
              isDisabled={isPlainText}
              maxMenuHeight={250}
              className={`${style.lswitch} ${componentStyle.customSelect} ${
                isPlainText ? componentStyle.disabled : ''
              }`}
            />
          </>
        )}
        <DeclarationProductCheckbox
          labelId="wall.userDeclarations.products.others"
          hasMixedData={hasMixedData}
          onClick={() => setIsPlainText(true)}
          isChecked={isPlainText}
        />
        {isPlainText && (
          <TextInput
            value={selectedProductOption}
            onChange={({ target }) => setProductData({ otherProductName: target.value })}
            wrapperClass={`${inputStyle.container} ${inputStyle.floating}`}
            hasLabel={true}
            labelId="wall.userDeclarations.product"
          />
        )}
      </div>
      <SpringAnimation className={inputStyle.errorRelative} settings={setTranslate(DELAY_TYPES.NONE)}>
        <ValidationMessage {...{ errors, touched, label, extraConstraints }} />
      </SpringAnimation>
    </div>
  );
};

export default DeclarationProductField;



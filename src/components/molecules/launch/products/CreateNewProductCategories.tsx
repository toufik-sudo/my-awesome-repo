import React, { useCallback } from 'react';
import AsyncSelect from 'react-select/async';
import { useIntl } from 'react-intl';

import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import DropdownCount from 'components/atoms/launch/products/DropdownCounter';
import { getCategoriesForDropdown } from 'store/actions/launchActions';
import { getDropdownStyle, processCategoriesForCreateProductCreation } from 'services/LaunchServices';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Molecule component used to render async select dropdown for categories
 *
 * @param setCategoriesIds
 * @constructor
 */
const CreateNewProductCategories = ({ setCategoriesIds }) => {
  const { formatMessage } = useIntl();
  const platformId = usePlatformIdSelection();

  const onLoadOptions: any = useCallback(() => getCategoriesForDropdown(platformId), [platformId]);

  return (
    <div className={style.createProductCategory}>
      <AsyncSelect
        placeholder={formatMessage({ id: 'launchProgram.products.placeholder.addCategory' })}
        components={{ MultiValue: DropdownCount }}
        onChange={categories => setCategoriesIds(processCategoriesForCreateProductCreation(categories))}
        closeMenuOnSelect={false}
        isMulti
        cacheOptions
        isSearchable={true}
        loadOptions={onLoadOptions}
        defaultOptions
        hideSelectedOptions={false}
        isClearable={false}
        styles={{ option: getDropdownStyle }}
      />
    </div>
  );
};

export default CreateNewProductCategories;

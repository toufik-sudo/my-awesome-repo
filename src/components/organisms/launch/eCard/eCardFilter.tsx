/* eslint-disable quotes */
import React, {
  CSSProperties,
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  MouseEventHandler,
  useEffect,
  useState
} from 'react';
import eCardStyle from 'sass-boilerplate/stylesheets/components/launch/Ecard.module.scss';
// import Select, { IndicatorProps } from 'react-select';
// import { CSSObject } from '@emotion/serialize';
import { CatalogueService, SearchService, OpenAPI, CatalogueRequest, ProductFromCatalogue } from 'api/huuray';
import { useIntl } from 'react-intl';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Multiselect from 'multiselect-react-dropdown';
import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { DE_VALUE, EN_VALUE, ES_VALUE, FR_VALUE, LANGUAGE_OPTIONS } from 'constants/i18n';
import { getCurrentBrowserLanguage, getBrowserLanguage } from 'services/IntlServices';
// import axiosInstance from 'config/axiosConfig';
import axios from 'axios';
import { CONTENT_TYPE, APPLICATION_JSON } from 'constants/api';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';


export interface EcardOption {
  readonly value?: string;
  readonly label?: string;
  readonly color?: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
  readonly isCats?: boolean;
}

/**
 * Page component used to render EcardSearch filter section
 *
 * @constructorb .
 */
const EcardFilter = ({
  eCardList,
  setEcardFiltredList,
  eCardFiltredList,
  setAllCheckedList,
  eCardSelectedList,
  setEcardSelectedList,
  isConversionEcard,
  sortCountiesList,
  setDataStep,
  ecardDataSave
}) => {
  const [countriesOptions, setCountriesOptions] = useState < EcardOption[] > ([]);
  const [categoriesOptions, setCategoriesOptions] = useState < EcardOption[] > ([]);
  const [selectedListCategories, setSelectedListCategories] = useState < EcardOption[] > ([]);
  const [selectedListCountrie, setSelectedListCountrie] = useState < EcardOption[] > ([]);
  const [filtredData, setFiltredData] = useState < ProductFromCatalogue[] > ([]);
  const [searchData, setSearchData] = useState('');
  const [selectedNbr, setSelectedNbr] = useState(0);
  const [isSearchData, setIsSearchData] = useState(false);
  const [isAllCheckedFilter, setIsAllCheckedFilter] = useState(false);
  const {
    cardFilter,
    searchBar,
    btnSearch,
    blockFilter,
    blockFilterBrand,
    blockFilterCat,
    searchBarConvert,
    btnConvert,
    blockFilterCountry,
    blockFilterAll,
    cardFilterRow1,
    cardFilterRow2,
    customMultiselect,
    paddingLeft5,
    paddingLeft5Convert,
    cardFilterRow1Convert,
    blockFilterCountryConvert,
    blockFilterCatConvert,
    blockFilterBrandConvert,
    cardFilterRow1BtnDeleteAll
  } = eCardStyle;
  const CustomClearText: FunctionComponent = () => <>clear all</>;

  // const ClearIndicator = (props: IndicatorProps<EcardOption, true>) => {
  //   const {
  //     children = <CustomClearText />,
  //     getStyles,
  //     innerProps: { ref, ...restInnerProps }
  //   } = props;
  //   return (
  //     <div
  //       {...restInnerProps}
  //       ref={ref}
  //       style={getStyles("clearIndicator", props) as CSSProperties}
  //     >
  //       <div style={{ padding: "0px 5px" }}>{children}</div>
  //     </div>
  //   );
  // };
  // const ClearIndicatorStyles = (
  //   base: CSSObject,
  //   state: IndicatorProps<EcardOption, true>
  // ): CSSObject => ({
  //   ...base,
  //   cursor: "pointer",
  //   color: state.isFocused ? "blue" : "black"
  // });

  const { formatMessage } = useIntl();

  /**
   * This function sets the filter data for eCards by retrieving country and category information 
   * based on the current browser language. It fetches country names from a JSON file and 
   * constructs options for countries and predefined categories, which are then set in the state.
   */
  const setFiltersdata = async () => {
    let cats = [];
    let countries = [];
    const currentLanguage = getCurrentBrowserLanguage(getBrowserLanguage(), LANGUAGE_OPTIONS);
    let objCountries = null;
    if (currentLanguage.value == FR_VALUE || currentLanguage.value == ES_VALUE || currentLanguage.value == DE_VALUE) {
      const getCountries = await axios.get(`/data/countries_${currentLanguage.value}.json`, {
        headers: {
          [CONTENT_TYPE]: APPLICATION_JSON
        }
      });
      objCountries = getCountries.data;
    }

    eCardList.forEach((element: ProductFromCatalogue) => {
      if (countries.length == 0 || !countries.some(e => e.value == element.CountryCode || element.CountryCode == '')) {
        countries.push({
          value: element.CountryCode,
          label: objCountries ? objCountries[element.CountryCode] : element.Country,
          color: '',
          isFixed: false,
          isDisabled: false,
          isCats: false
        });
      }
    });

    const tradCats = [
      'Home',
      'Travel',
      'Experiences',
      'Fashion',
      'Entertainment',
      'Others',
      'Department',
      'Supermarkets',
      'Restaurants',
      'Beauty',
      'Electronics',
      'Sports',
      'Kids'
    ];

    tradCats.forEach(elem => {
      let label = formatMessage({ id: 'eCard.filter.category.' + elem });
      cats.push({
        value: elem,
        label: label,
        color: '',
        isFixed: false,
        isDisabled: false,
        isCats: true
      });
    });
    setCountriesOptions(countries);
    setCategoriesOptions(cats);
  };

  useEffect(() => {
    const nbr = eCardSelectedList?.length || 0;
    setSelectedNbr(nbr);
    console.log({ setSelectedNbr: nbr });
  }, [eCardSelectedList]);

  useEffect(() => {
    setFiltersdata();
  }, []);

  /**
   * 
   * This function filters the eCardList based on the searchData input. If searchData is not empty 
   * or just whitespace, it searches for elements in eCardList whose BrandName includes 
   * the searchData (case insensitive). The filtered results are then stored in filtredData 
   * and ecardFiltredList, and a flag is set to indicate that search data is present.
   */

  const filterData = (event: any) => {
    // const isSearch = event.target.getAttribute('id') == 'searchIcon';
    // const isSearch = true;
    if (searchData && searchData != '' && searchData != ' ') {
      let dataSearch = eCardList.filter(
        (element: ProductFromCatalogue) => element.BrandName?.toLowerCase().indexOf(searchData.toLowerCase()) >= 0
      );
      setFiltredData(dataSearch);
      setEcardFiltredList(dataSearch);
      setIsSearchData(true);
    }
  };

  const removeFromfilterData = (selectedList: EcardOption[], selectedItem: EcardOption) => {
    if (filtredData && filtredData.length > 0 && selectedList && selectedList.length > 0) {
      let dataSearch = [];
      if (selectedItem.isCats) {
        setSelectedListCategories(selectedList);
        dataSearch = filtredData?.filter((element: ProductFromCatalogue) => {
          return selectedList.filter((f: EcardOption) => element.Categories.indexOf(f.value) >= 0).length != 0;
        });
      } else {
        setSelectedListCountrie(selectedList);
        dataSearch = filtredData?.filter((element: ProductFromCatalogue) => {
          return selectedList.filter((f: EcardOption) => element.CountryCode == f.value).length != 0;
        });
      }
      setFiltredData(dataSearch);
      setEcardFiltredList(dataSearch);
    } else if (!selectedList || selectedList?.length == 0) {
      if (selectedItem.isCats) {
        setSelectedListCategories([]);
        multiFilterData(selectedListCountrie, { isCats: false });
      } else {
        setSelectedListCountrie([]);
        multiFilterData(selectedListCategories, { isCats: true });
      }
    }
  };

  /**
   * 
   * @param selectedList 
   * @param selectedItem 
   * This function filters a list of eCards based on selected categories and countries. 
   * It updates the filtered data based on the user's selection, ensuring that the results 
   * reflect the current filters for categories and countries. The function also sorts the 
   * results based on a predefined order for brand names, prioritizing items from a specific 
   * country ("FR") when necessary.
   */

  const multiFilterData = (selectedList: EcardOption[], selectedItem: EcardOption) => {
    // unSelectAll();
    let dataSearch = [];
    let data = isSearchData ? filtredData : eCardList;
    if (selectedItem.isCats) {
      setSelectedListCategories(selectedList);
    } else {
      setSelectedListCountrie(selectedList);
    }
    if (selectedItem.isCats || selectedListCategories?.length > 0) {
      let selection = selectedItem.isCats ? selectedList : selectedListCategories;
      dataSearch = data?.filter((element: ProductFromCatalogue) => {
        return selection.filter((f: EcardOption) => element.Categories.indexOf(f.value) >= 0).length != 0;
      });
    }
    if (!selectedItem.isCats || selectedListCountrie?.length > 0) {
      data = dataSearch?.length > 0 ? dataSearch : data;
      let selection = !selectedItem.isCats ? selectedList : selectedListCountrie;
      if (selection?.length > 0) {
        dataSearch = data?.filter((element: ProductFromCatalogue) => {
          return selection.filter((f: EcardOption) => element.CountryCode == f.value).length != 0;
        });
      } else {
        dataSearch = data;
      }
      const filterCountry = selectedList.length > 0 ? 'FR' : selectedItem.value;
      const defautSort = sortCountiesList ? sortCountiesList['DEFAULT'] : [];
      dataSearch = dataSearch.sort((a, b) => {
        const aIndexOf = defautSort.indexOf(a.BrandName);
        const bIndexOf = defautSort.indexOf(b.BrandName);
        if ((aIndexOf == -1 && bIndexOf == -1) || a.CountryCode != filterCountry) {
          return 0;
        }
        if (aIndexOf == bIndexOf) {
          return 0;
        }
        if (aIndexOf > bIndexOf) {
          return -1;
        }
        if (bIndexOf > aIndexOf && b.CountryCode == 'FR') {
          return 1;
        }
      });
    }
    setFiltredData(dataSearch);
    setEcardFiltredList(dataSearch);
  };

  /**
   * 
   * @param event 
   * This function handles the change event of an input element, retrieves the 'id' 
   * attribute of the target element, and updates the search data state with the input's current value.
   */
  function searchForBrands(event: ChangeEvent<HTMLInputElement>): void {
    event.target.getAttribute('id');
    setSearchData(event.target.value);
  }

  /**
   * 
   * @param event 
   * This function handles the checkbox state change for filtering eCards. It updates 
   * the selection state based on whether all checkboxes are checked or unchecked, modifies 
   * the active status of each eCard, and updates related state variables accordingly.
   */
  function onCheckBox(event: ChangeEvent<HTMLInputElement>): void {
    const bool = !isAllCheckedFilter;
    setAllCheckedList(bool);
    setIsAllCheckedFilter(bool);
    // eslint-disable-next-line prettier/prettier
    // setEcardSelectedList([]);
    const array = [];
    eCardList.map(elem => {
      if (bool) {
        array.push(elem);
      }
      elem.isActive = bool;
      return elem;
    });
    setEcardSelectedList(array);
    setDataStep(ecardDataSave(array));
    setFiltredData(eCardList);
    setEcardFiltredList(eCardList);
    setSelectedNbr(eCardList.length || 0);
  }

  /**
   * This function unselects all eCards by setting the checked state to false, clearing the selected 
   * list, and marking each eCard in the list as inactive.
   */
  function unSelectAll(): void {
    setAllCheckedList(false);
    setEcardSelectedList([]);
    // setFiltredData(filtredData);
    eCardList.map(elem => {
      elem.isActive = false;
      return elem;
    });
  }

  /**
   * This function sets the state of all items to checked when called. 
   * It updates the checked status but does not modify the filtered data.
   */

  function selectAll(): void {
    const checkedCards: ProductFromCatalogue[] = eCardFiltredList || [];
    const arr = [];
    checkedCards.forEach(item => {
      item.isActive = true;
      arr.push(item);
    });
    setEcardSelectedList(arr);
    const nbr = eCardFiltredList?.length || 0;
    setSelectedNbr(nbr);
    if (checkedCards.length > 0) {
      setDataStep(ecardDataSave(arr));
      // setAllCheckedList(true);
      const content = document.getElementById('ecrad-content');
      if (content) {
        content.scrollTo({
          top: 0,
          behavior: 'smooth' // pour un défilement fluide
        });
      }
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth' // pour un défilement fluide
      });
    } else {
      setAllCheckedList(true);
    }
    // setFiltredData(filtredData);
  }

  /**
   * This function resets various filters related to eCards, including clearing selected categories, 
   * countries, and search data. It also sorts the eCard list based on the active status of each eCard,
   * ensuring that active eCards appear before inactive ones. 
   * Finally, it updates the filtered data states with the sorted eCard list.
   */
  const resetFilters = () => {
    setSelectedListCategories([]);
    setSelectedListCountrie([]);
    setSearchData('');
    // setAllCheckedList(false);
    // if (!isConversionEcard) {
    //   setIsAllCheckedFilter(false);
    // }
    // setEcardSelectedList([]);
    // // console.log(statusOptions);
    // eCardList.map(elem => {
    //   elem.isActive = false;
    //   return elem;
    // });
    eCardList.sort((a, b) => {
      // const aIndexOf = defautSort.indexOf(a.BrandName);
      // const bIndexOf = defautSort.indexOf(b.BrandName);
      if ((a.isActive && b.isActive) || (a.isActive && !b.isActive)) {
        return -1;
      }
      if ((!a.isActive && !b.isActive) || (!a.isActive && b.isActive)) {
        return 1;
      }
      return 0;
    });
    setFiltredData(eCardList);
    setEcardFiltredList(eCardList);
  };

  return (
    <div className={cardFilter}>
      <div className={`row ${!isConversionEcard ? cardFilterRow1 : cardFilterRow1Convert}`}>
        <div
          className={`${isAllCheckedFilter ? 'disabled input-group' : 'input-group'
            }  ${blockFilter} ${blockFilterCountry}`}
        >
          <label className="input-group-label">{formatMessage({ id: 'eCard.filter.country' })}</label>
          <Multiselect
            options={countriesOptions} // Options to display in the dropdown
            onSelect={multiFilterData} // Function will trigger on select event
            onRemove={multiFilterData} // Function will trigger on remove event
            selectedValues={selectedListCountrie}
            displayValue="label" // Property name to display in the dropdown options
            disable={isAllCheckedFilter}
            placeholder={formatMessage({ id: 'eCard.filter.country.placeholder' })}
            className={`input-group ${customMultiselect}`}
            showCheckbox={true}
            showArrow={true}
            selectedValueDecorator={(selectedList, _renderChip) => {
              console.log('_renderChip', _renderChip);
              console.log('selectedList', selectedList);
              return (
                <div
                  style={{ display: selectedListCountrie.length > 2 && selectedListCountrie[0].value != _renderChip.value ? 'none' : 'block' }}
                  className={selectedListCountrie.length > 2 && selectedListCountrie[0].value != _renderChip.value ? 'hide-selected-items' : 'first-selected-item'}
                >
                  {selectedListCountrie.length <= 2 && selectedList}
                  {selectedListCountrie.length > 2 && selectedListCountrie.length + formatMessage({ id: 'ddl.selected.items' })}
                </div>
              );
            }
            }

          />
        </div>
        <div
          className={`${isAllCheckedFilter ? 'disabled input-group' : 'input-group'} ${blockFilter} ${!isConversionEcard ? blockFilterCat : blockFilterCatConvert
            }`}
        >
          <label className="input-group-label">{formatMessage({ id: 'eCard.filter.category' })}</label>
          <Multiselect
            options={categoriesOptions} // Options to display in the dropdown
            onSelect={multiFilterData} // Function will trigger on select event
            onRemove={multiFilterData} // Function will trigger on remove event
            selectedValues={selectedListCategories}
            displayValue="label" // Property name to display in the dropdown options
            disable={isAllCheckedFilter}
            placeholder={formatMessage({ id: 'eCard.filter.category.placeholder' })}
            className={`input-group ${customMultiselect}`}
            showCheckbox={true}
            showArrow={true}
            selectedValueDecorator={(selectedList, _renderChip) => {
              console.log('_renderChip', _renderChip);
              console.log('selectedList', selectedList);
              return (
                <div
                  style={{ display: selectedListCategories.length > 2 && selectedListCategories[0].value != _renderChip.value ? 'none' : 'block' }}
                  className={selectedListCategories.length > 2 && selectedListCategories[0].value != _renderChip.value ? 'hide-selected-items' : 'first-selected-item'}
                >
                  {selectedListCategories.length <= 2 && selectedList}
                  {selectedListCategories.length > 2 && selectedListCategories.length + formatMessage({ id: 'ddl.selected.items' })}
                </div>
              );
            }
            }
          />
        </div>
        <div
          className={`${isAllCheckedFilter ? 'disabled input-group' : 'input-group'} ${blockFilter} ${!isConversionEcard ? blockFilterBrand : blockFilterBrandConvert
            }`}
        >
          <label className={`input-group-label ${!isConversionEcard ? paddingLeft5 : paddingLeft5Convert}`}>
            {' '}
            {formatMessage({ id: 'eCard.filter.brand' })}{' '}
          </label>
          <input
            disabled={isAllCheckedFilter}
            onChange={searchForBrands}
            className={`'form-control ' ${!isConversionEcard ? searchBar : searchBarConvert}`}
            id="searchBar"
            type="text"
            placeholder={formatMessage({ id: 'eCard.filter.placeholder' })}
            value={searchData}
          />
          <FontAwesomeIcon
            id="searchIcon"
            icon={faSearch}
            onClick={filterData}
            className={`'input-group' ${isAllCheckedFilter ? coreStyle.disabled : ''} ${!isConversionEcard ? btnSearch : btnConvert
              }`}
          />
        </div>
        <div className={cardFilterRow1BtnDeleteAll}>
          <ButtonFormatted
            onClick={resetFilters}
            variant={BUTTON_MAIN_VARIANT.INVERTED}
            type={BUTTON_MAIN_TYPE.PRIMARY}
            buttonText="btn.label.resetFilters"
            className={isAllCheckedFilter ? coreStyle.disabled : ''}
          />

        </div>
      </div>
      {!isConversionEcard && (
        <div className={`row ${cardFilterRow2}`}>
          <span></span>
          <Button
            onClick={selectAll}
            type={BUTTON_MAIN_TYPE.SECONDARY}
            disabled={isAllCheckedFilter}
            className={isAllCheckedFilter ? coreStyle.disabled : ''}
          >
            {formatMessage({ id: 'btn.label.checkAll' })} {` ( ${selectedNbr} )`}
          </Button>
          <Button
            onClick={unSelectAll}
            type={BUTTON_MAIN_TYPE.SECONDARY}
            disabled={isAllCheckedFilter}
            className={isAllCheckedFilter ? coreStyle.disabled : ''}
          >
            {formatMessage({ id: 'btn.label.unCheckAll' })}
          </Button>
          {!isConversionEcard && (
            <div className={`${blockFilter} ${blockFilterAll}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <label style={{ margin: '0', justifyContent: 'center', maxWidth: '10rem' }}>{formatMessage({ id: 'eCard.filter.allCards' })}</label>
              <input
                type="checkbox"
                name="all_eCards"
                id="all_eCards"
                checked={isAllCheckedFilter}
                onChange={onCheckBox}
                style={{ margin: '0' }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EcardFilter;

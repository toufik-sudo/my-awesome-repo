import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import TabItem from 'components/atoms/launch/products/TabItem';
import AddExistingProduct from 'components/organisms/launch/products/AddExistingProduct';
import CreateNewProducts from 'components/organisms/launch/products/CreateNewProducts';
import AddExistingCategory from 'components/organisms/launch/products/AddExistingCategory';
import CreateNewCategory from 'components/organisms/launch/products/CreateNewCategory';
import Button from 'components/atoms/ui/Button';
import Loading from 'components/atoms/ui/Loading';
import { PRODUCTS_TABS_CATEGORIES } from 'constants/wall/launch';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { useProduct } from 'hooks/launch/products/useProduct';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { LOADER_TYPE } from 'constants/general';

import style from 'assets/style/common/VericalTabs.module.scss';

/**
 * Organism component that Products wrapper
 *
 * @constructor
 */
const ProductsWrapper = () => {
  const {
    tabContainer,
    tabList,
    tabItem,
    tabItemAccent,
    tabItemAccentSelected,
    tabPanelItem,
    tabItemRegular,
    tabItemRegularSelected,
    productsWrapper,
    productsLoader,
    productsWrapperSubmitBtn
  } = style;
  const { handleTabChange, currentStep, handleProductNextStep, nextButtonAvailable, tabsLoading } = useProduct();

  if (!tabsLoading)
    return (
      <div className={productsLoader}>
        <Loading type={LOADER_TYPE.LOCAL} />
      </div>
    );

  return (
    <div className={productsWrapper}>
      <Tabs selectedIndex={currentStep} onSelect={handleTabChange} className={tabContainer}>
        <TabList className={tabList}>
          {PRODUCTS_TABS_CATEGORIES.map((tab, index) => (
            <Tab
              key={tab}
              className={`${tabItem} ${index > 1 ? tabItemRegular : tabItemAccent}`}
              selectedClassName={index > 1 ? tabItemRegularSelected : tabItemAccentSelected}
            >
              <TabItem textId={tab} />
            </Tab>
          ))}
        </TabList>
        <TabPanel className={tabPanelItem}>
          <CreateNewProducts />
        </TabPanel>
        <TabPanel className={tabPanelItem}>
          <AddExistingProduct />
        </TabPanel>
        <TabPanel className={tabPanelItem}>
          <CreateNewCategory />
        </TabPanel>
        <TabPanel className={tabPanelItem}>
          <AddExistingCategory />
        </TabPanel>
      </Tabs>
      <div className={productsWrapperSubmitBtn}>
        <DynamicFormattedMessage
          tag={Button}
          onClick={handleProductNextStep}
          type={nextButtonAvailable ? BUTTON_MAIN_TYPE.PRIMARY : BUTTON_MAIN_TYPE.DISABLED}
          id="form.submit.next"
        />
      </div>
    </div>
  );
};

export default ProductsWrapper;

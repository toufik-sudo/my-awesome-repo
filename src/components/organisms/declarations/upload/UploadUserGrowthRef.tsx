import React, { useState } from 'react';

import Button from 'components/atoms/ui/Button';
import ProductSelector from 'components/molecules/wall/ProductSelector';
import UserDeclarationFileDropzone from 'components/molecules/wall/declarations/upload/UserDeclarationFileDropzone';
import UserDeclarationTemplateDownload from 'components/molecules/wall/declarations/upload/UserDeclarationTemplateDownload';
import useUploadUserDeclarations from 'hooks/declarations/useUploadUserDeclarations';
import ProductListBlock from 'components/organisms/declarations/upload/ProductListBlock';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { emptyFn } from 'utils/general';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import buttonStyle from 'assets/style/common/Button.module.scss';
import styles from 'assets/style/components/PersonalInformation/PersonalInformation.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/wall/WallUserDeclarationsBlock.module.scss';
import grid from 'sass-boilerplate/stylesheets/vendors/bootstrap-grid.module.scss';
import useUploadUserGrowthRef from 'hooks/declarations/useUploadUserGrowthRef';
import { IStore } from 'interfaces/store/IStore';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { HTML_TAGS } from 'constants/general';

/**
 * Organism component used to render a User Declarations Upload
 * @param products
 * @constructor
 */
const UploadUserGrowthRef = ({ index, setIsGrowthRefLoaded, closeModal }) => {
  const [selectedProduct, setSelectedProduct] = useState<any>();
  const {
    onProductChange,
    errors,
    fileDropProps,
    submitting,
    isValid,
    onUpload
  } = useUploadUserGrowthRef(setIsGrowthRefLoaded, setSelectedProduct);

  const { fullProducts, cube } = useSelector((store: IStore) => store.launchReducer);
  const currentGoal = cube.goals[index];
  const allowedProducts = fullProducts
    .map(product => {
      if (currentGoal.specificProducts && currentGoal.productIds.includes(product.id)) {
        return product;
      }
    })
    .filter(productId => productId);

  const { flexSpaceMobile1, btnCenter, mt2, mb2, pt1, flex100 } = coreStyle;

  const getSelectedProduct = ()=>{
    return selectedProduct;
  }

  return (
    <div className={`${styles.wrapperCenter} ${componentStyle.addDeclaration}`}>
      <div onClick={closeModal} className={`${coreStyle.textCenterMobile} ${coreStyle.className} ${coreStyle.textLeft} ${coreStyle.pointer} ${coreStyle.withPrimaryColor}`}>      
        <FontAwesomeIcon icon={faChevronLeft} size={'2x'} className={`${coreStyle.mr1} ${coreStyle.displayInlineBlock} ${coreStyle.valignMiddle}`} />
        <DynamicFormattedMessage
          tag={HTML_TAGS.P}
          className={`${coreStyle.withFontMedium} ${coreStyle.displayInlineBlock} ${coreStyle.withRegularFont} ${coreStyle.valignMiddle}`}
          id={'wall.users.back'}
        />      
    </div>
      <ProductSelector
        {...{ selectedProduct, products: allowedProducts, onProductChange, error: errors.productError }}
        className={`${flexSpaceMobile1} ${flex100}`}
      />

      <div className={!selectedProduct ? coreStyle.disabled : ''}>
        <UserDeclarationTemplateDownload programId={null} selectedProduct={selectedProduct} goalIndex={index} />
        <UserDeclarationFileDropzone fileDropzoneProps={fileDropProps} />
        <div className={`${btnCenter} ${mt2} ${mb2} ${!selectedProduct ? coreStyle.disabled : ''}`}>
          <DynamicFormattedMessage
            disabled={submitting}
            tag={Button}
            id="wall.userDeclaration.validation.accept"
            className={buttonStyle.primaryinverted}
            onClick={isValid ? onUpload : emptyFn}
          />
        </div>
      </div>

      {/* <div className={grid['col-md-6']}>{productId && <ProductListBlock {...{ productId }} />}</div> */}

    </div>
  );
};

export default UploadUserGrowthRef;

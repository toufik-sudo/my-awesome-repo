import React from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { useLoadProducts } from 'hooks/declarations/useLoadProducts';
import { ProductList } from 'components/organisms/declarations/upload/ProductList';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

const ProductListBlock = ({ programId }) => {
  const { products, hasMore, isLoading, loadMore, scrollRef } = useLoadProducts(programId);

  return (
    <>
      <GeneralBlock>
        <p className={coreStyle.textCenter}>
          <FontAwesomeIcon icon={faInfoCircle} />
        </p>
        <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="wall.userDeclarations.upload.productsIdentifiers.info" />
      </GeneralBlock>
      <ProductList {...{ hasMore, loadMore, scrollRef, isLoading, products }} />
    </>
  );
};

export default ProductListBlock;

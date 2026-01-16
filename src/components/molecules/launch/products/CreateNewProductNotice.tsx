import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/components/launch/Products.module.scss';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';

/**
 * Molecule component used to render create new product notice
 *
 * @param productCreated
 * @param productError
 * @param className
 * @constructor
 */
const CreateNewProductNotice = ({ productCreated, productError, className = '' }) => {
  // const { createProductNoticeError, createProductNoticeSuccess, createProductNotice } = style;
  const { formatMessage } = useIntl();

  if(productCreated && !productError) {
    toast(formatMessage({ id: 'launchProgram.products.productCreated' }));
    return null;
  }

  if(productError) {
    toast(formatMessage({ id: productError }));
    return null;
  }

  return null;
  // return (
  //   <div className={className}>
  //     {productCreated && (
        
  //       <DynamicFormattedMessage
  //         tag="span"
  //         className={`${createProductNoticeSuccess} ${createProductNotice}`}
  //         id="launchProgram.products.productCreated"
  //       />
  //     )}
  //     {productError && (
  //       <DynamicFormattedMessage
  //         tag="span"
  //         className={`${createProductNoticeError} ${createProductNotice}`}
  //         id={productError}
  //       />
  //     )}
  //   </div>
  // );
};

export default CreateNewProductNotice;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

import { ACCEPTED_IMAGE_FORMAT } from 'constants/personalInformation';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { PRODUCT_IMAGE_UPLOAD } from 'constants/wall/launch';
import { HTML_TAGS } from 'constants/general';

import style from 'assets/style/components/launch/Products.module.scss';

/**
 * Atom component used to render image upload for create new product
 *
 * @param imageError
 * @param handleImageUpload
 * @constructor
 */
const CreateNewProductImageUpload = ({ handleImageUpload, previewImage, fileInputRef }) => (
  <div className={style.createProductImageUpload}>
    <input
      name={PRODUCT_IMAGE_UPLOAD}
      type="file"
      ref={fileInputRef}
      id={PRODUCT_IMAGE_UPLOAD}
      onChange={handleImageUpload}
      accept={ACCEPTED_IMAGE_FORMAT.toString()}
    />
    <label htmlFor={PRODUCT_IMAGE_UPLOAD}>
      <FontAwesomeIcon icon={faPen} />
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        id={`launchProgram.products.${previewImage ? 'editPicture' : 'uploadPicture'}`}
      />
    </label>
  </div>
);

export default CreateNewProductImageUpload;

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faWindowRestore } from '@fortawesome/free-solid-svg-icons';

import { HTML_TAGS } from 'constants/general';
import { ACCEPTED_IMAGE_FORMAT } from 'constants/personalInformation';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import componentStyle from 'sass-boilerplate/stylesheets/components/communication/CreateCampaignList.module.scss';
import errorStyle from 'assets/style/common/Input.module.scss';

/**
 * Renders a image input with preview and error handling
 *
 * @param image
 * @param imageId
 * @param disabled
 * @param onChange
 * @param onRemove
 * @param previewStyle
 * @param wrapperStyle
 * @param error
 * @param errorId
 * @constructor
 */
const CampaignImageUpload = ({
  image,
  imageId,
  disabled,
  onChange,
  onRemove,
  wrapperStyle = '',
  error = null,
  errorId = ''
}) => {
  const {
    createCampaignUpload,
    createCampaignRemoveImage,
    createCampaignWindowIcon,
    createCampaignImagePreview
  } = componentStyle;

  return (
    <div className={wrapperStyle || createCampaignUpload}>
      <div>
        {!image && (
          <>
            <input
              name={imageId}
              type="file"
              disabled={disabled}
              id={imageId}
              onChange={onChange}
              accept={ACCEPTED_IMAGE_FORMAT.toString()}
            />
            <label htmlFor={imageId}>
              <FontAwesomeIcon className={createCampaignWindowIcon} icon={faWindowRestore} />
            </label>
          </>
        )}
        {image && (
          <div className={createCampaignImagePreview}>
            <img src={URL.createObjectURL(image)} alt="Image preview" />
          </div>
        )}

        {!disabled && image && (
          <FontAwesomeIcon onClick={onRemove} className={createCampaignRemoveImage} icon={faTimes} />
        )}

        {error && <DynamicFormattedMessage className={errorStyle.errorRelative} tag={HTML_TAGS.P} id={errorId} />}
      </div>
    </div>
  );
};

export default CampaignImageUpload;

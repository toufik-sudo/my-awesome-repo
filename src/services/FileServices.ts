import { base64ImageToBlob } from 'utils/general';
import { USER_IMAGE_TYPE } from 'constants/personalInformation';
import { IMAGE_FORM_DATA_FIELDS } from 'constants/files';

/**
 * Create an array FormData used to handle image type
 *
 * @param fieldsData
 * @param fieldsName
 */
export const fileToFormDataArray = (fieldsData, fieldsName) => {
  const bodyFormData = new FormData();

  fieldsName.forEach((field, fieldIndex) =>
    fieldsData[fieldIndex].forEach((data, index) =>
      bodyFormData.append(`data[${index}][${field}]`, fieldsData[fieldIndex][index])
    )
  );

  return bodyFormData;
};

/**
 * Create a simple form data with given fields
 * @param fieldsData
 * @param fieldsName
 */
export const fileToFormData = (fieldsData, fieldsName) => {
  const bodyFormData = new FormData();
  fieldsName.forEach((field, index) => bodyFormData.append(field, fieldsData[index]));

  return bodyFormData;
};

export const fileToAvatarFormData = async (avatar, config, imageType = USER_IMAGE_TYPE.DESIGN_IMAGE) => {
  const fullImageFile = await base64ImageToBlob(avatar);
  return fileToFormDataArray([[fullImageFile], [config.name], [imageType]], IMAGE_FORM_DATA_FIELDS);
};

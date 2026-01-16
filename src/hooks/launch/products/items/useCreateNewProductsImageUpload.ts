import { useEffect, useState, useRef } from 'react';

import { IMAGE, MAX_PRODUCT_FILE_SIZE } from 'constants/general';
import { fileToFormDataArray } from 'services/FileServices';
import { USER_IMAGE_TYPE } from 'constants/personalInformation';
import { IMAGE_FORM_DATA_FIELDS } from 'constants/files';

/**
 * Hook used to handle all create new products image upload
 */
export const useCreateNewProductsImageUpload = setProductError => {
  const [previewImage, setPreviewImage] = useState('');
  const [selectedImage, setSelectedImage] = useState<any>('');
  const [formDataImage, setFormDataImage] = useState<any>('');
  const fileInputRef = useRef<any>();

  const handleImageUpload = e => {
    const currentImage = e.target.files[0];

    if (!currentImage) {
      return;
    }

    if (!currentImage.type.includes(IMAGE)) {
      setPreviewImage('');

      return setProductError('launchProgram.products.invalid.extension');
    }

    if (currentImage.size > MAX_PRODUCT_FILE_SIZE) {
      setPreviewImage('');
      return setProductError('launchProgram.products.invalid.size');
    }

    const reader = new FileReader();
    setSelectedImage(currentImage);
    setProductError('');

    reader.onloadend = () => setPreviewImage((reader as any).result);
    reader.readAsDataURL(currentImage);
  };

  useEffect(() => {
    if (selectedImage) {
      setFormDataImage(
        fileToFormDataArray(
          [[selectedImage], [selectedImage.name], [USER_IMAGE_TYPE.PRODUCT_IMAGE]],
          IMAGE_FORM_DATA_FIELDS
        )
      );
    }
  }, [selectedImage]);

  const clearSelections = () => {
    setPreviewImage('');
    setSelectedImage('');
    setFormDataImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return { previewImage, handleImageUpload, fileInputRef, formDataImage, clearSelections };
};

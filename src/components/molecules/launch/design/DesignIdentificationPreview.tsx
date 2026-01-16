import React, { useContext } from 'react';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import ContentsSelectionPreview from 'components/atoms/launch/contents/ContentsSelectionPreview';
import DesignIdentifBgCoverButton from 'components/organisms/launch/design/DesignIdentifBgCoverButton';

import style from 'sass-boilerplate/stylesheets/pages/DesignIdentification.module.scss';

/**
 * Molecule component used to render Design Identidication preview page
 *
 */
const DesignIdentificationPreview = ({ context }) => {
  const { designDefaultCoverImage, designPreviewBlock, designCoverWrapper, designCoverImage } = style;
  let contentsCoverOutput = <div className={designDefaultCoverImage} />;
  const {
    cropped: { croppedAvatar }
  } = useContext(context);

  if (croppedAvatar) {
    contentsCoverOutput = (
      <ContentsSelectionPreview
        {...{ croppedAvatar, className: designCoverWrapper, imageClassName: designCoverImage }}
      />
    );
  }

  return (
    <div className={designPreviewBlock}>
      <DesignIdentifBgCoverButton />
      {contentsCoverOutput}
    </div>
  );
};

export default DesignIdentificationPreview;

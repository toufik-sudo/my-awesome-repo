/* eslint-disable prettier/prettier */
import React, { useContext } from "react";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import ContentsSelectionPreview from "components/atoms/launch/contents/ContentsSelectionPreview";
import { DynamicFormattedMessage } from "components/atoms/ui/DynamicFormattedMessage";
import { useContentsTitlesColor } from "hooks/launch/contents/useContentsTitlesColor";
import { HTML_TAGS } from "constants/general";

import style from "assets/style/components/launch/Contents.module.scss";
import gridStyle from "assets/style/common/Grid.module.scss";
import labelStyle from "assets/style/common/Labels.module.scss";
import { useParams } from "react-router-dom";

/**
 * Molecule component used to render Contents Cover preview page
 */
const ContentsCoverPreview = ({ context, form }) => {
  const { step, stepIndex } = useParams();
  const { contentsPreviewBlock, contentsDefaultCoverImage, contentsCoverTitle, contentsCoverImageWrapper } = style;
  const { color } = useContentsTitlesColor();
  let contentsCoverOutput = <div className={contentsDefaultCoverImage} />;
  const {
    cropped: { croppedAvatar }
  } = useContext(context);

  if (croppedAvatar) {
    // console.log(avatarConfig);
    // console.log(fullAvatar);
    contentsCoverOutput = <ContentsSelectionPreview {...{ croppedAvatar, className: contentsCoverImageWrapper }} />;
  }

  return (
    <div className={gridStyle.col7}>
      <DynamicFormattedMessage
        tag={HTML_TAGS.P}
        className={labelStyle.defaultLabel}
        id="launchProgram.coverPreview.label"
      />
      <div className={contentsPreviewBlock}>
        <div className={contentsCoverTitle} style={{ color, position: "absolute" }}>
          {form.values.bannerTitle}
        </div>
        {contentsCoverOutput}
      </div>
    </div>
  );
};

export default ContentsCoverPreview;

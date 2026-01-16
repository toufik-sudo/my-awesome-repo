import React from 'react';
import Select from 'react-select';

import PostConfidentialityIcon from 'components/atoms/wall/PostConfidentiality/PostConfidentialityIcon';
import PostConfidentialityOption from 'components/atoms/wall/PostConfidentiality/PostConfidentialityOption';
import DropdownIndicators from 'components/atoms/wall/PostConfidentiality/DropdownIndicators';
import { getConfidentialityOnlyOptions, getPostEditOptions } from 'services/posts/postsServices';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import { CONFIDENTIALITY_DROPDOWN_STYLES } from 'constants/wall/posts';

import style from 'sass-boilerplate/stylesheets/components/wall/WallPostBaseBlock.module.scss';

/**
 * Component used for rendering the authorize icon based on the provided confidentiality
 *
 * @param confidentialityType
 * @param onOptionChanged
 * @param id
 * @param disabled
 * @constructor
 */
export const AuthorizeIcon = ({ confidentialityType, onOptionChanged, id = undefined, disabled = false }) => {
  const {
    wallPostDisabled,
    wallPostActionBlock,
    wallPostUploadContainer,
    wallPostConfidentialityUpload,
    wallPostConfidentialityCreate
  } = style;
  const {
    selectedPlatform: { role }
  } = useWallSelection();

  const confidentialityIcon = PostConfidentialityIcon(confidentialityType, !id);
  const currentConfidentiality = !id ? getConfidentialityOnlyOptions() : getPostEditOptions(role);

  return (
    <div
      className={`${wallPostActionBlock} ${wallPostUploadContainer} ${wallPostConfidentialityUpload} ${
        !id ? wallPostConfidentialityCreate : ''
      } ${disabled ? wallPostDisabled : ''}`}
    >
      <Select
        options={currentConfidentiality}
        value={null}
        styles={CONFIDENTIALITY_DROPDOWN_STYLES}
        components={{
          Placeholder: () => confidentialityIcon,
          IndicatorSeparator: () => null,
          Option: PostConfidentialityOption,
          IndicatorsContainer: DropdownIndicators
        }}
        menuPlacement="top"
        onChange={onOptionChanged}
        isSearchable={true}
        showIsSelected={confidentialityType}
      />
    </div>
  );
};

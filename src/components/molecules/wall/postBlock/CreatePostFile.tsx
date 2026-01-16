import React from 'react';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';

import PostFileTypeOption from 'components/atoms/wall/PostFileTypeOption';
import { useSelectFile } from 'hooks/launch/wall/useSelectFile';
import { HTML_TAGS } from 'constants/general';
import { FILE } from 'constants/wall/users';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'sass-boilerplate/stylesheets/components/wall/WallPostBaseBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render file upload for post
 */
const CreatePostFile = ({ setPostFile, fileOptions }) => {
  const { wallPostActionBlock, wallPostUploadContainer } = style;
  const { handleFileUpload, setFileTypeToUpload, uploadTrigger } = useSelectFile(setPostFile);

  const fileIcon = (
    <p>
      <FontAwesomeIcon icon={faFile} />
      <DynamicFormattedMessage tag={HTML_TAGS.SPAN} id="launchProgram.wall.file" />
    </p>
  );

  return (
    <div className={`${wallPostActionBlock} ${wallPostUploadContainer}`}>
      <Select
        options={fileOptions}
        value={null}
        isSearchable={true}
        styles={{
          control: base => ({
            ...base,
            border: 0,
            boxShadow: 'none',
            marginRight: '1rem',
            marginTop: '0.5rem'
          }),
          menu: base => ({
            ...base,
            width: '20rem'
          })
        }}
        components={{
          Placeholder: () => fileIcon,
          DropdownIndicator: () => null,
          SingleValue: () => fileIcon,
          Option: PostFileTypeOption
        }}
        menuPlacement="top"
        onChange={setFileTypeToUpload}
      />
      <input type={FILE} id={FILE} ref={uploadTrigger} className={coreStyle.displayNone} onChange={handleFileUpload} />
    </div>
  );
};

export default CreatePostFile;

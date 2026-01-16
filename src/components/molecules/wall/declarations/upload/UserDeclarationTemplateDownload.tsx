import React from 'react';

import Button from 'components/atoms/ui/Button';
import useUserDeclarationTemplateDownload from 'hooks/declarations/useUserDeclarationTemplateDownload';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { DECLARATION_TEMPLATE_TYPE } from 'constants/api/declarations';
import { HTML_TAGS } from 'constants/general';

import templateStyle from 'assets/style/components/launch/UserListDownload.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

/**
 * Molecule component used to render a User Declarations templates download list
 * @param programId
 * @constructor
 */
const UserDeclarationTemplateDownload = ({ programId }) => {
  const { onTemplateDownload, linkRef } = useUserDeclarationTemplateDownload(programId);

  return (
    <div>
      <DynamicFormattedMessage id="wall.userDeclaration.download.template" tag={HTML_TAGS.H4} />
      <ul className={templateStyle.templateDownloadList}>
        {Object.values(DECLARATION_TEMPLATE_TYPE).map(type => (
          <li key={type}>
            <DynamicFormattedMessage
              className={templateStyle.listItem}
              tag={Button}
              onClick={() => onTemplateDownload(type)}
              id={`template.file.type.${type.toLowerCase()}`}
            />
          </li>
        ))}
      </ul>
      <a className={coreStyle.displayNone} ref={linkRef} download />
    </div>
  );
};

export default UserDeclarationTemplateDownload;

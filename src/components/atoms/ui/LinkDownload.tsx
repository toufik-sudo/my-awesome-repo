import React from 'react';

import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';

import style from 'assets/style/common/Labels.module.scss';

/**
 * Molecule component used to display a single download link
 *
 * @param id
 * @param file
 * @constructor
 */
const LinkDownload = ({ id, file }) => {
  const { bold, underline } = style;

  return (
    <DynamicFormattedMessage
      tag="a"
      href={file}
      target="_blank"
      download={file}
      className={`${bold} ${underline}`}
      id={id}
    />
  );
};

export default LinkDownload;

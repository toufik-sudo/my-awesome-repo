import React, { FC, useMemo } from 'react';
import { useIntl } from 'react-intl';

import ProgramBlockElement from 'components/molecules/launch/program/ProgramBlockElement';
import { launchProgramsTranslations } from 'services/LaunchServices';
import { LaunchProgramButtonProps } from 'interfaces/IGeneral';
import style from 'assets/style/components/BlockElement.module.scss';

/**
 * Organism component used to Create a new program
 *
 * @constructor
 */
const LaunchProgramRowList: FC<LaunchProgramButtonProps> = ({
  buttons,
  sectionText,
  imgFile,
  extraClass,
  programType
}) => {
  const { blockWrapper, blockProgramWrapper, hoverBlocks } = style;
  const { messages } = useIntl();
  const launchProgramBlock = useMemo(() => launchProgramsTranslations(messages, sectionText, '.info'), [
    messages,
    sectionText
  ]);

  return (
    <div className={`${blockWrapper} ${blockProgramWrapper} ${hoverBlocks} ${style[extraClass]}`}>
      {launchProgramBlock.map((translation, index) => (
        <ProgramBlockElement
          key={translation}
          titleId={translation}
          textId={`${translation}.info`}
          {...{
            programType,
            imgFile,
            index,
            buttons
          }}
        />
      ))}
    </div>
  );
};

export default LaunchProgramRowList;

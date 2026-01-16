import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLockOpen, faLock } from '@fortawesome/free-solid-svg-icons';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import ButtonFormatted from 'components/atoms/ui/ButtonFormatted';
import useProgramDetailsRedirect from 'hooks/programs/useProgramDetailsRedirect';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';
import { emptyFn } from 'utils/general';

import componentStyle from 'sass-boilerplate/stylesheets/components/wall/Programs.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { useIntl } from 'react-intl';

/**
 * Molecule component used to render program block on super/hyper admin/cm page .
 * @param program
 * @param platform
 * @param isDisabled
 */
const HyperProgramBlock = ({ program, platform, isDisabled, isEndedProgram = null, onEndedPrmogramsOpen }) => {
  const { name, programType, isOpen } = program;
  const {
    cardTitleSmall,
    withSecondaryColor,
    withPrimaryColor,
    flex,
    textCenter,
    mb2,
    mt0,
    mb0,
    mt3,
    py5,
    text3xl,
    dSmallTextLg,
    lh1,
    withFontSmall,
    mr1,
    mb1,
    w100,
    disabled,
    opacity04,
    marquee,
    marqueeInner,
    height100
  } = coreStyle;

  const { colorWidgetTitle } = useSelectedProgramDesign();
  const { onOpen } = useProgramDetailsRedirect({ ...program, platform });
  const { formatMessage } = useIntl();
  const hasName = name && name.length > 20;
  let blockStyle = '';
  if (isDisabled) {
    blockStyle = `${disabled} ${opacity04}`;
  }

  return (
    <GeneralBlock
      className={`${textCenter} ${height100} ${mt0} ${mb0} ${py5} ${flex} ${coreStyle['flex-direction-column']} ${blockStyle}`}
    >
      <div
        className={`${coreStyle['flex-center-vertical']} ${componentStyle.programBlockItem} ${coreStyle['flex-direction-column']}`}
      >
        {
          !isEndedProgram &&
          <h4 className={`${cardTitleSmall} ${withPrimaryColor} ${mt0} ${mb2} ${coreStyle['flex-center-vertical']}`}>
            <FontAwesomeIcon className={`${withFontSmall} ${mr1}`} icon={isOpen ? faLockOpen : faLock} />
            <DynamicFormattedMessage id={`program.type.${programType}`} tag={HTML_TAGS.SPAN} />
          </h4>
        }
        <p
          style={{ color: colorWidgetTitle }}
          className={`${text3xl} ${dSmallTextLg} ${lh1} ${mt3} ${!colorWidgetTitle ? withSecondaryColor : ''} ${mb2} ${hasName ? marquee : ''
            }`}
        >
          {!isEndedProgram && <span className={hasName ? marqueeInner : ''}>{name}</span>}
          {isEndedProgram && <span className={hasName ? marqueeInner : ''}>{formatMessage({id: 'wall.user.details.programs.title.finished'})}</span>}
        </p>
        <div>
          {!isEndedProgram &&
            <ButtonFormatted
              type={BUTTON_MAIN_TYPE.PRIMARY}
              className={`${mb1} ${w100}  ${componentStyle.platformProgramCTA} ${isDisabled ? blockStyle : ''}`}
              buttonText="program.block.cta"
              onClick={!isDisabled ? onOpen : emptyFn}
            />
          }
          {isEndedProgram &&
            <ButtonFormatted
              type={BUTTON_MAIN_TYPE.THIRD_INVERTED}
              className={`${w100} ${componentStyle.platformDveloppeBtn} ${isDisabled ? blockStyle : ''}`}
            buttonText="program.block.cta.programs"
              onClick={onEndedPrmogramsOpen}
            />
          }
        </div>
      </div>
    </GeneralBlock>
  );
};

export default HyperProgramBlock;

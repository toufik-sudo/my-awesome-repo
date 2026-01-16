import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import BaseBlockElement from 'components/molecules/launch/block/BaseBlockElement';
import BaseBlockBody from 'components/molecules/launch/block/BaseBlockBody';
import useRewardsGoalRelations from 'hooks/launch/rewards/useRewardsGoalRelations';
import Button from 'components/atoms/ui/Button';
import { BUTTON_MAIN_TYPE, BUTTON_MAIN_VARIANT } from 'constants/ui';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { LAUNCH_REWARD_BLOCKS } from 'constants/wall/launch';
import { redirectToFirstStep } from 'services/LaunchServices';

import style from 'assets/style/components/BlockElement.module.scss';

const RewardsBlockList = () => {
  const {
    blockWrapper,
    blockProgramWrapper,
    hoverBlocks,
    blockElementTitle,
    rewardsBlock,
    active,
    blockElementButton
  } = style;
  const blockPrefix = 'launchProgram.rewards.type.';
  const { setCorelatedStep, activeElement, confidentiality, type } = useRewardsGoalRelations();

  if (!confidentiality || !type) redirectToFirstStep();

  return (
    <div className={`${blockProgramWrapper} ${blockWrapper} ${hoverBlocks}`}>
      {LAUNCH_REWARD_BLOCKS.map((blockElement, index: number) => (
        <BaseBlockElement
          className={`${rewardsBlock} ${activeElement && activeElement === blockElement.id ? active : ''} `}
          key={index}
          icon={
            blockElement.icon && (
              <FontAwesomeIcon icon={blockElement.icon} size="lg" className={style.blockElementIcon} />
            )
          }
          titleSection={
            <DynamicFormattedMessage className={blockElementTitle} id={`${blockPrefix}${blockElement.id}`} tag="p" />
          }
          bodySection={<BaseBlockBody description={`${blockPrefix}${blockElement.id}.info`} key={blockElement.id} />}
          buttonAction={
            blockElement.button &&
            `${blockPrefix}${blockElement.id}.button` && (
              <DynamicFormattedMessage
                id={blockElement.button && `${blockPrefix}${blockElement.id}.button`}
                tag={Button}
                variant={BUTTON_MAIN_VARIANT.INVERTED}
                className={blockElementButton}
                onClick={() => {
                  setCorelatedStep(blockElement.id);
                }}
                type={BUTTON_MAIN_TYPE.PRIMARY}
              />
            )
          }
        />
      ))}
    </div>
  );
};

export default RewardsBlockList;

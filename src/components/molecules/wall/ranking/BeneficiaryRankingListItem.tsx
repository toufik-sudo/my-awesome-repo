import React from 'react';

import Button from 'components/atoms/ui/Button';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import RankingIcon from 'components/atoms/ui/RankingIcon';
import { BUTTON_MAIN_TYPE } from 'constants/ui';
import { DEFAULT_WALL_ALL_PROGRAMS } from 'constants/wall/programButtons';
import useUserRankings from 'hooks/wall/blocks/useUserRankings';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import style from 'assets/style/components/BlockElement.module.scss';

/**
 * Renders ranking list item
 *
 * @param programRanking
 * @param selectedRanking
 * @param handleSelectProgram
 * @constructor
 */
const BeneficiaryRankingListItem = ({ programRanking, selectedRanking, handleSelectProgram }) => {
  const { colorMainButtonsBackground, colorMainButtonText, colorSidebar } = useSelectedProgramDesign();
  const { isLoading } = useUserRankings();
  const {
    textTiny,
    mb3,
    withBoldFont,
    p2,
    textCenter,
    withGrayAccentColor,
    h100,
    lh1,
    opacity04,
    pointer,
    text2xl,
    mb2,
    mb1
  } = coreStyle;

  const { rank, id, name } = programRanking;

  const isAllProgramsSelected = selectedRanking.nameId === DEFAULT_WALL_ALL_PROGRAMS;
  const isProgramRankingSelected = isAllProgramsSelected || id === selectedRanking.id;
  const hasRanking = !isLoading && rank;

  return (
    <div
      className={`${!isProgramRankingSelected ? opacity04 : ''} ${h100} ${p2} ${textCenter} ${pointer}  ${
        style.blockWithShadow
      } ${mb2}`}
      onClick={() => handleSelectProgram(id, true)}
      id={name + id}
    >
      <div className={`${textTiny} ${mb3} ${withGrayAccentColor} ${withBoldFont}`}>{name}</div>
      <div className={`${coreStyle['flex-wrap']} ${mb3} ${coreStyle['flex-center-total']}`}>
        <div>
          <p className={`${text2xl} ${mb1} ${withBoldFont} ${lh1}`} style={{ color: colorSidebar }}>
            {rank}
          </p>
          <RankingIcon fillColor={colorSidebar} hasRanking={hasRanking} />
        </div>
      </div>
      <DynamicFormattedMessage
        tag={Button}
        type={BUTTON_MAIN_TYPE.PRIMARY}
        onClick={() => isProgramRankingSelected && handleSelectProgram(id)}
        id="wall.widget.user.ranking.see.program"
        customStyle={{
          color: colorMainButtonText,
          background: colorMainButtonsBackground
        }}
      />
    </div>
  );
};

export default BeneficiaryRankingListItem;

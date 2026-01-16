import React from 'react';

import BeneficiaryRankingListItem from 'components/molecules/wall/ranking/BeneficiaryRankingListItem';
import { isUserBeneficiary } from 'services/security/accessServices';
import { useBeneficiaryRankingList } from 'hooks/wall/beneficiary/UseBeneficiaryRankingList';
import { WALL_ROUTE } from 'constants/routes';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import { GeneralErrorBlock } from '../blocks/GeneralErrorBlock';
import FreemiumNotice from '../FreemiumNotice';
import { useSelector } from 'react-redux';
import { IStore } from '../../../../interfaces/store/IStore';
import { DEFAULT_ALL_PROGRAMS } from '../../../../constants/wall/programButtons';
import { FREEMIUM, PROGRAM_TYPES } from '../../../../constants/wall/launch';

/**
 * Renders
 *
 * @constructor
 */
const BeneficiaryRankingList = () => {
  const {
    withBackgroundDefault,
    borderRadius1,
    displayFlex,
    px2,
    py3,
    w50,
    pb2,
    mLargeWidthFull,
    relative
  } = coreStyle;
  const {
    role,
    programRankings,
    selectedRanking,
    history,
    handleSelectProgram,
    platformId
  } = useBeneficiaryRankingList();
  const { programs } = useSelector((store: IStore) => store.wallReducer);
  if (!platformId) {
    return <GeneralErrorBlock />;
  }
  const hasOnlyFreemiumPrograms = !programs.some(
    program => program.name !== DEFAULT_ALL_PROGRAMS && program.programType !== PROGRAM_TYPES[FREEMIUM]
  );
  if (!isUserBeneficiary(role)) {
    history.push(WALL_ROUTE);
    return null;
  }

  return (
    <div
      className={`${withBackgroundDefault} ${displayFlex} ${coreStyle['flex-wrap']} ${borderRadius1} ${py3} ${relative}`}
    >
      {hasOnlyFreemiumPrograms && <FreemiumNotice />}
      {programRankings.map(programRanking => (
        <div className={`${px2} ${pb2} ${w50} ${mLargeWidthFull}`} key={programRanking.id}>
          <BeneficiaryRankingListItem {...{ programRanking, selectedRanking, handleSelectProgram }} />
        </div>
      ))}
    </div>
  );
};

export default BeneficiaryRankingList;

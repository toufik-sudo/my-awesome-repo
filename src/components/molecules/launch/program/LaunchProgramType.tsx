import React from 'react';
import { useSelector } from 'react-redux';

import LaunchProgramRowList from 'components/organisms/launch/program/LaunchProgramRowList';
import HeadingAtom from 'components/atoms/ui/Heading';
import { getProgramTypeButtons } from 'services/LaunchServices';
import { IArrayKey } from 'interfaces/IGeneral';
import { IStore } from 'interfaces/store/IStore';

import style from 'assets/style/components/launch/Launch.module.scss';
/**
 * Molecule component used to Create a new program type
 *
 * @constructor
 */
const LaunchProgramType = () => {
  const { isFreePlan } = useSelector<IStore, IArrayKey<any>>(store => store.launchReducer);

  return (
    <>
      <HeadingAtom className={style.title} size="3" textId="launchProgram.title" />
      <LaunchProgramRowList
        buttons={getProgramTypeButtons(isFreePlan)}
        sectionText="launchProgram.type."
        imgFile="program"
        extraClass="fourBlocks"
      />
    </>
  );
};

export default LaunchProgramType;

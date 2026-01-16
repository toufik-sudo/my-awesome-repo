import React from 'react';
import { useParams } from 'react-router';

import { getProgressActive } from 'services/LaunchServices';
import style from 'assets/style/components/wall/PageIndex.module.scss';
import { FREEMIUM } from 'constants/routes';

/**
 * Atom component used to display page index item
 *
 * @param index
 */
const PageIndexItem = ({ index, type }) => {
  const { stepIndex } = useParams();
  if (!index || (index > 1 && index <= 5 && type != FREEMIUM)) return null;
  let stepActive = getProgressActive(stepIndex, index, style);
  if (index == 6 && type != FREEMIUM) {
    index = 2;
  }
  return <li className={`${style.pageIndexStep} ${stepActive}`}>{index}</li>;
};

export default PageIndexItem;

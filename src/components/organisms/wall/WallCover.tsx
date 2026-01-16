import React from 'react';

import { useWallSelection } from 'hooks/wall/useWallSelection';
import { getKeyByValue } from 'utils/general';
import { PROGRAM_TYPES, CHALLENGE, LOYALTY, SPONSORSHIP } from 'constants/wall/launch';

import style from 'sass-boilerplate/stylesheets/components/wall/beneficiary/WallCover.module.scss';
import challengeDefaultBackground from 'assets/images/wall/challengeDefaultBackground.jpg';
import loyaltyDefaultBackground from 'assets/images/wall/loyaltyDefaultBackground.jpg';
import sponsorshipDefaultBackground from 'assets/images/wall/sponsorshipDefaultBackground.jpg';

const defaultWallCovers = {
  [CHALLENGE]: challengeDefaultBackground,
  [LOYALTY]: loyaltyDefaultBackground,
  [SPONSORSHIP]: sponsorshipDefaultBackground
};

/**
 * Wall top banner for beneficiary users
 * @constructor
 *
 */
const WallCover = () => {
  const programId = useWallSelection().selectedProgramId;
  const { design, type } = useWallSelection().programDetails[programId] || {};
  const programTypeKey = getKeyByValue(PROGRAM_TYPES, type);
  const image = (design && design.backgroundCoverUrl) || defaultWallCovers[programTypeKey];
  const wallBgColor = (design && design.colorBackground) || 'rgb(248, 248, 248)';

  return (
    <div className={style.banner}>
      <img src={image} />
      <div className={style.bannerAfter} style={{ background: `linear-gradient(transparent, ${wallBgColor})` }} />
    </div>
  );
};

export default WallCover;

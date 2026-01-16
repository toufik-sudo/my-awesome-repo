// import React from 'react';
// import { useHistory } from 'react-router-dom';

// import GeneralBlock from 'components/molecules/block/GeneralBlock';
// import Loading from 'components/atoms/ui/Loading';
// import useUserRankings from 'hooks/wall/blocks/useUserRankings';
// import { WALL_BENEFICIARY_RANKING_ROUTE } from 'constants/routes';
// import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
// import RankingIcon from 'components/atoms/ui/RankingIcon';
// import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
// import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

// import style from 'sass-boilerplate/stylesheets/components/wall/WallUserBlock.module.scss';
// import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
// import wallStyle from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
// import useSelectedProgram from '../../../../hooks/wall/useSelectedProgram';
// import { FREEMIUM, PROGRAM_TYPES } from '../../../../constants/wall/launch';
// import { useWallSelection } from 'hooks/wall/useWallSelection';
// import useDashboardNumber from 'hooks/wall/useDashboardNumber';

// const StarIcon = ({ filled }) => (
//   <svg
//     width="36"
//     height="36"
//     viewBox="0 0 24 24"
//     fill={filled ? '#FFD700' : 'none'} 
//     stroke="#FFD700"
//     strokeWidth="2"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     className={style.starIcon}
//   >
//     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//   </svg>
// );

// /**
//  * Molecule component used to render user block
//  * @constructor
//  */
// const UserRankingsWidget = () => {
//   const { userBlock, userBlockTitle, userBlockLink, userBlockCount, userBlockRanking, userBlockMatrix } = style;
//   const { withSecondaryColor, pointer, widthFull, withGrayAccentColor, withFontMedium, overlayBeforeWhite } = coreStyle;
//   const { colorMainButtons, colorSidebar } = useSelectedProgramDesign();
//   const { isLoading, selectedRanking } = useUserRankings();
//   const { selectedProgramId, programDetails } = useWallSelection();
//   const selectedProgram = useSelectedProgram();
//   const isFreemium = selectedProgram && selectedProgram.programType === PROGRAM_TYPES[FREEMIUM];
//   const { points, isBeneficiary, isPointsComponentLoading } = useDashboardNumber();
//   const pointsInEuro = points/25;

//   const history = useHistory();
//   const onSelectWidget = () => history.push(WALL_BENEFICIARY_RANKING_ROUTE);
//   const hasRanking = (!isLoading && selectedRanking.rank) || !isFreemium;
//   const rankingData = programDetails[selectedProgramId]?.programRanking;
//   const numberOfStars = rankingData ? rankingData.length : null;

//   console.log("RANKING DATA")
//   console.log(rankingData)

//   return (
//     <GeneralBlock
//       tooltipId="disabledWidget"
//       className={`${userBlock} ${userBlockMatrix} ${userBlockRanking} ${wallStyle.hideBlockMobile} ${isFreemium &&
//         overlayBeforeWhite}`}
//     >
//       <DynamicFormattedMessage
//         className={`${userBlockTitle} ${widthFull}`}
//         id="wall.widget.user.ranking.title"
//         tag={HTML_TAGS.P}
//       />
//       {isLoading && (
//         <div className={userBlockCount}>
//           <Loading className={withSecondaryColor} type={LOADER_TYPE.DROPZONE} />
//         </div>
//       )}
//       {hasRanking && (
//         <p className={userBlockCount} style={{ color: colorSidebar }}>
//           {selectedRanking.rank}
//         </p>
//       )}
//       {isFreemium ? (
//         <DynamicFormattedMessage
//           className={`${withGrayAccentColor} ${withFontMedium}`}
//           tag={HTML_TAGS.DIV}
//           id="wall.widget.user.ranking.noRanking"
//         />
//       ) : (
//         <RankingIcon fillColor={colorSidebar} hasRanking />
//       )}
//       {hasRanking ? (
//         <DynamicFormattedMessage
//           onClick={onSelectWidget}
//           className={`${hasRanking ? userBlockLink : ''} ${pointer} ${widthFull} `}
//           id="wall.widget.user.ranking.see.all"
//           tag={HTML_TAGS.DIV}
//           style={{ color: colorMainButtons }}
//         />
//       ) : (
//         !isLoading && (
//           <DynamicFormattedMessage
//             className={widthFull}
//             id="wall.widget.user.ranking.none"
//             tag={HTML_TAGS.DIV}
//             style={{ color: colorMainButtons }}
//           />
//         )
//       )}

// {rankingData && (
//          <div className={style.starContainer}>
//          {[...Array(numberOfStars)].map((_, index) => (
//            <StarIcon key={index} className={style.starIcon} fill={colorSidebar} />
//          ))}
//        </div>
//       )}

//     </GeneralBlock>
//   );
// };

// export default UserRankingsWidget;

import React from 'react';
import { useHistory } from 'react-router-dom';

import GeneralBlock from 'components/molecules/block/GeneralBlock';
import Loading from 'components/atoms/ui/Loading';
import useUserRankings from 'hooks/wall/blocks/useUserRankings';
import { WALL_BENEFICIARY_RANKING_ROUTE } from 'constants/routes';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import RankingIcon from 'components/atoms/ui/RankingIcon';
import { HTML_TAGS, LOADER_TYPE } from 'constants/general';
import { useSelectedProgramDesign } from 'hooks/wall/ui/useSelectedProgramColors';

import style from 'sass-boilerplate/stylesheets/components/wall/WallUserBlock.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import wallStyle from 'sass-boilerplate/stylesheets/components/wall/WallBasePageStructure.module.scss';
import useSelectedProgram from '../../../../hooks/wall/useSelectedProgram';
import { FREEMIUM, PROGRAM_TYPES } from '../../../../constants/wall/launch';
import { useWallSelection } from 'hooks/wall/useWallSelection';
import useDashboardNumber from 'hooks/wall/useDashboardNumber';
import { usePointConversionsPage } from 'hooks/pointConversions/usePointConversionsPage';



const StarIcon = ({ filled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
    fill={filled ? '#78bb7bcf' : "none"}
    stroke="#78bb7bcf"
    strokeWidth="2"
  >
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

const getConvertedPoints = (data,programId)=>{
  return data
      .filter(item => item.program.id === programId) 
      .filter(item => item.status === 4)
      .reduce((sum, item) => sum + item.amount, 0); 
}


const getFilledStars = (rankingData, pointsInEuro, convertedPointsInEuro) => {
  if (!rankingData) return 0;
  const totalPoints = pointsInEuro + convertedPointsInEuro
  return rankingData.reduce((stars, ranking, index) => {
    const key = Object.keys(ranking)[0];
    const { min, max } = ranking[key];
    const minVal = parseInt(min, 10);
    const maxVal = max ? parseInt(max, 10) : Infinity;

    return totalPoints >= minVal && totalPoints <= maxVal ? index + 1 : stars;
  }, 0);
};

const UserRankingsWidget = () => {
  const {
    pointsConversions,
    hasMore,
    loadMore,
    scrollRef,
    listCriteria,
    onSort,
    onValidateSuccess
  } = usePointConversionsPage();
  
  const { userBlock, userBlockTitle, userBlockLink, userBlockCount, userBlockRanking, userBlockMatrix } = style;
  const { withSecondaryColor, pointer, widthFull, withGrayAccentColor, withFontMedium, overlayBeforeWhite } = coreStyle;
  const { colorMainButtons, colorSidebar } = useSelectedProgramDesign();
  const { isLoading, selectedRanking } = useUserRankings();
  const { selectedProgramId, programDetails } = useWallSelection();
  const convertedPointsInEuro = getConvertedPoints(pointsConversions,selectedProgramId)
  const selectedProgram = useSelectedProgram();
  const isFreemium = selectedProgram && selectedProgram.programType === PROGRAM_TYPES[FREEMIUM];
  const { points, isBeneficiary, isPointsComponentLoading } = useDashboardNumber();
  const pointsInEuro = points / 25;

  const history = useHistory();
  const onSelectWidget = () => history.push(WALL_BENEFICIARY_RANKING_ROUTE);
  const hasRanking = (!isLoading && selectedRanking.rank) || !isFreemium;
  const rankingData = programDetails[selectedProgramId]?.programRanking;
  const numberOfStars = rankingData ? rankingData.length : 0;
  const filledStars = getFilledStars(rankingData, pointsInEuro, convertedPointsInEuro);
  const transformStarArray = (starArray?: any[]) => {
    if (!Array.isArray(starArray)) return []; 
    return starArray.map(starObj => Object.values(starObj)[0]);
  };
  const rankingDataTransformed = transformStarArray(rankingData);
  const full = numberOfStars === filledStars;
  let total = 0;
if (Array.isArray(rankingDataTransformed) && filledStars < rankingDataTransformed.length) {
  const minValueStr = rankingDataTransformed[filledStars]?.min;
  if (minValueStr) {  
    const minValue = parseInt(minValueStr, 10);
    total = Math.round((minValue - (pointsInEuro + convertedPointsInEuro)) * 25);
  } else {
    console.warn('min value is missing for the current star');
    
  }
}
 
  return (
    <GeneralBlock
      tooltipId="disabledWidget"
      className={`${userBlock} ${userBlockMatrix} ${userBlockRanking} ${wallStyle.hideBlockMobile} ${isFreemium &&
        overlayBeforeWhite}`}
    >
      <DynamicFormattedMessage
        className={`${userBlockTitle} ${widthFull}`}
        id="wall.widget.user.ranking.title"
        tag={HTML_TAGS.P}
      />
      {isLoading && (
        <div className={userBlockCount}>
          <Loading className={withSecondaryColor} type={LOADER_TYPE.DROPZONE} />
        </div>
      )}
      {hasRanking && (
        <p className={userBlockCount} style={{ color: colorSidebar }}>
          {selectedRanking.rank}
        </p>
      )}
      {isFreemium ? (
        <DynamicFormattedMessage
          className={`${withGrayAccentColor} ${withFontMedium}`}
          tag={HTML_TAGS.DIV}
          id="wall.widget.user.ranking.noRanking"
        />
      ) :  ( rankingData?.length==0 &&
        <RankingIcon fillColor={colorSidebar} hasRanking />
      )}
      
      {rankingData && (
        <div className={style.starContainer}>
          {[...Array(numberOfStars)].map((_, index) => (
            <StarIcon key={index} filled={index < filledStars} />
          ))}
          {
           !full && (<DynamicFormattedMessage
                  tag={HTML_TAGS.P}
                  // className={withPrimaryColor}
                  id="ranking.star.left"
                  values={{ total }}
                />)}
        </div>
      )}

{hasRanking ? (
        <DynamicFormattedMessage
          onClick={onSelectWidget}
          className={`${hasRanking ? userBlockLink : ''} ${pointer} ${widthFull} `}
          id="wall.widget.user.ranking.see.all"
          tag={HTML_TAGS.DIV}
          style={{ color: colorMainButtons }}
        />
      ) : (
        !isLoading && (
          <DynamicFormattedMessage
            className={widthFull}
            id="wall.widget.user.ranking.none"
            tag={HTML_TAGS.DIV}
            style={{ color: colorMainButtons }}
          />
        )
      )}
    </GeneralBlock>
  );
};

export default UserRankingsWidget;

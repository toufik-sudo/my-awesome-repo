// -----------------------------------------------------------------------------
// UserRankingsWidget Component
// Displays user ranking with stars progress
// Migrated from old_app/src/components/molecules/wall/widgets/UserRankingsWidget.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WidgetCard } from './WidgetCard';
import { Loading } from '@/components/library/atoms/Loading';
import { Button } from '@/components/ui/button';
import { useWallSelection } from '@/hooks/wall';
import { WALL_BENEFICIARY_RANKING_ROUTE } from '@/constants/routes';
import { useRankingWidget, useCurrentUserRanking, useBeneficiaryPointsWidget } from '@/api/hooks/useWidgetApi';
import { useAuth } from '@/hooks/auth';

interface StarIconProps {
  filled?: boolean;
  className?: string;
}

const StarIcon: React.FC<StarIconProps> = ({ filled = false, className }) => (
  <Star
    className={cn(
      'h-7 w-7 transition-all duration-300',
      filled ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-amber-400/50',
      className
    )}
  />
);

interface RankingData {
  min: string;
  max?: string;
}

interface ProgramRanking {
  [key: string]: RankingData;
}

const getFilledStars = (
  rankingData: ProgramRanking[] | null,
  pointsInEuro: number,
  convertedPointsInEuro: number = 0
): number => {
  if (!rankingData || !Array.isArray(rankingData)) return 0;
  const totalPoints = pointsInEuro + convertedPointsInEuro;
  
  return rankingData.reduce((stars, ranking, index) => {
    const key = Object.keys(ranking)[0];
    if (!key) return stars;
    const data = ranking[key];
    const minVal = parseInt(data.min, 10);
    const maxVal = data.max ? parseInt(data.max, 10) : Infinity;

    return totalPoints >= minVal && totalPoints <= maxVal ? index + 1 : stars;
  }, 0);
};

interface UserRankingsWidgetProps {
  className?: string;
  colorSidebar?: string;
  colorMainButtons?: string;
}

const UserRankingsWidget: React.FC<UserRankingsWidgetProps> = ({
  className,
  colorSidebar,
  colorMainButtons,
}) => {
  const navigate = useNavigate();
  const { selectedProgramId, programDetails, selectedPlatform } = useWallSelection();
  const { getCurrentUser } = useAuth();
  const currentUser = getCurrentUser();
  const platformId = selectedPlatform?.id;
  
  // Use API hooks for real data
  const { data: rankingData, isLoading: rankingsLoading } = useRankingWidget(platformId, selectedProgramId);
  const { data: userRankings, isLoading: userRankingLoading } = useCurrentUserRanking(currentUser?.uuid);
  const { data: points = 0 } = useBeneficiaryPointsWidget(currentUser?.uuid, platformId);
  
  const isLoading = rankingsLoading || userRankingLoading;
  
  // Find user's rank from rankings
  const userRankEntry = rankingData?.entries?.find((entry: any) => entry.userId === currentUser?.uuid);
  const selectedRanking = { rank: userRankEntry?.rank || userRankings?.[0]?.rank || 0 };
  
  const isFreemium = false; // TODO: Get from program details
  const pointsInEuro = points / 25;
  const convertedPointsInEuro = 0;

  // Get ranking data from program details
  const programDetail = selectedProgramId ? programDetails?.[selectedProgramId] : null;
  const programRankingData: ProgramRanking[] | null = 
    programDetail && 'programRanking' in programDetail 
      ? (programDetail.programRanking as ProgramRanking[] | null) 
      : null;
  
  const numberOfStars = programRankingData?.length ?? 0;
  const filledStars = getFilledStars(programRankingData, pointsInEuro, convertedPointsInEuro);
  const isFull = numberOfStars === filledStars;

  const handleViewRanking = () => {
    navigate(WALL_BENEFICIARY_RANKING_ROUTE);
  };

  // Calculate points to next star
  let pointsToNextStar = 0;
  if (programRankingData && Array.isArray(programRankingData) && filledStars < programRankingData.length) {
    const transformedData = programRankingData.map((obj) => Object.values(obj)[0]);
    const nextStarData = transformedData[filledStars];
    if (nextStarData?.min) {
      const minValue = parseInt(nextStarData.min, 10);
      pointsToNextStar = Math.round((minValue - (pointsInEuro + convertedPointsInEuro)) * 25);
    }
  }

  return (
    <WidgetCard
      title={<FormattedMessage id="wall.widget.user.ranking.title" defaultMessage="Your Ranking" />}
      className={cn('min-h-[200px]', className)}
      accentColor="primary"
      hideOnMobile
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {isLoading ? (
          <Loading type="local" size="sm" />
        ) : (
          <>
            {/* Rank Number */}
            {selectedRanking.rank && !isFreemium && (
              <div className="relative">
                <div 
                  className="text-5xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent"
                  style={colorSidebar ? { color: colorSidebar } : undefined}
                >
                  {selectedRanking.rank}
                </div>
                <Trophy className="absolute -top-2 -right-6 h-5 w-5 text-amber-500" />
              </div>
            )}

            {/* Freemium Message */}
            {isFreemium && (
              <p className="text-sm text-muted-foreground text-center">
                <FormattedMessage 
                  id="wall.widget.user.ranking.noRanking" 
                  defaultMessage="Upgrade to see rankings" 
                />
              </p>
            )}

            {/* Stars Display */}
            {rankingData && numberOfStars > 0 && (
              <div className="flex flex-col items-center space-y-2">
                <div className="flex gap-1">
                  {Array.from({ length: numberOfStars }).map((_, index) => (
                    <StarIcon key={index} filled={index < filledStars} />
                  ))}
                </div>
                {!isFull && pointsToNextStar > 0 && (
                  <p className="text-xs text-muted-foreground">
                    <FormattedMessage
                      id="ranking.star.left"
                      defaultMessage="{total} points to next star"
                      values={{ total: pointsToNextStar }}
                    />
                  </p>
                )}
              </div>
            )}

            {/* View Ranking Link */}
            {selectedRanking.rank && !isFreemium ? (
              <Button 
                variant="link" 
                className="p-0 h-auto font-medium"
                onClick={handleViewRanking}
                style={colorMainButtons ? { color: colorMainButtons } : undefined}
              >
                <FormattedMessage 
                  id="wall.widget.user.ranking.see.all" 
                  defaultMessage="View all rankings" 
                />
              </Button>
            ) : !isLoading && (
              <p className="text-sm text-muted-foreground">
                <FormattedMessage 
                  id="wall.widget.user.ranking.none" 
                  defaultMessage="No ranking available" 
                />
              </p>
            )}
          </>
        )}
      </div>
    </WidgetCard>
  );
};

export { UserRankingsWidget };
export default UserRankingsWidget;

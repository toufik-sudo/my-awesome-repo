import React from 'react';
import { DynamicFormattedMessage } from 'components/atoms/ui/DynamicFormattedMessage';
import { HTML_TAGS } from 'constants/general';
import { CURRENCY_SYMBOLS } from 'constants/wall/launch';
import style from 'sass-boilerplate/stylesheets/components/wall/ObjectivesSummary.module.scss';
import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';

interface IObjectivesSummaryCardProps {
  goal: any;
  index: number;
  productNamesById: Record<number, string>;
  colorAccent?: string;
}

/**
 * Enhanced card component for displaying a single objective/goal
 */
const ObjectivesSummaryCard: React.FC<IObjectivesSummaryCardProps> = ({
  goal,
  index,
  productNamesById,
  colorAccent
}) => {
  const {
    objectiveCard,
    objectiveHeader,
    objectiveBadge,
    objectiveTitle,
    objectiveContent,
    objectiveMetrics,
    metricItem,
    metricLabel,
    metricValue,
    metricArrow,
    rewardSection,
    rewardBadge,
    productsSection,
    productGrid,
    productCard,
    productImageWrapper,
    productImagePlaceholder,
    productNameLabel,
    volumeBadge,
    actionBadge,
    quantityBadge
  } = style;

  const getMeasurementIcon = (measurementName: string) => {
    switch (measurementName) {
      case 'volume':
        return '💰';
      case 'action':
        return '⚡';
      case 'quantity':
        return '📦';
      default:
        return '🎯';
    }
  };

  const getMeasurementLabel = (measurementName: string) => {
    switch (measurementName) {
      case 'volume':
        return "Chiffre d'affaires";
      case 'action':
        return 'Actions';
      case 'quantity':
        return 'Volume de ventes';
      default:
        return 'Objectif';
    }
  };

  const getBadgeClass = (measurementName: string) => {
    switch (measurementName) {
      case 'volume':
        return volumeBadge;
      case 'action':
        return actionBadge;
      case 'quantity':
        return quantityBadge;
      default:
        return volumeBadge;
    }
  };

  const formatValue = (value: string | number, currency?: number) => {
    if (!value && value !== 0) return '-';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (currency) {
      return `${numValue.toLocaleString('fr-FR')} ${CURRENCY_SYMBOLS[currency] || '€'}`;
    }
    return numValue.toLocaleString('fr-FR');
  };

  const { main, measurementName, productIds = [], productImagesUrls = [] } = goal;
  const hasMin = main?.min && Number(main.min) > 0;
  const hasMax = main?.max && Number(main.max) > 0;
  const rewardValue = main?.value;
  const currency = main?.currency;

  return (
    <div className={objectiveCard} style={{ borderColor: colorAccent || '#3e216b' }}>
      {/* Header with objective number and type */}
      <div className={objectiveHeader}>
        <span className={objectiveBadge} style={{ backgroundColor: colorAccent || '#3e216b' }}>
          Objectif {index + 1}
        </span>
        <span className={`${objectiveTitle} ${getBadgeClass(measurementName)}`}>
          {getMeasurementIcon(measurementName)} {getMeasurementLabel(measurementName)}
        </span>
      </div>

      {/* Metrics section */}
      <div className={objectiveContent}>
        <div className={objectiveMetrics}>
          {hasMin && (
            <div className={metricItem}>
              <span className={metricLabel}>Minimum</span>
              <span className={metricValue}>{formatValue(main.min, currency)}</span>
            </div>
          )}
          
          {hasMin && hasMax && (
            <div className={metricArrow}>→</div>
          )}
          
          {hasMax && (
            <div className={metricItem}>
              <span className={metricLabel}>Maximum</span>
              <span className={metricValue}>{formatValue(main.max, currency)}</span>
            </div>
          )}

          {!hasMin && !hasMax && (
            <div className={metricItem}>
              <span className={metricLabel}>Pas de seuil défini</span>
            </div>
          )}
        </div>

        {/* Reward section */}
        {rewardValue && (
          <div className={rewardSection}>
            <span className={rewardBadge} style={{ backgroundColor: colorAccent || '#EC407A' }}>
              🏆 Récompense: {formatValue(rewardValue)} WINS
            </span>
          </div>
        )}

        {/* Products section */}
        {productIds.length > 0 && (
          <div className={productsSection}>
            <DynamicFormattedMessage
              tag={HTML_TAGS.P}
              id="wall.intro.rewards.products.layout"
              className={coreStyle.withBoldFont}
            />
            <div className={productGrid}>
              {productIds.map((id: number, idx: number) => (
                <div key={`product_${id}_${idx}`} className={productCard}>
                  {productImagesUrls[idx] ? (
                    <div className={productImageWrapper}>
                      <img 
                        src={productImagesUrls[idx]} 
                        alt={productNamesById[id] || `Product ${id}`}
                      />
                    </div>
                  ) : (
                    <div className={productImagePlaceholder}>📦</div>
                  )}
                  <span className={productNameLabel}>
                    {productNamesById[id] || `Produit ${id}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectivesSummaryCard;

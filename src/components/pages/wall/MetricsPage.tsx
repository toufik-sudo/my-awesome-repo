import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import LeftSideLayout from 'components/organisms/layouts/LeftSideLayout';
import Loading from 'components/atoms/ui/Loading';
import MetricBlock from 'components/molecules/hyperadmin/MetricBlock';
import MetricBlockWithList from 'components/molecules/hyperadmin/MetricBlockWithList';
import {
  LOADER_TYPE,
  TOTAL_EMAILS_SENT,
  TOTAL_REVENUE_SUBSCRIPTIONS,
  TOTAL_SIZE_OF_DOCUMENTS,
  TYPES_OF_PROGRAMS,
  WALL_TYPE
} from 'constants/general';
import { useMetrics } from 'hooks/hyperAdmin/useMetrics';
import { NUMBER } from 'constants/validation';

import style from 'sass-boilerplate/stylesheets/components/hyperadmin/Metrics.module.scss';
import AIRAGApi from 'api/IA API/AIRagApi';

/**
 * Page component used to render metrics page
 *
 * @constructor
 */
const MetricsPage = () => {
  const { metricsData } = useMetrics();
  const { formatMessage } = useIntl();

  const [globalTokens, setGlobalTokens] = useState(0)

  const getTokensCountFile = async () => {
    try {
      const response = await AIRAGApi.getTokensCountXlsxFile();

      // Créer un lien pour le téléchargement
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tokens_count.xlsx'); // Nom du fichier à télécharger
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier :', error);
    }

  }

  const getTotalTokensCount = async () => {
    try {
      const response = await AIRAGApi.getTokensCount('', '', true, false, false, false);

      setGlobalTokens(response);
    } catch (error) {
      console.error('Erreur lors du téléchargement du fichier :', error);
    }

  }
  useEffect(() => {
    getTotalTokensCount();
  }, [])

  if (!metricsData) return <Loading type={LOADER_TYPE.PAGE} />;

  return (
    <LeftSideLayout theme={WALL_TYPE} hasUserIcon>
      <div className={style.metricsContainer}>
        {Object.keys(metricsData).map(key => {
          if (typeof metricsData[key] === NUMBER) {
            return <MetricBlock titleKey={key} value={metricsData[key]} key={key} />;
          }

          if (key === TYPES_OF_PROGRAMS) {
            return <MetricBlockWithList titleKey={key} value={metricsData[key]} key={key} />;
          }

          if (key === TOTAL_REVENUE_SUBSCRIPTIONS || key === TOTAL_EMAILS_SENT) {
            return (
              <MetricBlock
                titleKey={key}
                value={formatMessage({ id: 'metrics.comingSoon' })}
                key={key}
                comingSoonContent={true}
              />
            );
          }
          if (key === TOTAL_SIZE_OF_DOCUMENTS) {
            return (
              <MetricBlock
                titleKey={key}
                value={globalTokens}
                key={key}
                onClick={getTokensCountFile}
                isLink={true}
                isImage= {true}
              />
            );
          }

          return <MetricBlock titleKey={key} value={!metricsData[key] && '-'} key={key} />;
        })}
      </div>
    </LeftSideLayout>
  );
};

export default MetricsPage;

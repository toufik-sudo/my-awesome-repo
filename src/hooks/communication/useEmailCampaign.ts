import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import usePrevious from 'hooks/general/usePrevious';
import CommunicationsApi from 'api/CommunicationsApi';
import usePlatformIdSelection from 'hooks/wall/slider/usePlatformIdSelection';
import { IEmailCampaign } from 'interfaces/components/wall/communication/ICampaign';
import { mapCampaignRequestData } from 'services/communications/EmailCampaignService';
import { ISortable } from 'interfaces/api/ISortable';
import { DEFAULT_FILTER_EMAIL_CAMPAIGN_LIST } from 'constants/communications/campaign';
import { useWallSelection } from 'hooks/wall/useWallSelection';

const communicationsApi = new CommunicationsApi();

/**
 * Hook for Communication email campaign list page
 *
 * @param campaignFilterOptions
 */
export const useEmailCampaign = campaignFilterOptions => {
  const { formatMessage } = useIntl();
  const [statusFilter, setFilter] = useState<any>(campaignFilterOptions[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [campaigns, setCampaigns] = useState<IEmailCampaign[]>([]);
  const [sortingFilter, setSortingFilter] = useState<ISortable>(DEFAULT_FILTER_EMAIL_CAMPAIGN_LIST);
  const platformId = usePlatformIdSelection();
  const { selectedProgramId: programId } = useWallSelection();
  const prevState = usePrevious({ programId });

  useEffect(() => {
    if (!platformId) {
      return;
    }
    if (prevState && prevState.programId !== programId && sortingFilter !== DEFAULT_FILTER_EMAIL_CAMPAIGN_LIST) {
      setSortingFilter(DEFAULT_FILTER_EMAIL_CAMPAIGN_LIST);
      return;
    }

    setIsLoading(true);
    const params = mapCampaignRequestData({ statusFilter: statusFilter, programId, platformId, ...sortingFilter });

    communicationsApi
      .getEmailCampaignsData(params)
      .then(({ data }) => setCampaigns(data.data))
      .catch(() => toast(formatMessage({ id: 'toast.message.generic.error' })))
      .finally(() => setIsLoading(false));
  }, [statusFilter, programId, sortingFilter, platformId]);

  const hasNoCampaigns = !isLoading && !campaigns.length;

  return {
    statusFilter,
    setFilter,
    campaigns,
    setSortingFilter,
    sortingFilter,
    hasNoCampaigns,
    isLoading,
    programId
  };
};

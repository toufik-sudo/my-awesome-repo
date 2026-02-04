// -----------------------------------------------------------------------------
// SocialStep Component
// Standalone step for linking social network accounts in the launch wizard
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useIntl } from 'react-intl';
import { useLaunchWizard } from '@/features/launch/hooks/useLaunchWizard';
import { SocialNetworksConfig, SocialNetwork } from '../contents/SocialNetworksConfig';

const SOCIAL_NETWORKS_DEFAULT: SocialNetwork[] = [
    { id: 'facebook', name: 'Facebook', url: '', enabled: false, placeholder: 'https://facebook.com/yourpage', icon: 'Facebook' },
    { id: 'instagram', name: 'Instagram', url: '', enabled: false, placeholder: 'https://instagram.com/yourprofile', icon: 'Instagram' },
    { id: 'linkedin', name: 'LinkedIn', url: '', enabled: false, placeholder: 'https://linkedin.com/company/yourcompany', icon: 'Linkedin' },
    { id: 'twitter', name: 'X (Twitter)', url: '', enabled: false, placeholder: 'https://x.com/yourhandle', icon: 'Twitter' },
    { id: 'youtube', name: 'YouTube', url: '', enabled: false, placeholder: 'https://youtube.com/@yourchannel', icon: 'Youtube' },
    { id: 'website', name: 'Website', url: '', enabled: false, placeholder: 'https://yourwebsite.com', icon: 'Globe' },
];

export const SocialStep: React.FC = () => {
    const { formatMessage } = useIntl();
    const { updateStepData, launchData } = useLaunchWizard();

    const [socialNetworks, setSocialNetworks] = useState < SocialNetwork[] > (
        (launchData.socialMediaAccounts as SocialNetwork[]) || SOCIAL_NETWORKS_DEFAULT
    );

    useEffect(() => {
        updateStepData('socialMediaAccounts', socialNetworks);
    }, [socialNetworks]);

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                    <Sparkles className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold">
                        {formatMessage({ id: 'contents.socialNetworks.title', defaultMessage: 'Social Networks' })}
                    </h1>
                </div>
                <p className="text-muted-foreground max-w-lg mx-auto">
                    {formatMessage({
                        id: 'contents.socialNetworks.subtitle',
                        defaultMessage: 'Connect your social media accounts to engage with participants.',
                    })}
                </p>
            </div>

            <SocialNetworksConfig
                networks={socialNetworks}
                onChange={setSocialNetworks}
            />
        </div>
    );
};

export default SocialStep;

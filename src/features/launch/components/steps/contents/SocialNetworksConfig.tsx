// -----------------------------------------------------------------------------
// Social Networks Configuration Component
// Configure social media links for the program
// -----------------------------------------------------------------------------

import React from 'react';
import { useIntl } from 'react-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SocialNetwork {
  id: string;
  name: string;
  icon: React.ReactNode;
  url: string;
  enabled: boolean;
  placeholder: string;
}

interface SocialNetworksConfigProps {
  networks: SocialNetwork[];
  onChange: (networks: SocialNetwork[]) => void;
}

const DEFAULT_NETWORKS: Omit<SocialNetwork, 'url' | 'enabled'>[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: <Facebook className="h-5 w-5 text-[#1877F2]" />,
    placeholder: 'https://facebook.com/yourpage',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: <Instagram className="h-5 w-5 text-[#E4405F]" />,
    placeholder: 'https://instagram.com/yourprofile',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: <Linkedin className="h-5 w-5 text-[#0A66C2]" />,
    placeholder: 'https://linkedin.com/company/yourcompany',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: <Twitter className="h-5 w-5 text-foreground" />,
    placeholder: 'https://x.com/yourhandle',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: <Youtube className="h-5 w-5 text-[#FF0000]" />,
    placeholder: 'https://youtube.com/@yourchannel',
  },
  {
    id: 'website',
    name: 'Website',
    icon: <Globe className="h-5 w-5 text-primary" />,
    placeholder: 'https://yourwebsite.com',
  },
];

export const SocialNetworksConfig: React.FC<SocialNetworksConfigProps> = ({
  networks,
  onChange,
}) => {
  const { formatMessage } = useIntl();

  // Initialize networks if empty
  const currentNetworks = networks.length > 0
    ? networks
    : DEFAULT_NETWORKS.map((n) => ({ ...n, url: '', enabled: false }));

  const handleToggle = (id: string, enabled: boolean) => {
    onChange(
      currentNetworks.map((n) =>
        n.id === id ? { ...n, enabled } : n
      )
    );
  };

  const handleUrlChange = (id: string, url: string) => {
    onChange(
      currentNetworks.map((n) =>
        n.id === id ? { ...n, url, enabled: url.length > 0 || n.enabled } : n
      )
    );
  };

  const enabledCount = currentNetworks.filter((n) => n.enabled && n.url).length;

  return (
    <Card className="border-2 border-border/50 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Share2 className="h-5 w-5 text-primary" />
              {formatMessage({ id: 'contents.socialNetworks.title', defaultMessage: 'Social Networks' })}
            </CardTitle>
            <CardDescription>
              {formatMessage({ 
                id: 'contents.socialNetworks.description', 
                defaultMessage: 'Add your social media links to connect with participants' 
              })}
            </CardDescription>
          </div>
          {enabledCount > 0 && (
            <Badge variant="secondary" className="gap-1">
              <CheckCircle2 className="h-3 w-3" />
              {enabledCount} {formatMessage({ id: 'common.configured', defaultMessage: 'configured' })}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {currentNetworks.map((network) => (
            <div
              key={network.id}
              className={cn(
                'flex items-center gap-4 p-4 rounded-lg border-2 transition-all',
                network.enabled && network.url
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-transparent bg-muted/30'
              )}
            >
              <div className="flex-shrink-0 p-2 rounded-lg bg-background shadow-sm">
                {network.icon}
              </div>
              
              <div className="flex-1 space-y-1">
                <Label className="font-medium">{network.name}</Label>
                <Input
                  value={network.url}
                  onChange={(e) => handleUrlChange(network.id, e.target.value)}
                  placeholder={network.placeholder}
                  className={cn(
                    'transition-opacity',
                    !network.enabled && 'opacity-50'
                  )}
                />
              </div>
              
              <div className="flex-shrink-0">
                <Switch
                  checked={network.enabled}
                  onCheckedChange={(checked) => handleToggle(network.id, checked)}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialNetworksConfig;

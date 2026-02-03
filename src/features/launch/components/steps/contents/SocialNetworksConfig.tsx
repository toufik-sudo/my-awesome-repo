// -----------------------------------------------------------------------------
// SocialNetworksConfig
// Renders configurable social network links for content step
// -----------------------------------------------------------------------------

import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
  Icon as LucideIcon
} from 'lucide-react';

export interface SocialNetwork {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  placeholder: string;
  icon: string; // icon name, not React element!
}

interface Props {
  networks: SocialNetwork[];
  onChange: (networks: SocialNetwork[]) => void;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Globe,
};

export const SocialNetworksConfig: React.FC<Props> = ({ networks, onChange }) => {
  const handleToggle = (idx: number) => {
    const updated = networks.map((n, i) =>
      i === idx ? { ...n, enabled: !n.enabled } : n
    );
    onChange(updated);
  };

  const handleUrlChange = (idx: number, url: string) => {
    const updated = networks.map((n, i) => (i === idx ? { ...n, url } : n));
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {networks.map((network, idx) => {
        const LucideIcon = ICON_MAP[network.icon] || Globe;
        return (
          <div
            key={network.id}
            className={cn(
              'flex items-center gap-4 p-4 border rounded-lg bg-muted/50',
              network.enabled && 'border-primary shadow-sm'
            )}
          >
            <div className="shrink-0">
              <LucideIcon className={cn('h-7 w-7', network.enabled ? 'text-primary' : 'text-muted-foreground')} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">{network.name}</span>
                <Switch checked={network.enabled} onCheckedChange={() => handleToggle(idx)} />
              </div>
              <Input
                type="url"
                placeholder={network.placeholder}
                value={network.url}
                onChange={(e) => handleUrlChange(idx, e.target.value)}
                disabled={!network.enabled}
                className="mt-2"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default SocialNetworksConfig;
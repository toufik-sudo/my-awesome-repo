// -----------------------------------------------------------------------------
// ContactUsWidget Component
// Contact widget with support info
// Migrated from old_app/src/components/molecules/wall/widgets/ContactUsWidget.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Mail, MessageSquare, HelpCircle, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WidgetCard } from './WidgetCard';
import { Button } from '@/components/ui/button';

interface ContactUsWidgetProps {
  className?: string;
  colorWidgetTitle?: string;
  colorMainButtons?: string;
  supportEmail?: string;
  supportUrl?: string;
}

const ContactUsWidget: React.FC<ContactUsWidgetProps> = ({
  className,
  colorWidgetTitle,
  colorMainButtons,
  supportEmail = 'support@rewardzai.com',
  supportUrl,
}) => {
  const handleContactClick = () => {
    if (supportUrl) {
      window.open(supportUrl, '_blank', 'noopener,noreferrer');
    } else if (supportEmail) {
      window.location.href = `mailto:${supportEmail}`;
    }
  };

  return (
    <WidgetCard
      title={
        <span style={colorWidgetTitle ? { color: colorWidgetTitle } : undefined}>
          <FormattedMessage id="wall.contactUs.title" defaultMessage="Need Help?" />
        </span>
      }
      className={cn('min-h-[160px]', className)}
      accentColor="muted"
      hideOnMobile
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {/* Icon */}
        <div className="p-3 rounded-full bg-muted">
          <HelpCircle className="h-6 w-6 text-muted-foreground" />
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground text-center">
          <FormattedMessage 
            id="wall.contactUs.description" 
            defaultMessage="Have questions? We're here to help!" 
          />
        </p>

        {/* Contact Options */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => window.location.href = `mailto:${supportEmail}`}
            style={colorMainButtons ? { borderColor: colorMainButtons, color: colorMainButtons } : undefined}
          >
            <Mail className="h-4 w-4" />
            <FormattedMessage id="wall.contactUs.email" defaultMessage="Email" />
          </Button>

          {supportUrl && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleContactClick}
              style={colorMainButtons ? { borderColor: colorMainButtons, color: colorMainButtons } : undefined}
            >
              <MessageSquare className="h-4 w-4" />
              <FormattedMessage id="wall.contactUs.chat" defaultMessage="Chat" />
              <ExternalLink className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </WidgetCard>
  );
};

export { ContactUsWidget };
export default ContactUsWidget;

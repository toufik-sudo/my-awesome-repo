// -----------------------------------------------------------------------------
// Subscription Page Component
// Page for selecting subscription plan after email confirmation
// Migrated from old_app/src/components/pages/SubscriptionPage.tsx
// -----------------------------------------------------------------------------

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Check, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeftSideLayout } from '@/components/library/organisms/LeftSideLayout';
import { PERSONAL_INFORMATION_ROUTE, WALL_ROUTE } from '@/constants/routes';

interface SubscriptionTier {
  id: string;
  nameId: string;
  nameDefault: string;
  priceId: string;
  priceDefault: string;
  descriptionId: string;
  descriptionDefault: string;
  features: Array<{ id: string; default: string }>;
  recommended?: boolean;
}

const subscriptionTiers: SubscriptionTier[] = [
  {
    id: 'free',
    nameId: 'subscription.tier.free.name',
    nameDefault: 'Free Plan',
    priceId: 'subscription.tier.free.price',
    priceDefault: '$0/month',
    descriptionId: 'subscription.tier.free.description',
    descriptionDefault: 'Get started with basic features',
    features: [
      { id: 'subscription.tier.free.feature1', default: 'Basic program management' },
      { id: 'subscription.tier.free.feature2', default: 'Up to 10 participants' },
      { id: 'subscription.tier.free.feature3', default: 'Email support' },
    ],
  },
  {
    id: 'pro',
    nameId: 'subscription.tier.pro.name',
    nameDefault: 'Professional',
    priceId: 'subscription.tier.pro.price',
    priceDefault: '$29/month',
    descriptionId: 'subscription.tier.pro.description',
    descriptionDefault: 'For growing teams and organizations',
    features: [
      { id: 'subscription.tier.pro.feature1', default: 'Advanced analytics' },
      { id: 'subscription.tier.pro.feature2', default: 'Up to 100 participants' },
      { id: 'subscription.tier.pro.feature3', default: 'Priority support' },
      { id: 'subscription.tier.pro.feature4', default: 'Custom branding' },
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    nameId: 'subscription.tier.enterprise.name',
    nameDefault: 'Enterprise',
    priceId: 'subscription.tier.enterprise.price',
    priceDefault: 'Contact us',
    descriptionId: 'subscription.tier.enterprise.description',
    descriptionDefault: 'For large-scale deployments',
    features: [
      { id: 'subscription.tier.enterprise.feature1', default: 'Unlimited participants' },
      { id: 'subscription.tier.enterprise.feature2', default: 'Dedicated account manager' },
      { id: 'subscription.tier.enterprise.feature3', default: 'Custom integrations' },
      { id: 'subscription.tier.enterprise.feature4', default: 'SLA guarantees' },
    ],
  },
];

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();

  const handleSelectPlan = (planId: string) => {
    // Store selected plan and navigate to personal info
    localStorage.setItem('selectedPlan', planId);
    navigate(PERSONAL_INFORMATION_ROUTE);
  };

  const handleSkip = () => {
    // Default to free plan
    localStorage.setItem('selectedPlan', 'free');
    navigate(WALL_ROUTE);
  };

  return (
    <LeftSideLayout>
      <div className="container max-w-5xl mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">
              <FormattedMessage id="subscription.title" defaultMessage="Choose Your Plan" />
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            <FormattedMessage 
              id="subscription.subtitle" 
              defaultMessage="Select the plan that best fits your needs. You can always upgrade later." 
            />
          </p>
        </div>

        {/* Subscription Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {subscriptionTiers.map((tier) => (
            <Card 
              key={tier.id}
              className={`relative flex flex-col ${tier.recommended ? 'border-primary shadow-lg' : ''}`}
            >
              {tier.recommended && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <FormattedMessage id="subscription.recommended" defaultMessage="Recommended" />
                </Badge>
              )}

              <CardHeader>
                <CardTitle>
                  <FormattedMessage id={tier.nameId} defaultMessage={tier.nameDefault} />
                </CardTitle>
                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    <FormattedMessage id={tier.priceId} defaultMessage={tier.priceDefault} />
                  </span>
                </div>
                <CardDescription>
                  <FormattedMessage id={tier.descriptionId} defaultMessage={tier.descriptionDefault} />
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-sm">
                        <FormattedMessage id={feature.id} defaultMessage={feature.default} />
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  onClick={() => handleSelectPlan(tier.id)}
                  className="w-full"
                  variant={tier.recommended ? 'default' : 'outline'}
                >
                  <FormattedMessage id="subscription.select" defaultMessage="Select Plan" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Skip Option */}
        <div className="text-center">
          <Button variant="ghost" onClick={handleSkip}>
            <FormattedMessage id="subscription.skip" defaultMessage="Skip for now" />
          </Button>
        </div>
      </div>
    </LeftSideLayout>
  );
};

export default SubscriptionPage;

// -----------------------------------------------------------------------------
// Pricing Page Component
// Standalone pricing page with all plan details
// Migrated from old_app/src/components/pages/PricingPage.tsx
// -----------------------------------------------------------------------------

import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { Check, ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ROOT, CREATE_ACCOUNT_ROUTE } from '@/constants/routes';

interface PricingPlan {
  id: string;
  nameId: string;
  nameDefault: string;
  priceId: string;
  priceDefault: string;
  descriptionId: string;
  descriptionDefault: string;
  features: Array<{ id: string; default: string }>;
  popular?: boolean;
  ctaId: string;
  ctaDefault: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    nameId: 'pricing.plan.starter.name',
    nameDefault: 'Starter',
    priceId: 'pricing.plan.starter.price',
    priceDefault: 'Free',
    descriptionId: 'pricing.plan.starter.description',
    descriptionDefault: 'Perfect for getting started',
    features: [
      { id: 'pricing.plan.starter.feature1', default: 'Up to 10 users' },
      { id: 'pricing.plan.starter.feature2', default: '1 active program' },
      { id: 'pricing.plan.starter.feature3', default: 'Basic analytics' },
      { id: 'pricing.plan.starter.feature4', default: 'Email support' },
    ],
    ctaId: 'pricing.plan.starter.cta',
    ctaDefault: 'Get Started',
  },
  {
    id: 'professional',
    nameId: 'pricing.plan.professional.name',
    nameDefault: 'Professional',
    priceId: 'pricing.plan.professional.price',
    priceDefault: '$49/mo',
    descriptionId: 'pricing.plan.professional.description',
    descriptionDefault: 'Best for growing teams',
    features: [
      { id: 'pricing.plan.professional.feature1', default: 'Up to 100 users' },
      { id: 'pricing.plan.professional.feature2', default: '5 active programs' },
      { id: 'pricing.plan.professional.feature3', default: 'Advanced analytics' },
      { id: 'pricing.plan.professional.feature4', default: 'Priority support' },
      { id: 'pricing.plan.professional.feature5', default: 'Custom branding' },
    ],
    popular: true,
    ctaId: 'pricing.plan.professional.cta',
    ctaDefault: 'Start Free Trial',
  },
  {
    id: 'enterprise',
    nameId: 'pricing.plan.enterprise.name',
    nameDefault: 'Enterprise',
    priceId: 'pricing.plan.enterprise.price',
    priceDefault: 'Custom',
    descriptionId: 'pricing.plan.enterprise.description',
    descriptionDefault: 'For large organizations',
    features: [
      { id: 'pricing.plan.enterprise.feature1', default: 'Unlimited users' },
      { id: 'pricing.plan.enterprise.feature2', default: 'Unlimited programs' },
      { id: 'pricing.plan.enterprise.feature3', default: 'Full analytics suite' },
      { id: 'pricing.plan.enterprise.feature4', default: 'Dedicated support' },
      { id: 'pricing.plan.enterprise.feature5', default: 'Custom integrations' },
      { id: 'pricing.plan.enterprise.feature6', default: 'SLA guarantee' },
    ],
    ctaId: 'pricing.plan.enterprise.cta',
    ctaDefault: 'Contact Sales',
  },
];

const PricingPage: React.FC = () => {
  const { formatMessage } = useIntl();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild>
          <Link to={ROOT}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            <FormattedMessage id="pricing.back" defaultMessage="Back to Home" />
          </Link>
        </Button>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <FormattedMessage id="pricing.title" defaultMessage="Simple, Transparent Pricing" />
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          <FormattedMessage 
            id="pricing.subtitle" 
            defaultMessage="Choose the plan that's right for your team. All plans include a 14-day free trial." 
          />
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative flex flex-col ${plan.popular ? 'border-primary shadow-lg' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <FormattedMessage id="pricing.popular" defaultMessage="Most Popular" />
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-xl">
                  <FormattedMessage id={plan.nameId} defaultMessage={plan.nameDefault} />
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">
                    <FormattedMessage id={plan.priceId} defaultMessage={plan.priceDefault} />
                  </span>
                </div>
                <CardDescription className="mt-2">
                  <FormattedMessage id={plan.descriptionId} defaultMessage={plan.descriptionDefault} />
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
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
                  asChild 
                  className="w-full" 
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  <Link to={`${CREATE_ACCOUNT_ROUTE}?plan=${plan.id}`}>
                    <FormattedMessage id={plan.ctaId} defaultMessage={plan.ctaDefault} />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12 border-t">
        <h2 className="text-2xl font-bold text-center mb-8">
          <FormattedMessage id="pricing.faq.title" defaultMessage="Frequently Asked Questions" />
        </h2>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <h3 className="font-semibold mb-2">
              <FormattedMessage id="pricing.faq.q1" defaultMessage="Can I change plans later?" />
            </h3>
            <p className="text-muted-foreground">
              <FormattedMessage 
                id="pricing.faq.a1" 
                defaultMessage="Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately." 
              />
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              <FormattedMessage id="pricing.faq.q2" defaultMessage="What payment methods do you accept?" />
            </h3>
            <p className="text-muted-foreground">
              <FormattedMessage 
                id="pricing.faq.a2" 
                defaultMessage="We accept all major credit cards, PayPal, and bank transfers for enterprise plans." 
              />
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">
              <FormattedMessage id="pricing.faq.q3" defaultMessage="Is there a free trial?" />
            </h3>
            <p className="text-muted-foreground">
              <FormattedMessage 
                id="pricing.faq.a3" 
                defaultMessage="Yes, all paid plans include a 14-day free trial. No credit card required to start." 
              />
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;

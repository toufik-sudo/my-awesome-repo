import React, { forwardRef } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PRICING, CREATE_ACCOUNT } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface PricingPlan {
  id: string;
  nameId: string;
  priceId: string;
  descriptionId: string;
  features: string[];
  highlighted?: boolean;
  ctaId: string;
}

const pricingPlans: PricingPlan[] = [
  {
    id: 'starter',
    nameId: 'pricing.starter.name',
    priceId: 'pricing.starter.price',
    descriptionId: 'pricing.starter.description',
    features: [
      'pricing.starter.feature1',
      'pricing.starter.feature2',
      'pricing.starter.feature3',
    ],
    ctaId: 'pricing.starter.cta',
  },
  {
    id: 'professional',
    nameId: 'pricing.professional.name',
    priceId: 'pricing.professional.price',
    descriptionId: 'pricing.professional.description',
    features: [
      'pricing.professional.feature1',
      'pricing.professional.feature2',
      'pricing.professional.feature3',
      'pricing.professional.feature4',
    ],
    highlighted: true,
    ctaId: 'pricing.professional.cta',
  },
  {
    id: 'enterprise',
    nameId: 'pricing.enterprise.name',
    priceId: 'pricing.enterprise.price',
    descriptionId: 'pricing.enterprise.description',
    features: [
      'pricing.enterprise.feature1',
      'pricing.enterprise.feature2',
      'pricing.enterprise.feature3',
      'pricing.enterprise.feature4',
      'pricing.enterprise.feature5',
    ],
    ctaId: 'pricing.enterprise.cta',
  },
];

/**
 * Pricing section with plan cards
 */
const PricingSection = forwardRef<HTMLElement>((props, ref) => {
  const intl = useIntl();
  const navigate = useNavigate();

  return (
    <section 
      ref={ref}
      id={PRICING} 
      className="py-20 bg-muted/30"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {intl.formatMessage({ id: 'pricing.title' })}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {intl.formatMessage({ id: 'pricing.subtitle' })}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id}
              className={cn(
                "relative transition-all duration-300 hover:shadow-lg",
                plan.highlighted && "border-primary shadow-lg scale-105"
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    {intl.formatMessage({ id: 'pricing.popular' })}
                  </span>
                </div>
              )}
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-xl">
                  {intl.formatMessage({ id: plan.nameId })}
                </CardTitle>
                <CardDescription>
                  {intl.formatMessage({ id: plan.descriptionId })}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center pb-6">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {intl.formatMessage({ id: plan.priceId })}
                  </span>
                  <span className="text-muted-foreground">/mo</span>
                </div>
                
                <ul className="space-y-3 text-left">
                  {plan.features.map((featureId, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span className="text-sm">
                        {intl.formatMessage({ id: featureId })}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  onClick={() => navigate(CREATE_ACCOUNT)}
                >
                  {intl.formatMessage({ id: plan.ctaId })}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
});

PricingSection.displayName = 'PricingSection';

export default PricingSection;

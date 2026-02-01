import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { Check, Shield, Sparkles, TrendingUp, Gift, Award } from 'lucide-react';
import { FEATURES } from '@/constants/routes';
import { cn } from '@/lib/utils';

interface Feature {
  id: string;
  icon: React.ReactNode;
  titleId: string;
  descriptionId: string;
  benefits: string[];
}

const features: Feature[] = [
  {
    id: 'rewards',
    icon: <Gift className="h-8 w-8" />,
    titleId: 'features.rewards.title',
    descriptionId: 'features.rewards.description',
    benefits: ['features.rewards.benefit1', 'features.rewards.benefit2', 'features.rewards.benefit3'],
  },
  {
    id: 'analytics',
    icon: <TrendingUp className="h-8 w-8" />,
    titleId: 'features.analytics.title',
    descriptionId: 'features.analytics.description',
    benefits: ['features.analytics.benefit1', 'features.analytics.benefit2', 'features.analytics.benefit3'],
  },
  {
    id: 'gamification',
    icon: <Award className="h-8 w-8" />,
    titleId: 'features.gamification.title',
    descriptionId: 'features.gamification.description',
    benefits: ['features.gamification.benefit1', 'features.gamification.benefit2', 'features.gamification.benefit3'],
  },
  {
    id: 'security',
    icon: <Shield className="h-8 w-8" />,
    titleId: 'features.security.title',
    descriptionId: 'features.security.description',
    benefits: ['features.security.benefit1', 'features.security.benefit2', 'features.security.benefit3'],
  },
];

/**
 * Features section with tabs and detailed info
 */
const FeaturesSection: React.FC = () => {
  const intl = useIntl();
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  
  const currentFeature = features.find(f => f.id === activeFeature) || features[0];

  return (
    <section 
      id={FEATURES} 
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {intl.formatMessage({ id: 'features.title' })}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {intl.formatMessage({ id: 'features.subtitle' })}
          </p>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Feature tabs */}
          <div className="lg:col-span-4 space-y-3">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200",
                  activeFeature === feature.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted/50 hover:bg-muted"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg",
                  activeFeature === feature.id
                    ? "bg-primary-foreground/20"
                    : "bg-background"
                )}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold">
                    {intl.formatMessage({ id: feature.titleId })}
                  </h3>
                  <p className={cn(
                    "text-sm",
                    activeFeature === feature.id
                      ? "text-primary-foreground/80"
                      : "text-muted-foreground"
                  )}>
                    {intl.formatMessage({ id: feature.descriptionId })}
                  </p>
                </div>
              </button>
            ))}
          </div>
          
          {/* Feature details */}
          <div className="lg:col-span-8 bg-muted/30 rounded-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                {currentFeature.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {intl.formatMessage({ id: currentFeature.titleId })}
                </h3>
                <p className="text-muted-foreground">
                  {intl.formatMessage({ id: currentFeature.descriptionId })}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              {currentFeature.benefits.map((benefitId, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-primary/10">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="text-foreground">
                    {intl.formatMessage({ id: benefitId })}
                  </p>
                </div>
              ))}
            </div>
            
            {/* Decorative element */}
            <div className="mt-8 flex justify-center">
              <Sparkles className="h-16 w-16 text-primary/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

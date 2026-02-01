import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Button } from '@/components/ui/button';
import { LOGIN, CREATE_ACCOUNT, PRICING, CONTACT } from '@/constants/routes';
import { Link } from 'react-scroll';

/**
 * Hero section with animated title and CTA buttons
 */
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const intl = useIntl();

  return (
    <section 
      id="landing" 
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Animated title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            <span className="text-foreground">
              {intl.formatMessage({ id: 'landing.title.incentive' })}
            </span>
            <br />
            <span className="text-primary">
              {intl.formatMessage({ id: 'landing.title.relationship' })}
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {intl.formatMessage({ id: 'landing.subtitle' })}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate(CREATE_ACCOUNT)}
              className="min-w-[200px]"
            >
              {intl.formatMessage({ id: 'landing.cta.getStarted' })}
            </Button>
            
            <Link to={PRICING} spy smooth offset={-50}>
              <Button 
                size="lg" 
                variant="outline"
                className="min-w-[200px]"
              >
                {intl.formatMessage({ id: 'landing.cta.viewPricing' })}
              </Button>
            </Link>
          </div>
          
          {/* Already have account link */}
          <p className="text-sm text-muted-foreground">
            {intl.formatMessage({ id: 'landing.alreadyHaveAccount' })}{' '}
            <button
              onClick={() => navigate(LOGIN)}
              className="text-primary hover:underline font-medium"
            >
              {intl.formatMessage({ id: 'landing.signIn' })}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

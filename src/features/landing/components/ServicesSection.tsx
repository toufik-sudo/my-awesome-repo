import React from 'react';
import { useIntl } from 'react-intl';
import { BarChart3, Users, Target, Zap } from 'lucide-react';
import { SERVICES } from '@/constants/routes';

interface ServiceItem {
  icon: React.ReactNode;
  titleId: string;
  descriptionId: string;
}

const services: ServiceItem[] = [
  {
    icon: <BarChart3 className="h-12 w-12" />,
    titleId: 'services.item1.title',
    descriptionId: 'services.item1.description',
  },
  {
    icon: <Users className="h-12 w-12" />,
    titleId: 'services.item2.title',
    descriptionId: 'services.item2.description',
  },
  {
    icon: <Target className="h-12 w-12" />,
    titleId: 'services.item3.title',
    descriptionId: 'services.item3.description',
  },
  {
    icon: <Zap className="h-12 w-12" />,
    titleId: 'services.item4.title',
    descriptionId: 'services.item4.description',
  },
];

/**
 * Services section showcasing key features
 */
const ServicesSection: React.FC = () => {
  const intl = useIntl();

  return (
    <section 
      id={SERVICES} 
      className="py-20 bg-muted/50"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {intl.formatMessage({ id: 'services.title' })}{' '}
            <span className="text-primary">
              {intl.formatMessage({ id: 'services.titlePrimary' })}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {intl.formatMessage({ id: 'services.subtitle' })}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center group"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {intl.formatMessage({ id: service.titleId })}
              </h3>
              <p className="text-muted-foreground">
                {intl.formatMessage({ id: service.descriptionId })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

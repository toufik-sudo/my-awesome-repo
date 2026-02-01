import React, { forwardRef } from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { ROOT, LOGIN, PRICING } from '@/constants/routes';

/**
 * Footer section with links and social icons
 */
const FooterSection = forwardRef<HTMLElement>((props, ref) => {
  const intl = useIntl();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { labelId: 'footer.features', href: '/#features' },
      { labelId: 'footer.pricing', href: PRICING },
      { labelId: 'footer.integrations', href: '#' },
    ],
    company: [
      { labelId: 'footer.about', href: '#' },
      { labelId: 'footer.careers', href: '#' },
      { labelId: 'footer.contact', href: '/#contact' },
    ],
    legal: [
      { labelId: 'footer.privacy', href: '#' },
      { labelId: 'footer.terms', href: '#' },
      { labelId: 'footer.cookies', href: '#' },
    ],
  };

  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Github className="h-5 w-5" />, href: '#', label: 'GitHub' },
    { icon: <Mail className="h-5 w-5" />, href: '#', label: 'Email' },
  ];

  return (
    <footer ref={ref} className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to={ROOT} className="text-2xl font-bold text-primary">
              RewardzAi
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              {intl.formatMessage({ id: 'footer.tagline' })}
            </p>
          </div>
          
          {/* Product links */}
          <div>
            <h3 className="font-semibold mb-4">
              {intl.formatMessage({ id: 'footer.product' })}
            </h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {intl.formatMessage({ id: link.labelId })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company links */}
          <div>
            <h3 className="font-semibold mb-4">
              {intl.formatMessage({ id: 'footer.company' })}
            </h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {intl.formatMessage({ id: link.labelId })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Legal links */}
          <div>
            <h3 className="font-semibold mb-4">
              {intl.formatMessage({ id: 'footer.legal' })}
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {intl.formatMessage({ id: link.labelId })}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} RewardzAi. {intl.formatMessage({ id: 'footer.rights' })}
          </p>
          
          {/* Social links */}
          <div className="flex gap-4">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
});

FooterSection.displayName = 'FooterSection';

export default FooterSection;

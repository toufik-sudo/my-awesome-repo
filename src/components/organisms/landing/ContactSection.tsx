import React from 'react';

import ContactFormWrapper from 'components/organisms/form-wrappers/ContactFormWrapper';
import HeadingAtom from 'components/atoms/ui/Heading';
import { CONTACT } from 'constants/routes';
import contactSectionImg from 'assets/images/contact.png';
import ContactFormAdditional from '../../molecules/forms/ContactFormAdditional';
import SuccessModal from 'components/organisms/modals/SuccessModal';

import coreStyle from 'sass-boilerplate/stylesheets/style.module.scss';
import componentStyle from 'sass-boilerplate/stylesheets/components/landing/ContactSection.module.scss';

/**
 * Organism component that renders contact section
 *
 * @constructor
 */
const { section, sectionTitle, withDefaultColor, withBackgroundImage, textCenter, contentCentered } = coreStyle;
const { contactSectionTitle, contactSection } = componentStyle;

const ContactSection = () => (
  <section
    id={CONTACT}
    className={`${contactSection} ${withBackgroundImage} ${section} ${contentCentered}`}
    style={{ backgroundImage: `url(${contactSectionImg})` }}
  >
    <div>
      <HeadingAtom
        size="2"
        className={`${sectionTitle} ${contactSectionTitle} ${withDefaultColor} ${textCenter}`}
        textId="contact.header.title"
      />
      <ContactFormWrapper />
      <ContactFormAdditional />
      <SuccessModal closeButtonHidden={false} isOnboardingFlow={false} />
    </div>
  </section>
);

export default ContactSection;

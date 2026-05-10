/**
 * Role-specific Terms & Conditions content for the onboarding consent step.
 *
 * Each role gets a tailored set of clauses. The agent-facing layer renders
 * these as expandable sections inside the consent step. The user must tick
 * ALL required checkboxes (general T&C + role-specific T&C + privacy) before
 * the form can be submitted.
 */
import type { OnboardingRole } from '../onboarding.api';

export interface TermsClause {
  title: string;
  body: string;
}

export interface RoleTerms {
  /** Plain title displayed on the consent step header. */
  roleLabel: string;
  /** Short tagline shown beneath the role label. */
  intro: string;
  /** Long-form clauses grouped under collapsible sections. */
  clauses: TermsClause[];
}

const GENERAL_CLAUSES: TermsClause[] = [
  {
    title: 'Acceptance of Terms',
    body:
      'By creating an account, you confirm that you are at least 18 years old, have legal capacity to enter into a binding agreement, and accept these Terms of Service and our Privacy Policy in full.',
  },
  {
    title: 'Account Security',
    body:
      'You are responsible for maintaining the confidentiality of your credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use.',
  },
  {
    title: 'Acceptable Use',
    body:
      'You agree not to use the platform to publish unlawful, harmful, fraudulent, defamatory or infringing content, nor to attempt to interfere with the security or integrity of the service.',
  },
  {
    title: 'Data Processing',
    body:
      'Your personal data is processed in accordance with our Privacy Policy. You may request access, rectification, portability or deletion of your data at any time through your account settings.',
  },
  {
    title: 'Suspension & Termination',
    body:
      'We may suspend or terminate access to accounts that breach these terms, applicable laws, or community guidelines. You may close your account at any time.',
  },
];

export const ROLE_TERMS: Record<OnboardingRole, RoleTerms> = {
  guest: {
    roleLabel: 'Guest',
    intro:
      'As a Guest, you can browse listings and request a stay. Confirmed bookings are subject to host approval and the platform service fees in effect on the booking date.',
    clauses: [
      ...GENERAL_CLAUSES,
      {
        title: 'Bookings & Payments',
        body:
          'All bookings must be paid through the platform. Cancellations follow the policy displayed on each listing. Refunds are processed using the original payment method within the timeframe stated.',
      },
      {
        title: 'Conduct & Reviews',
        body:
          'You agree to respect the property, the host, and other guests. After each stay you may leave a review; reviews must be honest, lawful and free of personal attacks.',
      },
    ],
  },

  user: {
    roleLabel: 'User',
    intro:
      'As a User, you have full access to bookings, reviews, points and community features. Some advanced features may require additional verification of your identity.',
    clauses: [
      ...GENERAL_CLAUSES,
      {
        title: 'Identity Verification',
        body:
          'For security and regulatory compliance you may be asked to verify your identity. Verified accounts unlock additional features such as larger transactions and host applications.',
      },
      {
        title: 'Loyalty Points',
        body:
          'Points earned on the platform have no monetary value, are non-transferable and may expire as described in the rewards program rules.',
      },
    ],
  },

  manager: {
    roleLabel: 'Manager',
    intro:
      'As a Manager you operate listings and bookings on behalf of property owners. You commit to act with diligence, fairness and within the limits of the mandate granted to you.',
    clauses: [
      ...GENERAL_CLAUSES,
      {
        title: 'Listing Accuracy',
        body:
          'You are responsible for the accuracy of every listing you publish — pricing, availability, photographs, amenities and applicable taxes must reflect reality at all times.',
      },
      {
        title: 'Guest Care',
        body:
          'You must respond to guest enquiries within 24 hours, honour confirmed bookings and ensure each property meets the safety, cleanliness and comfort standards advertised.',
      },
      {
        title: 'Commission & Fees',
        body:
          'Platform commission, payment processing fees and any tax withholdings will be deducted automatically from each payout. Detailed statements are available in the payout dashboard.',
      },
      {
        title: 'Anti-Fraud',
        body:
          'Manipulating reviews, redirecting bookings off-platform or using stolen identities for verification are zero-tolerance violations and lead to immediate termination.',
      },
    ],
  },

  hyper_manager: {
    roleLabel: 'Hyper Manager',
    intro:
      'As a Hyper Manager you supervise multiple managers and have access to operational analytics, payouts and dispute tooling. With this scope come stronger compliance duties.',
    clauses: [
      ...GENERAL_CLAUSES,
      {
        title: 'Confidentiality',
        body:
          'You will access commercially sensitive data including financial reports and guest PII. You must keep this data confidential and use it solely to fulfil your operational duties.',
      },
      {
        title: 'Delegation & Oversight',
        body:
          'You are accountable for the actions of the managers under your supervision. You must monitor performance, investigate flagged incidents and escalate suspected fraud to the platform.',
      },
      {
        title: 'Audit Compliance',
        body:
          'All actions performed in the platform are logged. You agree to cooperate with internal and external audits, including providing supporting documentation when requested.',
      },
      {
        title: 'Conflict of Interest',
        body:
          'You must disclose any personal or financial relationship with managers, hosts or guests under your supervision that could compromise impartial decision-making.',
      },
    ],
  },

  admin: {
    roleLabel: 'Host / Admin',
    intro:
      'As a Host/Admin you publish properties under your own name and have moderation authority over your assets. You assume responsibility for legal compliance of every listing.',
    clauses: [
      ...GENERAL_CLAUSES,
      {
        title: 'Legal Compliance',
        body:
          'You confirm that you are entitled to commercialise every property you publish (ownership, mandate or operating licence) and that you comply with local rental, tax and tourism regulations.',
      },
      {
        title: 'Tax Obligations',
        body:
          'You are solely responsible for declaring rental income to the competent tax authorities. The platform may transmit transaction reports to authorities when legally required.',
      },
      {
        title: 'Insurance',
        body:
          'You confirm that adequate civil liability and property insurance is in place for the duration each property is published on the platform.',
      },
      {
        title: 'Content Ownership',
        body:
          'You retain ownership of the content you upload and grant the platform a worldwide, royalty-free licence to display it for the purpose of operating the service.',
      },
    ],
  },

  hyper_admin: {
    roleLabel: 'Hyper Admin',
    intro:
      'Hyper Admins have platform-wide privileges. By accepting these terms you acknowledge enhanced security, confidentiality and ethical obligations.',
    clauses: [
      ...GENERAL_CLAUSES,
      {
        title: 'Confidentiality & Data Protection',
        body:
          'You will access PII, financial data and security configuration. You must apply industry-standard precautions, never extract data outside approved tools, and report any breach within 24 hours.',
      },
      {
        title: 'Change Management',
        body:
          'Configuration changes that affect availability, pricing rules or RBAC must follow the documented review process. Emergency changes must be logged and justified within one business day.',
      },
      {
        title: 'Code of Conduct',
        body:
          'You commit to act with integrity, neutrality and respect, refrain from accessing data without legitimate purpose, and report any abuse of privileges by other admins.',
      },
      {
        title: 'Audit & Liability',
        body:
          'All Hyper Admin actions are logged immutably. You may be held personally liable for damages caused by gross negligence or intentional misuse of your privileges.',
      },
    ],
  },
};

/** Convenience getter with a sensible fallback. */
export function getRoleTerms(role: OnboardingRole | undefined | null): RoleTerms {
  return ROLE_TERMS[(role || 'user') as OnboardingRole] || ROLE_TERMS.user;
}

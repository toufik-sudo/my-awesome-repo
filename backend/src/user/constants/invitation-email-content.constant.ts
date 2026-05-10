import { AppRole } from '../entity/user.entity';

export type InvitationEmailLanguage = 'fr' | 'en' | 'ar';

export interface InvitationEmailCopy {
  subject: string;
  reminderSubject: string;
  preheader: string;
  title: string;
  intro: string;
  invitedByLabel: string;
  inviterRoleLabel: string;
  invitedAsLabel: string;
  onboardingTitle: string;
  onboardingDescription: string;
  onboardingStepsTitle: string;
  onboardingSteps: string[];
  accessTitle: string;
  expirationText: string;
  customMessageLabel: string;
  actionLabel: string;
  actionHint: string;
  fallbackText: string;
  securityTitle: string;
  securityItems: string[];
  contactLabel: string;
  recipientLabel: string;
  invitationTypeLabel: string;
}

const LANGUAGE_META: Record<InvitationEmailLanguage, { locale: string; dir: 'ltr' | 'rtl' }> = {
  fr: { locale: 'fr-FR', dir: 'ltr' },
  en: { locale: 'en-US', dir: 'ltr' },
  ar: { locale: 'ar-DZ', dir: 'rtl' },
};

const ROLE_LABELS: Record<InvitationEmailLanguage, Record<AppRole, string>> = {
  fr: {
    hyper_admin: 'Hyper Admin',
    hyper_manager: 'Hyper Manager',
    admin: 'Admin hôte',
    manager: 'Manager',
    user: 'Utilisateur',
    guest: 'Invité',
  },
  en: {
    hyper_admin: 'Hyper Admin',
    hyper_manager: 'Hyper Manager',
    admin: 'Host Admin',
    manager: 'Manager',
    user: 'User',
    guest: 'Guest',
  },
  ar: {
    hyper_admin: 'مشرف أعلى',
    hyper_manager: 'مدير أعلى',
    admin: 'مضيف إداري',
    manager: 'مدير',
    user: 'مستخدم',
    guest: 'ضيف',
  },
};

const ACTION_LABELS: Record<InvitationEmailLanguage, Record<AppRole, string>> = {
  fr: {
    hyper_admin: 'Rejoindre comme Hyper Admin',
    hyper_manager: 'Activer mon accès Hyper Manager',
    admin: 'Créer mon espace Admin hôte',
    manager: 'Activer mon accès Manager',
    user: 'Rejoindre la plateforme',
    guest: 'Continuer comme invité',
  },
  en: {
    hyper_admin: 'Join as Hyper Admin',
    hyper_manager: 'Activate Hyper Manager access',
    admin: 'Create my Host Admin workspace',
    manager: 'Activate Manager access',
    user: 'Join the platform',
    guest: 'Continue as guest',
  },
  ar: {
    hyper_admin: 'الانضمام كمشرف أعلى',
    hyper_manager: 'تفعيل صلاحية المدير الأعلى',
    admin: 'إنشاء مساحة المضيف الإداري',
    manager: 'تفعيل صلاحية المدير',
    user: 'الانضمام إلى المنصة',
    guest: 'المتابعة كضيف',
  },
};

export function normalizeInvitationLanguage(language?: string | null): InvitationEmailLanguage {
  const value = (language || '').toLowerCase();
  if (value.startsWith('ar')) return 'ar';
  if (value.startsWith('en')) return 'en';
  return 'fr';
}

export function getInvitationLanguageMeta(language: InvitationEmailLanguage) {
  return LANGUAGE_META[language];
}

export function getLocalizedRoleLabel(role: AppRole, language: InvitationEmailLanguage): string {
  return ROLE_LABELS[language][role] || role;
}

export function formatInvitationExpiry(date: Date, language: InvitationEmailLanguage): string {
  return new Intl.DateTimeFormat(LANGUAGE_META[language].locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function buildInvitationAccessItems(params: {
  language: InvitationEmailLanguage;
  inviterName: string;
  inviterRole: AppRole;
  invitedRole: AppRole;
  appName: string;
}): string[] {
  const { language, inviterName, inviterRole, invitedRole, appName } = params;

  const byLanguage: Record<InvitationEmailLanguage, Record<AppRole, string[]>> = {
    fr: {
      hyper_admin: [
        `Accès complet à la gouvernance de ${appName}.`,
        'Gestion avancée des règles, permissions et supervision globale.',
      ],
      hyper_manager: [
        `Accès de supervision élargie accordé par ${inviterName}.`,
        'Gestion des opérations globales selon les permissions qui vous seront attribuées.',
      ],
      admin: [
        `Création et gestion de vos propres hébergements et services sur ${appName}.`,
        'Pilotage des équipes, réservations et opérations dans votre périmètre.',
      ],
      manager: [
        `Accès manager accordé par ${inviterName}.`,
        'Gestion uniquement des propriétés et services qui vous seront assignés.',
      ],
      user: [
        `Accès standard à ${appName} pour explorer, réserver et interagir avec la plateforme.`,
      ],
      guest: [
        inviterRole === 'manager'
          ? `Accès invité limité au périmètre actuellement géré par ${inviterName}.`
          : `Accès invité aux propriétés et services partagés par ${inviterName}.`,
        'Consultation et réservation uniquement, sans droits de gestion.',
      ],
    },
    en: {
      hyper_admin: [
        `Full governance access across ${appName}.`,
        'Advanced oversight of rules, permissions, and platform-wide operations.',
      ],
      hyper_manager: [
        `Extended supervisory access granted by ${inviterName}.`,
        'Manage global operations based on the permissions assigned to you.',
      ],
      admin: [
        `Create and manage your own properties and services on ${appName}.`,
        'Run team operations, bookings, and day-to-day management within your scope.',
      ],
      manager: [
        `Manager access granted by ${inviterName}.`,
        'Manage only the properties and services explicitly assigned to you.',
      ],
      user: [
        `Standard ${appName} access to explore listings, make bookings, and use the platform.`,
      ],
      guest: [
        inviterRole === 'manager'
          ? `Guest access limited to the scope currently managed by ${inviterName}.`
          : `Guest access to the properties and services shared by ${inviterName}.`,
        'Browse and book only, with no management permissions.',
      ],
    },
    ar: {
      hyper_admin: [
        `وصول كامل لإدارة وحوكمة ${appName}.`,
        'إشراف متقدم على القواعد والصلاحيات والعمليات على مستوى المنصة بالكامل.',
      ],
      hyper_manager: [
        `صلاحية إشراف موسعة ممنوحة من ${inviterName}.`,
        'إدارة العمليات العامة وفق الصلاحيات التي سيتم إسنادها إليك.',
      ],
      admin: [
        `إنشاء وإدارة عقاراتك وخدماتك الخاصة على ${appName}.`,
        'إدارة الفريق والحجوزات والعمليات اليومية ضمن نطاقك.',
      ],
      manager: [
        `تم منحك صلاحية مدير من طرف ${inviterName}.`,
        'إدارة العقارات والخدمات التي يتم إسنادها إليك فقط.',
      ],
      user: [
        `وصول قياسي إلى ${appName} للاستكشاف والحجز واستخدام المنصة.`,
      ],
      guest: [
        inviterRole === 'manager'
          ? `وصول الضيف محدود بالنطاق الذي يديره ${inviterName} حالياً.`
          : `وصول الضيف إلى العقارات والخدمات التي شاركها ${inviterName}.`,
        'للاطلاع والحجز فقط، بدون صلاحيات إدارة.',
      ],
    },
  };

  return byLanguage[language][invitedRole] || [];
}

export function buildInvitationEmailCopy(params: {
  language: InvitationEmailLanguage;
  appName: string;
  inviterName: string;
  inviterRole: AppRole;
  invitedRole: AppRole;
  expiresAt: Date;
}): InvitationEmailCopy {
  const { language, appName, inviterName, inviterRole, invitedRole, expiresAt } = params;
  const invitedRoleLabel = getLocalizedRoleLabel(invitedRole, language);
  const inviterRoleLabel = getLocalizedRoleLabel(inviterRole, language);
  const expiresAtFormatted = formatInvitationExpiry(expiresAt, language);

  const copyByLanguage: Record<InvitationEmailLanguage, InvitationEmailCopy> = {
    fr: {
      subject: `${inviterName} vous invite à rejoindre ${appName} comme ${invitedRoleLabel}`,
      reminderSubject: `Rappel — ${inviterName} vous attend sur ${appName} comme ${invitedRoleLabel}`,
      preheader: `Activez votre accès ${invitedRoleLabel} sur ${appName} avant l'expiration de l'invitation.`,
      title: 'Votre invitation est prête',
      intro: `${inviterName} vous a invité à rejoindre ${appName} avec le rôle ${invitedRoleLabel}.`,
      invitedByLabel: 'Invité par',
      inviterRoleLabel: 'Rôle de l’expéditeur',
      invitedAsLabel: 'Accès proposé',
      onboardingTitle: 'Finalisez votre onboarding',
      onboardingDescription: 'Créez votre compte ou connectez-vous avec cette invitation pour activer immédiatement votre accès.',
      onboardingStepsTitle: 'Étapes recommandées',
      onboardingSteps: [
        'Ouvrez le lien sécurisé ci-dessous depuis cet email.',
        'Créez votre compte ou connectez-vous avec la même adresse email.',
        'Vérifiez les informations de votre rôle avant de terminer l’activation.',
      ],
      accessTitle: 'Ce que cet accès vous permettra de faire',
      expirationText: `Cette invitation expire le ${expiresAtFormatted}.`,
      customMessageLabel: 'Message personnel',
      actionLabel: ACTION_LABELS.fr[invitedRole],
      actionHint: 'Le bouton ci-dessous vous redirige vers votre parcours d’onboarding sécurisé.',
      fallbackText: 'Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :',
      securityTitle: 'Bonnes pratiques',
      securityItems: [
        'Utilisez la même adresse email que celle qui a reçu cette invitation.',
        'N’acceptez cette invitation que si vous reconnaissez l’expéditeur et le rôle proposé.',
      ],
      contactLabel: 'Contact de destination',
      recipientLabel: 'Destinataire',
      invitationTypeLabel: 'Type d’invitation',
    },
    en: {
      subject: `${inviterName} invited you to join ${appName} as ${invitedRoleLabel}`,
      reminderSubject: `Reminder — ${inviterName} invited you to join ${appName} as ${invitedRoleLabel}`,
      preheader: `Activate your ${invitedRoleLabel} access on ${appName} before the invitation expires.`,
      title: 'Your invitation is ready',
      intro: `${inviterName} invited you to join ${appName} with ${invitedRoleLabel} access.`,
      invitedByLabel: 'Invited by',
      inviterRoleLabel: 'Sender role',
      invitedAsLabel: 'Access offered',
      onboardingTitle: 'Complete your onboarding',
      onboardingDescription: 'Create your account or sign in with this invitation to activate your access right away.',
      onboardingStepsTitle: 'Recommended steps',
      onboardingSteps: [
        'Open the secure link below from this email.',
        'Create your account or sign in with the same email address.',
        'Review your assigned role details before completing activation.',
      ],
      accessTitle: 'What this access lets you do',
      expirationText: `This invitation expires on ${expiresAtFormatted}.`,
      customMessageLabel: 'Personal message',
      actionLabel: ACTION_LABELS.en[invitedRole],
      actionHint: 'The button below sends you to your secure onboarding flow.',
      fallbackText: 'If the button does not work, copy this link into your browser:',
      securityTitle: 'Best practices',
      securityItems: [
        'Use the same email address that received this invitation.',
        'Only accept the invitation if you recognize the sender and the role offered.',
      ],
      contactLabel: 'Delivery contact',
      recipientLabel: 'Recipient',
      invitationTypeLabel: 'Invitation type',
    },
    ar: {
      subject: `${inviterName} يدعوك للانضمام إلى ${appName} بصلاحية ${invitedRoleLabel}`,
      reminderSubject: `تذكير — ${inviterName} يدعوك للانضمام إلى ${appName} بصلاحية ${invitedRoleLabel}`,
      preheader: `فعّل صلاحية ${invitedRoleLabel} على ${appName} قبل انتهاء الدعوة.`,
      title: 'دعوتك جاهزة',
      intro: `${inviterName} دعاك للانضمام إلى ${appName} بصلاحية ${invitedRoleLabel}.`,
      invitedByLabel: 'تمت الدعوة بواسطة',
      inviterRoleLabel: 'دور المرسل',
      invitedAsLabel: 'الصلاحية المقترحة',
      onboardingTitle: 'أكمل عملية الانضمام',
      onboardingDescription: 'أنشئ حسابك أو سجّل الدخول عبر هذه الدعوة لتفعيل صلاحيتك مباشرة.',
      onboardingStepsTitle: 'الخطوات المقترحة',
      onboardingSteps: [
        'افتح الرابط الآمن أدناه من هذا البريد الإلكتروني.',
        'أنشئ حسابك أو سجّل الدخول باستخدام نفس البريد الإلكتروني.',
        'راجع تفاصيل الدور الممنوح لك قبل إتمام التفعيل.',
      ],
      accessTitle: 'ما الذي تتيحه لك هذه الصلاحية',
      expirationText: `تنتهي صلاحية هذه الدعوة في ${expiresAtFormatted}.`,
      customMessageLabel: 'رسالة شخصية',
      actionLabel: ACTION_LABELS.ar[invitedRole],
      actionHint: 'الزر أدناه ينقلك إلى مسار الانضمام الآمن الخاص بك.',
      fallbackText: 'إذا لم يعمل الزر، انسخ هذا الرابط وافتحه في المتصفح:',
      securityTitle: 'أفضل الممارسات',
      securityItems: [
        'استخدم نفس البريد الإلكتروني الذي استلم هذه الدعوة.',
        'لا تقبل الدعوة إلا إذا كنت تعرف المرسل وتفهم الصلاحية المقترحة.',
      ],
      contactLabel: 'جهة الاستلام',
      recipientLabel: 'المستلم',
      invitationTypeLabel: 'نوع الدعوة',
    },
  };

  return copyByLanguage[language];
}
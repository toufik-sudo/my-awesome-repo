/**
 * Client-side content filter for chat messages.
 * Acts as a first-pass validator before the backend AI/regex filter.
 * This does NOT replace backend filtering — it's a UX helper to warn users.
 */

// Phone number patterns (international + local Algerian formats)
const PHONE_PATTERNS = [
  /(?:\+?\d{1,4}[\s.-]?)?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{3,4}/g, // General international
  /0[5-7]\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/g, // Algerian mobile
  /\b\d{8,15}\b/g, // Raw digit sequences
];

// Email patterns
const EMAIL_PATTERNS = [
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  /[a-zA-Z0-9._%+-]+\s*[@＠]\s*[a-zA-Z0-9.-]+\s*[.．]\s*[a-zA-Z]{2,}/g, // Unicode @ variants
  /[a-zA-Z0-9._%+-]+\s*(?:at|chez)\s*[a-zA-Z0-9.-]+\s*(?:dot|point)\s*[a-zA-Z]{2,}/gi, // Spelled-out
];

// Social media / contact bypass patterns
const SOCIAL_PATTERNS = [
  /(?:facebook|fb|instagram|insta|ig|whatsapp|wa|telegram|tg|viber|snapchat|snap|tiktok|twitter|signal)[\s.:/@]*[a-zA-Z0-9._-]+/gi,
  /(?:add|follow|contact|reach|find|dm)\s+(?:me|us)\s+(?:on|at|via)\s+\w+/gi,
  /(?:mon|my|voici|envoie|envoyez|appelle|appelez|contactez)\s*(?:numéro|numero|tel|tél|telephone|téléphone|email|mail|whatsapp|wa)/gi,
];

// URL patterns
const URL_PATTERNS = [
  /https?:\/\/[^\s]+/g,
  /www\.[^\s]+/g,
  /[a-zA-Z0-9-]+\.(?:com|net|org|fr|dz|io|dev|co|me|info|biz|app)(?:\/[^\s]*)?/gi,
];

export interface FilterResult {
  isClean: boolean;
  warnings: string[];
  sanitized: string;
}

export function filterMessageContent(content: string): FilterResult {
  const warnings: string[] = [];
  let sanitized = content;

  // Check phone numbers
  for (const pattern of PHONE_PATTERNS) {
    if (pattern.test(content)) {
      warnings.push('phone_detected');
      break;
    }
    pattern.lastIndex = 0; // Reset regex state
  }

  // Check emails
  for (const pattern of EMAIL_PATTERNS) {
    if (pattern.test(content)) {
      warnings.push('email_detected');
      break;
    }
    pattern.lastIndex = 0;
  }

  // Check social media references
  for (const pattern of SOCIAL_PATTERNS) {
    if (pattern.test(content)) {
      warnings.push('social_detected');
      break;
    }
    pattern.lastIndex = 0;
  }

  // Check URLs
  for (const pattern of URL_PATTERNS) {
    if (pattern.test(content)) {
      warnings.push('url_detected');
      break;
    }
    pattern.lastIndex = 0;
  }

  return {
    isClean: warnings.length === 0,
    warnings,
    sanitized,
  };
}

export function getFilterWarningMessage(warnings: string[], t: (key: string) => string): string {
  const messages: string[] = [];
  if (warnings.includes('phone_detected')) messages.push(t('chat.filter.phone') || 'Phone numbers are not allowed');
  if (warnings.includes('email_detected')) messages.push(t('chat.filter.email') || 'Email addresses are not allowed');
  if (warnings.includes('social_detected')) messages.push(t('chat.filter.social') || 'Social media handles are not allowed');
  if (warnings.includes('url_detected')) messages.push(t('chat.filter.url') || 'External links are not allowed');
  return messages.join('. ') + '.';
}

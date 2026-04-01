export class SendGridWebhookEventDto {
  event: string;
  email: string;
  timestamp?: number;
  sg_message_id?: string;
  url?: string;
  useragent?: string;
  ip?: string;
  category?: string[];
  asm_group_id?: number;
  reason?: string;
  status?: string;
  response?: string;
  type?: string;
  [key: string]: any;
}

export class TrackingPixelQueryDto {
  mid: string; // messageId
  r: string;   // recipientEmail (base64)
}

export class LinkClickQueryDto {
  tid: string; // trackingId
}

export class JsVerifyDto {
  mid: string;
  r: string;
  t: number; // timestamp (for timing check)
}

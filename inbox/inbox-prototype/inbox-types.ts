/**
 * Smart category assigned to an email by the AI classifier.
 */
export type EmailCategory = 'urgent' | 'work' | 'bills' | 'shopping' | 'family' | 'marketing';

/**
 * Triage bucket used by the inbox summary.
 */
export type TriageBucket = 'urgent' | 'needsReply' | 'fyi' | 'promotions';

/**
 * A single email as processed by the AI inbox assistant.
 */
export type InboxEmail = {
  /** Stable identifier. */
  id: string;
  /** Display name of the sender. */
  sender: string;
  /** Sender email address. */
  senderEmail: string;
  /** Email subject line. */
  subject: string;
  /** Short AI-generated summary of the email body. */
  summary: string;
  /** Plain-text body preview. */
  body: string;
  /** Smart category. */
  category: EmailCategory;
  /** Importance score from 1 to 10. */
  importance: number;
  /** Whether the email is awaiting a reply. */
  needsReply: boolean;
  /** Triage bucket for the dashboard counters. */
  bucket: TriageBucket;
  /** Human readable received time. */
  receivedAt: string;
  /** Whether the email has been read. */
  read: boolean;
};

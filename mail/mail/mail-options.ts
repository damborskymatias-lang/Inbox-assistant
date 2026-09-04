import type { EmailCategory, TriageBucket } from '@lov/mail.entities.email';

export type { EmailCategory, TriageBucket };

/**
 * filters applied when listing emails of the signed in user.
 */
export type ListEmailsOptions = {
  /**
   * only return emails of the given triage bucket.
   */
  bucket?: TriageBucket;

  /**
   * only return emails of the given smart category.
   */
  category?: EmailCategory;

  /**
   * free text search across sender, subject, summary and body.
   */
  search?: string;

  /**
   * only return emails which were not read yet.
   */
  unreadOnly?: boolean;

  /**
   * maximum amount of emails to return.
   */
  limit?: number;

  /**
   * amount of emails to skip, used for pagination.
   */
  offset?: number;
};

/**
 * amount of emails per triage bucket, used by the inbox summary tiles.
 */
export type TriageCounts = {
  /**
   * emails which require immediate attention.
   */
  urgent: number;

  /**
   * emails awaiting a reply.
   */
  needsReply: number;

  /**
   * emails which are informational only.
   */
  fyi: number;

  /**
   * promotional emails and newsletters.
   */
  promotions: number;

  /**
   * total amount of active emails.
   */
  total: number;
};

/**
 * result of a mailbox sync.
 */
export type SyncEmailsResult = {
  /**
   * amount of new messages pulled into the store.
   */
  synced: number;
};

/**
 * result of a bulk email action such as archive or delete.
 */
export type EmailActionResult = {
  /**
   * amount of emails affected by the action.
   */
  affected: number;
};

/**
 * AI analysis applied to a stored email by the assistant aspect.
 */
export type EmailAnalysis = {
  /**
   * short summary of the email content.
   */
  summary?: string;

  /**
   * smart category assigned to the email.
   */
  category?: EmailCategory;

  /**
   * importance score from 1 (low) to 10 (critical).
   */
  importance?: number;

  /**
   * whether the email is awaiting a reply.
   */
  needsReply?: boolean;

  /**
   * a suggested reply drafted for the email.
   */
  suggestedReply?: string;
};

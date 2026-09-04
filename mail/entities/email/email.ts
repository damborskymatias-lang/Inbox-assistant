/**
 * Smart category assigned to an email by the AI classifier.
 */
export type EmailCategory = 'urgent' | 'work' | 'bills' | 'shopping' | 'family' | 'marketing';

/**
 * Triage bucket used by the inbox summary.
 */
export type TriageBucket = 'urgent' | 'needsReply' | 'fyi' | 'promotions';

/**
 * plain representation of an Email, safe for
 * serialization across the network.
 */
export type PlainEmail = {
  /**
   * unique identifier of the email.
   */
  id: string;

  /**
   * id of the message on the Gmail account.
   */
  gmailId: string;

  /**
   * id of the Gmail thread the message belongs to.
   */
  threadId?: string;

  /**
   * display name of the sender.
   */
  sender: string;

  /**
   * email address of the sender.
   */
  senderEmail: string;

  /**
   * subject line of the email.
   */
  subject: string;

  /**
   * full plain-text body of the email.
   */
  body: string;

  /**
   * short preview snippet of the body.
   */
  snippet: string;

  /**
   * AI generated summary of the email.
   */
  summary?: string;

  /**
   * smart category assigned by the AI classifier.
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
   * whether a reply has already been generated for this email.
   */
  replyGenerated?: boolean;

  /**
   * triage bucket used by the inbox dashboard.
   */
  bucket: TriageBucket;

  /**
   * ISO timestamp of when the email was received.
   */
  receivedAt: string;

  /**
   * whether the email has been read.
   */
  read: boolean;

  /**
   * whether the email has been archived.
   */
  archived: boolean;
};

/**
 * computes the triage bucket for an email from its
 * importance, needsReply flag and category.
 */
export function deriveBucket(options: {
  importance?: number;
  needsReply?: boolean;
  category?: EmailCategory;
}): TriageBucket {
  const { importance = 0, needsReply = false, category } = options || {};

  if (category === 'marketing') {
    return 'promotions';
  }

  if (importance >= 8) {
    return 'urgent';
  }

  if (needsReply) {
    return 'needsReply';
  }

  return 'fyi';
}

/**
 * an Email entity represents a single message synced
 * from a connected mailbox, enriched with AI triage data.
 */
export class Email {
  constructor(
    /**
     * unique identifier of the email.
     */
    readonly id: string,

    /**
     * id of the message on the Gmail account.
     */
    readonly gmailId: string,

    /**
     * display name of the sender.
     */
    readonly sender: string,

    /**
     * email address of the sender.
     */
    readonly senderEmail: string,

    /**
     * subject line of the email.
     */
    readonly subject: string,

    /**
     * full plain-text body of the email.
     */
    readonly body: string,

    /**
     * short preview snippet of the body.
     */
    readonly snippet: string,

    /**
     * triage bucket used by the inbox dashboard.
     */
    readonly bucket: TriageBucket,

    /**
     * ISO timestamp of when the email was received.
     */
    readonly receivedAt: string,

    /**
     * whether the email has been read.
     */
    readonly read: boolean = false,

    /**
     * whether the email has been archived.
     */
    readonly archived: boolean = false,

    /**
     * id of the Gmail thread the message belongs to.
     */
    readonly threadId?: string,

    /**
     * AI generated summary of the email.
     */
    readonly summary?: string,

    /**
     * smart category assigned by the AI classifier.
     */
    readonly category?: EmailCategory,

    /**
     * importance score from 1 (low) to 10 (critical).
     */
    readonly importance?: number,

    /**
     * whether the email is awaiting a reply.
     */
    readonly needsReply?: boolean,

    /**
     * whether a reply has already been generated for this email.
     */
    readonly replyGenerated?: boolean
  ) {}

  /**
   * serialize an Email into a plain,
   * network-safe object.
   */
  toObject(): PlainEmail {
    return {
      id: this.id,
      gmailId: this.gmailId,
      threadId: this.threadId,
      sender: this.sender,
      senderEmail: this.senderEmail,
      subject: this.subject,
      body: this.body,
      snippet: this.snippet,
      summary: this.summary,
      category: this.category,
      importance: this.importance,
      needsReply: this.needsReply,
      replyGenerated: this.replyGenerated,
      bucket: this.bucket,
      receivedAt: this.receivedAt,
      read: this.read,
      archived: this.archived,
    };
  }

  /**
   * create an Email instance from a plain object,
   * deriving the bucket when not provided.
   */
  static from(plainEmail: Partial<PlainEmail> & { gmailId: string; sender: string; senderEmail: string; subject: string }): Email {
    const {
      id,
      gmailId,
      threadId,
      sender,
      senderEmail,
      subject,
      body = '',
      snippet = '',
      summary,
      category,
      importance,
      needsReply = false,
      replyGenerated = false,
      bucket,
      receivedAt = new Date().toISOString(),
      read = false,
      archived = false,
    } = plainEmail;

    return new Email(
      id || gmailId,
      gmailId,
      sender,
      senderEmail,
      subject,
      body,
      snippet,
      bucket || deriveBucket({ importance, needsReply, category }),
      receivedAt,
      read,
      archived,
      threadId,
      summary,
      category,
      importance,
      needsReply,
      replyGenerated
    );
  }
}

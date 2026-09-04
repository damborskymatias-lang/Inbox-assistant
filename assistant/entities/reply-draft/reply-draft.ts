/**
 * Tone used when drafting an AI reply.
 */
export type ReplyTone = 'friendly' | 'formal' | 'concise' | 'warm';

/**
 * Length preference for AI generated replies.
 */
export type ReplyLength = 'short' | 'medium' | 'long';

/**
 * Plain, serializable representation of a WritingStyle.
 */
export type PlainWritingStyle = {
  /**
   * preferred tone for generated replies.
   */
  tone: ReplyTone;

  /**
   * preferred length for generated replies.
   */
  length: ReplyLength;

  /**
   * sign-off used at the end of generated replies.
   */
  signOff: string;
};

/**
 * default writing style applied when a user has not customized their preferences.
 */
export const DEFAULT_WRITING_STYLE: PlainWritingStyle = {
  tone: 'friendly',
  length: 'medium',
  signOff: 'Best,\nPeter',
};

/**
 * WritingStyle captures a user's preferred tone, length and sign-off,
 * used by the assistant to personalize generated replies.
 */
export class WritingStyle {
  constructor(
    /**
     * preferred tone for generated replies.
     */
    readonly tone: ReplyTone,

    /**
     * preferred length for generated replies.
     */
    readonly length: ReplyLength,

    /**
     * sign-off used at the end of generated replies.
     */
    readonly signOff: string
  ) {}

  /**
   * serialize the WritingStyle into a plain object.
   */
  toObject(): PlainWritingStyle {
    return {
      tone: this.tone,
      length: this.length,
      signOff: this.signOff,
    };
  }

  /**
   * create a WritingStyle instance from a plain object, falling back
   * to the default writing style for any missing property.
   */
  static from(plainWritingStyle: Partial<PlainWritingStyle>): WritingStyle {
    const {
      tone = DEFAULT_WRITING_STYLE.tone,
      length = DEFAULT_WRITING_STYLE.length,
      signOff = DEFAULT_WRITING_STYLE.signOff,
    } = plainWritingStyle || {};

    return new WritingStyle(tone, length, signOff);
  }

  /**
   * the default writing style used before a user customizes their preferences.
   */
  static default(): WritingStyle {
    return WritingStyle.from(DEFAULT_WRITING_STYLE);
  }
}

/**
 * Plain, serializable representation of a ReplyDraft.
 */
export type PlainReplyDraft = {
  /**
   * unique identifier of the reply draft.
   */
  id: string;

  /**
   * id of the email this draft replies to.
   */
  emailId: string;

  /**
   * id of the user the draft was generated for.
   */
  userId: string;

  /**
   * body text of the generated reply.
   */
  body: string;

  /**
   * tone used when generating this reply.
   */
  tone: ReplyTone;

  /**
   * ISO timestamp of when the reply was generated.
   */
  generatedAt: string;

  /**
   * whether the reply has been sent.
   */
  sent: boolean;
};

/**
 * ReplyDraft entity for the AI inbox assistant.
 * Represents an AI generated reply to an email, editable by the user
 * before it is sent.
 */
export class ReplyDraft {
  constructor(
    /**
     * unique identifier of the reply draft.
     */
    readonly id: string,

    /**
     * id of the email this draft replies to.
     */
    readonly emailId: string,

    /**
     * id of the user the draft was generated for.
     */
    readonly userId: string,

    /**
     * body text of the generated reply.
     */
    readonly body: string,

    /**
     * tone used when generating this reply.
     */
    readonly tone: ReplyTone,

    /**
     * ISO timestamp of when the reply was generated.
     */
    readonly generatedAt: string,

    /**
     * whether the reply has been sent.
     */
    readonly sent: boolean = false
  ) {}

  /**
   * serialize the ReplyDraft into a plain object.
   */
  toObject(): PlainReplyDraft {
    return {
      id: this.id,
      emailId: this.emailId,
      userId: this.userId,
      body: this.body,
      tone: this.tone,
      generatedAt: this.generatedAt,
      sent: this.sent,
    };
  }

  /**
   * create a ReplyDraft instance from a plain object.
   */
  static from(plainReplyDraft: Partial<PlainReplyDraft>): ReplyDraft {
    const {
      id = '',
      emailId = '',
      userId = '',
      body = '',
      tone = DEFAULT_WRITING_STYLE.tone,
      generatedAt = new Date().toISOString(),
      sent = false,
    } = plainReplyDraft || {};

    return new ReplyDraft(id, emailId, userId, body, tone, generatedAt, sent);
  }
}

import type { EmailCategory } from '@lov/mail.mail';
import type { ReplyLength, ReplyTone } from '@lov/assistant.entities.reply-draft';

export type { EmailCategory, ReplyLength, ReplyTone };

/**
 * the structured analysis the assistant asks every AI provider to produce
 * for a single email.
 */
export type EmailAnalysis = {
  /**
   * one sentence summary of what the email is about.
   */
  summary: string;

  /**
   * smart category assigned to the email.
   */
  category: EmailCategory;

  /**
   * importance score from 1 (low) to 10 (critical).
   */
  importance: number;

  /**
   * whether the email is awaiting a reply.
   */
  needsReply: boolean;

  /**
   * a short reply drafted for the email, when one is needed.
   */
  suggestedReply?: string;
};

/**
 * the raw, unvalidated payload returned by an AI provider for an analysis
 * prompt. providers may answer in snake_case (as described by the JSON
 * schema) or in camelCase, both shapes are accepted.
 */
export type RawEmailAnalysis = {
  summary?: string;
  category?: string;
  importance?: number | string;
  needs_reply?: boolean;
  needsReply?: boolean;
  suggested_reply?: string;
  suggestedReply?: string;
};

/**
 * the raw payload returned by an AI provider for a reply prompt.
 */
export type RawReply = {
  body?: string;
};

/**
 * result of a full inbox analysis run.
 */
export type AnalyzeInboxResult = {
  /**
   * amount of emails analyzed during the run.
   */
  analyzed: number;
};

/**
 * options accepted when analyzing a single email.
 */
export type AnalyzeEmailOptions = {
  /**
   * id of the email to analyze.
   */
  emailId: string;
};

/**
 * options accepted when generating a reply draft.
 */
export type GenerateReplyOptions = {
  /**
   * id of the email the reply answers.
   */
  emailId: string;

  /**
   * free text instructions guiding the generated reply.
   */
  instructions?: string;
};

/**
 * options accepted when updating the writing style preferences. any
 * property left out keeps its previously saved value.
 */
export type UpdateWritingStyleOptions = {
  /**
   * preferred tone of generated replies.
   */
  tone?: ReplyTone;

  /**
   * preferred length of generated replies.
   */
  length?: ReplyLength;

  /**
   * sign-off appended to every generated reply.
   */
  signOff?: string;
};

/**
 * options accepted when registering an AI provider through the API.
 */
export type RegisterAiProviderOptions = {
  /**
   * unique name of the provider.
   */
  name: string;

  /**
   * kind of provider to register, currently only "mock" is supported at runtime.
   */
  providerType?: string;
};

/**
 * JSON schema of the structured analysis every AI provider must answer with.
 */
export const EMAIL_ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    summary: { type: 'string', description: 'one sentence summary of the email' },
    category: {
      type: 'string',
      enum: ['urgent', 'work', 'bills', 'shopping', 'family', 'marketing'],
    },
    importance: { type: 'integer', minimum: 1, maximum: 10 },
    needs_reply: { type: 'boolean' },
    suggested_reply: { type: 'string' },
  },
  required: ['summary', 'category', 'importance', 'needs_reply'],
  additionalProperties: false,
};

/**
 * JSON schema of a generated reply body.
 */
export const REPLY_SCHEMA = {
  type: 'object',
  properties: {
    body: { type: 'string', description: 'the full body of the reply, sign-off included' },
  },
  required: ['body'],
  additionalProperties: false,
};

/**
 * every smart category an email may be classified into.
 */
export const EMAIL_CATEGORIES: EmailCategory[] = [
  'urgent',
  'work',
  'bills',
  'shopping',
  'family',
  'marketing',
];

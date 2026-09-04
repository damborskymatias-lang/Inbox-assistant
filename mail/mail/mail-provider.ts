import type { SlotRegistry } from '@bitdev/harmony.harmony';
import type { EmailCategory, TriageBucket } from '@lov/mail.entities.email';
import type { User } from '@lov/inbox-platform.entities.user';

/**
 * a raw message returned by a mail provider, before it is
 * persisted and enriched with AI triage data.
 */
export type RawMessage = {
  /**
   * id of the message on the provider account.
   */
  gmailId: string;

  /**
   * id of the thread the message belongs to.
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
   * subject line of the message.
   */
  subject: string;

  /**
   * full plain text body of the message.
   */
  body: string;

  /**
   * short preview snippet of the body.
   */
  snippet: string;

  /**
   * summary of the message, when the provider already has one.
   */
  summary?: string;

  /**
   * smart category of the message, when the provider already has one.
   */
  category?: EmailCategory;

  /**
   * importance score from 1 (low) to 10 (critical).
   */
  importance?: number;

  /**
   * whether the message is awaiting a reply.
   */
  needsReply?: boolean;

  /**
   * triage bucket of the message. derived when omitted.
   */
  bucket?: TriageBucket;

  /**
   * ISO timestamp of when the message was received.
   */
  receivedAt?: string;

  /**
   * whether the message was already read.
   */
  read?: boolean;

  /**
   * whether the message is archived on the provider.
   */
  archived?: boolean;
};

/**
 * a mail provider plugged into the mail aspect, responsible for talking
 * to an actual mailbox such as Gmail on behalf of a user.
 */
export type MailProvider = {
  /**
   * unique name of the provider, for example "gmail" or "mock".
   */
  name: string;

  /**
   * ordering weight, lower values are preferred when selecting a provider.
   */
  weight?: number;

  /**
   * whether the provider can currently act on behalf of the given user.
   * when omitted the provider is always considered available.
   */
  isAvailable?: (user?: User) => Promise<boolean>;

  /**
   * fetch raw messages of a user, optionally only those received
   * after the given ISO timestamp.
   */
  fetchMessages: (user: User, since?: string) => Promise<RawMessage[]>;

  /**
   * archive messages by their provider ids.
   */
  archive: (user: User, ids: string[]) => Promise<void>;

  /**
   * move messages to trash by their provider ids.
   */
  remove: (user: User, ids: string[]) => Promise<void>;

  /**
   * send a message on behalf of the user, optionally within a thread.
   */
  send: (user: User, to: string, subject: string, body: string, threadId?: string) => Promise<void>;
};

export type MailProviderSlot = SlotRegistry<MailProvider[]>;

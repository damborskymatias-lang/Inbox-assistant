import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import {
  InboxPlatformAspect,
  type InboxPlatformNode,
} from '@lov/inbox-platform.inbox-platform';
import { NotFound } from '@bitdev/symphony.exceptions.not-found';
import { Email, deriveBucket, type EmailCategory, type TriageBucket } from '@lov/mail.entities.email';
import type { User } from '@lov/inbox-platform.entities.user';
import type { MailConfig } from './mail-config.js';
import type { MailProvider, MailProviderSlot, RawMessage } from './mail-provider.js';
import { mailGqlSchema } from './mail.graphql.js';
import { EmailModel, emailModelMock } from './mail.model.js';
import { MailRepository } from './mail-repository.js';
import { createGmailProvider } from './gmail-provider.js';
import { createMockProvider } from './mock-provider.js';
import type {
  ListEmailsOptions,
  TriageCounts,
  EmailAnalysis,
  SyncEmailsResult,
  EmailActionResult,
} from './mail-options.js';

export class MailNode {
  constructor(
    private mailConfig: MailConfig,
    private mailProviderSlot: MailProviderSlot,
    private mailRepository: MailRepository
  ) {}

  /**
   * register mail providers such as Gmail or a custom mailbox integration.
   */
  registerMailProvider(mailProviders: MailProvider[]) {
    this.mailProviderSlot.register(mailProviders);
    return this;
  }

  /**
   * list all registered mail providers, ordered by weight.
   */
  listMailProviders(): MailProvider[] {
    return [...this.mailProviderSlot.flatValues()].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
  }

  /**
   * resolve the provider acting on behalf of the given user. the preferred
   * provider wins when available, otherwise the first available one is used.
   */
  async getActiveProvider(user?: User): Promise<MailProvider | undefined> {
    const providers = this.listMailProviders();
    const preferredName = this.mailConfig.preferredProvider;
    const preferred = providers.find((provider) => provider.name === preferredName);
    const ordered = preferred ? [preferred, ...providers.filter((p) => p !== preferred)] : providers;

    const availability = await Promise.all(
      ordered.map((provider) => (provider.isAvailable ? provider.isAvailable(user) : Promise.resolve(true)))
    );

    return ordered.find((_provider, index) => availability[index]);
  }

  /**
   * list the synced emails of the signed in user, filtered by bucket,
   * category, search text and pagination.
   */
  async listEmails(options?: ListEmailsOptions): Promise<Email[]> {
    const docs = await this.mailRepository.listEmails(options);
    return docs.map((doc) => toEmail(doc));
  }

  /**
   * get a single email by id, including its full body.
   */
  async getEmail(id: string): Promise<Email | undefined> {
    const doc = await this.mailRepository.getEmail(id);
    if (!doc) return undefined;
    const read = doc.read ? doc : (await this.mailRepository.markRead(id)) || doc;
    return toEmail(read);
  }

  /**
   * count the active emails of every triage bucket, used by the summary tiles.
   */
  async getTriageCounts(): Promise<TriageCounts> {
    return this.mailRepository.getTriageCounts();
  }

  /**
   * pull new messages from the active provider into the store and
   * return how many messages were synced.
   */
  async syncEmails(user?: User): Promise<SyncEmailsResult> {
    const provider = await this.getActiveProvider(user);
    if (!provider || !user) return { synced: 0 };

    const messages = await provider.fetchMessages(user, undefined);
    const limit = this.mailConfig.maxMessagesPerSync ?? messages.length;

    const upserts = messages.slice(0, limit).map((message) => {
      return this.mailRepository.upsertEmail(toEmailModel(message));
    });

    const synced = await Promise.all(upserts);
    return { synced: synced.length };
  }

  /**
   * archive emails through the active provider and update the store.
   */
  async archiveEmails(ids: string[], user?: User): Promise<EmailActionResult> {
    const provider = await this.getActiveProvider(user);
    const gmailIds = await this.toProviderIds(ids);

    if (provider && user && gmailIds.length) {
      await provider.archive(user, gmailIds);
    }

    const affected = await this.mailRepository.archiveEmails(ids);
    return { affected };
  }

  /**
   * move emails to trash through the active provider and remove them from the store.
   */
  async deleteEmails(ids: string[], user?: User): Promise<EmailActionResult> {
    const provider = await this.getActiveProvider(user);
    const gmailIds = await this.toProviderIds(ids);

    if (provider && user && gmailIds.length) {
      await provider.remove(user, gmailIds);
    }

    const affected = await this.mailRepository.deleteEmails(ids);
    return { affected };
  }

  /**
   * send a reply to an email through the active provider and mark the thread as replied.
   */
  async sendReply(emailId: string, body: string, user?: User): Promise<Email> {
    const doc = await this.mailRepository.getEmail(emailId);
    if (!doc) throw new NotFound();

    const provider = await this.getActiveProvider(user);
    if (provider && user) {
      await provider.send(user, doc.senderEmail, `Re: ${doc.subject}`, body, doc.threadId);
    }

    const updated = await this.mailRepository.markReplied(emailId);
    if (!updated) throw new NotFound();
    return toEmail(updated);
  }

  /**
   * apply AI analysis produced by the assistant aspect to a stored email,
   * recomputing its triage bucket.
   */
  async applyAnalysis(emailId: string, analysis: EmailAnalysis): Promise<Email> {
    const doc = await this.mailRepository.getEmail(emailId);
    if (!doc) throw new NotFound();

    const bucket = deriveBucket({
      importance: analysis.importance ?? doc.importance,
      needsReply: analysis.needsReply ?? doc.needsReply,
      category: (analysis.category ?? doc.category) as EmailCategory | undefined,
    });

    const updated = await this.mailRepository.applyAnalysis(emailId, analysis, bucket);
    if (!updated) throw new NotFound();
    return toEmail(updated);
  }

  /**
   * map internal email ids to the ids used by the mail provider.
   */
  private async toProviderIds(ids: string[]): Promise<string[]> {
    const docs = await Promise.all(ids.map((id) => this.mailRepository.getEmail(id)));
    return docs.filter((doc): doc is EmailModel => Boolean(doc)).map((doc) => doc.gmailId);
  }

  static dependencies = [SymphonyPlatformAspect, InboxPlatformAspect];

  static defaultConfig: MailConfig = {
    maxMessagesPerSync: 25,
    preferredProvider: 'gmail',
  };

  static async provider(
    [symphonyPlatform, inboxPlatform]: [SymphonyPlatformNode, InboxPlatformNode],
    config: MailConfig,
    [mailProviderSlot]: [MailProviderSlot]
  ) {
    const emailModel = getModelForClass(EmailModel);
    const mailRepository = new MailRepository(emailModel);
    const mail = new MailNode(config, mailProviderSlot, mailRepository);

    /**
     * register the two built-in providers. gmail acts on the user's real mailbox
     * using the tokens stored by the platform, and the mock provider serves the
     * demo account and every case where gmail is not connected.
     */
    mail.registerMailProvider([
      createGmailProvider(inboxPlatform, config.maxMessagesPerSync ?? 25),
      createMockProvider(),
    ]);

    /**
     * seed the demo inbox so a fresh database already shows a realistic mailbox.
     */
    symphonyPlatform.registerOnStart(async () => {
      const hasEmails = await mailRepository.hasEmails();
      if (hasEmails) return undefined;
      await mailRepository.insertEmails(emailModelMock);
      return undefined;
    });

    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: mailGqlSchema(mail),
      },
    ]);

    return mail;
  }
}

/**
 * map a persisted email document to the Email entity.
 */
function toEmail(doc: EmailModel): Email {
  return Email.from({
    id: doc.id,
    gmailId: doc.gmailId,
    threadId: doc.threadId,
    sender: doc.sender,
    senderEmail: doc.senderEmail,
    subject: doc.subject,
    body: doc.body,
    snippet: doc.snippet,
    summary: doc.summary,
    category: doc.category as EmailCategory | undefined,
    importance: doc.importance,
    needsReply: doc.needsReply,
    replyGenerated: doc.replyGenerated,
    bucket: doc.bucket as TriageBucket,
    receivedAt: doc.receivedAt,
    read: doc.read,
    archived: doc.archived,
  });
}

/**
 * map a raw provider message to a persisted email document.
 */
function toEmailModel(message: RawMessage): EmailModel {
  const bucket =
    message.bucket ||
    deriveBucket({
      importance: message.importance,
      needsReply: message.needsReply,
      category: message.category,
    });

  return {
    id: message.gmailId,
    gmailId: message.gmailId,
    threadId: message.threadId,
    sender: message.sender,
    senderEmail: message.senderEmail,
    subject: message.subject,
    body: message.body,
    snippet: message.snippet,
    summary: message.summary,
    category: message.category,
    importance: message.importance,
    needsReply: message.needsReply ?? false,
    replyGenerated: false,
    bucket,
    receivedAt: message.receivedAt || new Date().toISOString(),
    read: message.read ?? false,
    archived: message.archived ?? false,
  };
}

export default MailNode;

import type { ReturnModelType } from '@typegoose/typegoose';
import { EmailModel } from './mail.model.js';
import type { ListEmailsOptions, EmailAnalysis, TriageCounts } from './mail-options.js';

/**
 * loose mongo query shape, avoiding a direct dependency on mongoose's
 * exported type surface (which differs across resolved versions).
 */
type FilterQuery<T> = Partial<T> & Record<string, unknown>;

/**
 * data access layer of the mail aspect, encapsulating
 * every mongodb operation on the email collection.
 */
export class MailRepository {
  constructor(private emailModel: ReturnModelType<typeof EmailModel>) {}

  /**
   * list active emails matching the given filters, newest first.
   */
  async listEmails(options?: ListEmailsOptions): Promise<EmailModel[]> {
    const query: FilterQuery<EmailModel> = { archived: false };

    if (options?.bucket) query.bucket = options.bucket;
    if (options?.category) query.category = options.category;
    if (options?.unreadOnly) query.read = false;

    if (options?.search) {
      const searchRegex = new RegExp(escapeRegExp(options.search), 'i');
      query.$or = [
        { subject: searchRegex },
        { sender: searchRegex },
        { senderEmail: searchRegex },
        { snippet: searchRegex },
        { summary: searchRegex },
        { body: searchRegex },
      ];
    }

    let cursor = this.emailModel.find(query).sort({ receivedAt: -1 });
    if (options?.offset) cursor = cursor.skip(options.offset);
    if (options?.limit) cursor = cursor.limit(options.limit);

    const docs = await cursor.exec();
    return docs.map((doc) => doc.toObject());
  }

  /**
   * get a single email by its unique id.
   */
  async getEmail(id: string): Promise<EmailModel | undefined> {
    const doc = await this.emailModel.findOne({ id });
    if (!doc) return undefined;
    return doc.toObject();
  }

  /**
   * count the active emails of every triage bucket.
   */
  async getTriageCounts(): Promise<TriageCounts> {
    const docs = await this.emailModel.find({ archived: false }).exec();

    return docs.reduce<TriageCounts>(
      (counts, doc) => {
        const next = { ...counts, total: counts.total + 1 };
        if (doc.bucket === 'urgent') next.urgent += 1;
        if (doc.bucket === 'needsReply') next.needsReply += 1;
        if (doc.bucket === 'fyi') next.fyi += 1;
        if (doc.bucket === 'promotions') next.promotions += 1;
        return next;
      },
      { urgent: 0, needsReply: 0, fyi: 0, promotions: 0, total: 0 }
    );
  }

  /**
   * mark emails as archived by their ids.
   */
  async archiveEmails(ids: string[]): Promise<number> {
    if (!ids.length) return 0;
    const res = await this.emailModel.updateMany(
      { id: { $in: ids } },
      { $set: { archived: true } }
    );
    return res.modifiedCount ?? 0;
  }

  /**
   * permanently remove emails by their ids.
   */
  async deleteEmails(ids: string[]): Promise<number> {
    if (!ids.length) return 0;
    const res = await this.emailModel.deleteMany({ id: { $in: ids } });
    return res.deletedCount ?? 0;
  }

  /**
   * mark an email as read.
   */
  async markRead(id: string): Promise<EmailModel | undefined> {
    const doc = await this.emailModel.findOneAndUpdate({ id }, { $set: { read: true } }, { new: true });
    if (!doc) return undefined;
    return doc.toObject();
  }

  /**
   * mark an email as replied once a reply was sent.
   */
  async markReplied(id: string): Promise<EmailModel | undefined> {
    const doc = await this.emailModel.findOneAndUpdate(
      { id },
      { $set: { replyGenerated: true, read: true } },
      { new: true }
    );
    if (!doc) return undefined;
    return doc.toObject();
  }

  /**
   * apply AI analysis fields to a stored email.
   */
  async applyAnalysis(id: string, analysis: EmailAnalysis, bucket?: string): Promise<EmailModel | undefined> {
    const update: Partial<EmailModel> = {};
    if (analysis.summary !== undefined) update.summary = analysis.summary;
    if (analysis.category !== undefined) update.category = analysis.category;
    if (analysis.importance !== undefined) update.importance = analysis.importance;
    if (analysis.needsReply !== undefined) update.needsReply = analysis.needsReply;
    if (bucket) update.bucket = bucket;

    const doc = await this.emailModel.findOneAndUpdate({ id }, { $set: update }, { new: true });
    if (!doc) return undefined;
    return doc.toObject();
  }

  /**
   * whether the store already holds at least one email.
   */
  async hasEmails(): Promise<boolean> {
    const docs = await this.emailModel.find().limit(1);
    return Boolean(docs.length);
  }

  /**
   * insert many emails at once, used to seed the demo inbox.
   */
  async insertEmails(emails: EmailModel[]): Promise<number> {
    if (!emails.length) return 0;
    const docs = await this.emailModel.insertMany(emails);
    return docs.length;
  }

  /**
   * find an email by the id it has on the provider account.
   */
  async findByGmailId(gmailId: string): Promise<EmailModel | undefined> {
    const doc = await this.emailModel.findOne({ gmailId });
    if (!doc) return undefined;
    return doc.toObject();
  }

  /**
   * create an email, or update it when it was already synced.
   */
  async upsertEmail(email: EmailModel): Promise<EmailModel> {
    const doc = await this.emailModel.findOneAndUpdate(
      { gmailId: email.gmailId },
      { $set: email },
      { upsert: true, new: true }
    );
    return doc.toObject();
  }
}

/**
 * escape user provided search input before using it in a regular expression.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

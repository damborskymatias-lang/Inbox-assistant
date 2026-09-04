import type { ReturnModelType } from '@typegoose/typegoose';
import type { SuggestedAction } from '@lov/assistant.entities.daily-summary';
import { DailySummaryModel } from './daily-summary.model.js';
import { ReplyDraftModel, WritingStyleModel } from './reply-draft.model.js';

/**
 * the fields persisted when caching a generated daily summary.
 */
export type DailySummaryData = {
  id: string;
  userId: string;
  date: string;
  totalNew: number;
  greeting: string;
  highlights: string[];
  suggestedActions: SuggestedAction[];
};

/**
 * the fields persisted when storing a generated reply draft.
 */
export type ReplyDraftData = {
  id: string;
  emailId: string;
  userId: string;
  body: string;
  tone: string;
  generatedAt: string;
  sent: boolean;
};

/**
 * the writing style fields a user may update.
 */
export type WritingStyleData = {
  tone: string;
  length: string;
  signOff: string;
};

/**
 * data access layer of the assistant aspect, encapsulating every mongodb
 * operation on the daily summary, reply draft and writing style collections.
 */
export class AssistantRepository {
  constructor(
    private dailySummaryModel: ReturnModelType<typeof DailySummaryModel>,
    private replyDraftModel: ReturnModelType<typeof ReplyDraftModel>,
    private writingStyleModel: ReturnModelType<typeof WritingStyleModel>
  ) {}

  /**
   * read the cached daily summary of a user for a given day, if it was
   * already generated.
   */
  async findDailySummary(userId: string, date: string): Promise<DailySummaryModel | undefined> {
    const doc = await this.dailySummaryModel.findOne({ userId, date });
    if (!doc) return undefined;
    return doc.toObject();
  }

  /**
   * cache the daily summary of a user for a given day, replacing a previously
   * cached one so a regeneration always wins.
   */
  async saveDailySummary(summary: DailySummaryData): Promise<DailySummaryModel> {
    const doc = await this.dailySummaryModel.findOneAndUpdate(
      { userId: summary.userId, date: summary.date },
      { $set: summary },
      { upsert: true, new: true }
    );

    return doc.toObject();
  }

  /**
   * remove the cached daily summary of a user for a given day.
   */
  async clearDailySummary(userId: string, date: string): Promise<void> {
    await this.dailySummaryModel.deleteOne({ userId, date });
  }

  /**
   * persist a generated reply draft.
   */
  async createReplyDraft(draft: ReplyDraftData): Promise<ReplyDraftModel> {
    const doc = await this.replyDraftModel.create(draft);
    return doc.toObject();
  }

  /**
   * count the reply drafts a user generated since the given timestamp, used
   * to enforce the generation quota of their plan.
   */
  async countReplyDraftsSince(userId: string, since: string): Promise<number> {
    return this.replyDraftModel.countDocuments({ userId, generatedAt: { $gte: since } });
  }

  /**
   * the most recently generated draft for an email, if any.
   */
  async findLatestReplyDraft(userId: string, emailId: string): Promise<ReplyDraftModel | undefined> {
    const doc = await this.replyDraftModel.findOne({ userId, emailId }).sort({ generatedAt: -1 });
    if (!doc) return undefined;
    return doc.toObject();
  }

  /**
   * read the writing style preferences of a user, if they were customized.
   */
  async findWritingStyle(userId: string): Promise<WritingStyleModel | undefined> {
    const doc = await this.writingStyleModel.findOne({ userId });
    if (!doc) return undefined;
    return doc.toObject();
  }

  /**
   * create or update the writing style preferences of a user.
   */
  async saveWritingStyle(userId: string, style: WritingStyleData): Promise<WritingStyleModel> {
    const doc = await this.writingStyleModel.findOneAndUpdate(
      { userId },
      { $set: { userId, ...style } },
      { upsert: true, new: true }
    );

    return doc.toObject();
  }

  /**
   * whether the store already holds writing style preferences.
   */
  async hasWritingStyles(): Promise<boolean> {
    const docs = await this.writingStyleModel.find().limit(1);
    return Boolean(docs.length);
  }

  /**
   * insert writing style preferences at once, used to seed the demo account.
   */
  async insertWritingStyles(styles: Array<WritingStyleData & { userId: string }>): Promise<number> {
    if (!styles.length) return 0;
    const docs = await this.writingStyleModel.insertMany(styles);
    return docs.length;
  }
}

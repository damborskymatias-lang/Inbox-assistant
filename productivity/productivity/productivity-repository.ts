import type { ReturnModelType } from '@typegoose/typegoose';
import { DailyDigestModel } from './daily-digest.model.js';
import {
  DigestPreferencesModel,
  DEFAULT_DIGEST_CHANNEL,
  DEFAULT_DIGEST_TIME_OF_DAY,
} from './digest-preferences.model.js';
import type { SeedDigestDocument } from './digest-seed.js';
import type { DigestIncrements, UpdateNotificationPreferencesOptions } from './productivity-types.js';

export class ProductivityRepository {
  constructor(
    private dailyDigestModel: ReturnModelType<typeof DailyDigestModel>,
    private digestPreferencesModel: ReturnModelType<typeof DigestPreferencesModel>
  ) {}

  /**
   * find the digest of a user for a specific date.
   */
  async findDigest(userId: string, date: string): Promise<DailyDigestModel | undefined> {
    const digest = await this.dailyDigestModel.findOne({ userId, date });
    if (!digest) return undefined;
    return digest.toObject();
  }

  /**
   * find or create the digest of a user for a specific date.
   */
  async findOrCreateDigest(userId: string, date: string): Promise<DailyDigestModel> {
    const existing = await this.findDigest(userId, date);
    if (existing) return existing;

    const created = await this.dailyDigestModel.create({
      digestId: crypto.randomUUID(),
      userId,
      date,
      emailsProcessed: 0,
      repliesSent: 0,
      emailsCleaned: 0,
      minutesSaved: 0,
    });

    return created.toObject();
  }

  /**
   * upsert the digest of a user for a date, accumulating the given increments.
   */
  async accumulateDigest(
    userId: string,
    date: string,
    increments: DigestIncrements
  ): Promise<DailyDigestModel> {
    const updated = await this.dailyDigestModel.findOneAndUpdate(
      { userId, date },
      {
        $inc: {
          emailsProcessed: increments.emailsProcessed,
          repliesSent: increments.repliesSent,
          emailsCleaned: increments.emailsCleaned,
          minutesSaved: increments.minutesSaved,
        },
        $setOnInsert: {
          digestId: crypto.randomUUID(),
          userId,
          date,
        },
      },
      { new: true, upsert: true }
    );

    return updated.toObject();
  }

  /**
   * list the trailing `days` digests of a user, ordered oldest to newest.
   */
  async listDigests(userId: string, days: number): Promise<DailyDigestModel[]> {
    const digests = await this.dailyDigestModel
      .find({ userId })
      .sort({ date: -1 })
      .limit(days);

    return digests.map((digest) => digest.toObject()).reverse();
  }

  /**
   * read the notification preferences of a user, creating the defaults on first access.
   */
  async findOrCreatePreferences(userId: string): Promise<DigestPreferencesModel> {
    const existing = await this.digestPreferencesModel.findOne({ userId });
    if (existing) return existing.toObject();

    const created = await this.digestPreferencesModel.create({
      id: crypto.randomUUID(),
      userId,
      enabled: true,
      channel: DEFAULT_DIGEST_CHANNEL,
      timeOfDay: DEFAULT_DIGEST_TIME_OF_DAY,
    });

    return created.toObject();
  }

  /**
   * update the notification preferences of a user, leaving omitted fields untouched.
   */
  async updatePreferences(
    userId: string,
    options: UpdateNotificationPreferencesOptions
  ): Promise<DigestPreferencesModel> {
    const current = await this.findOrCreatePreferences(userId);

    const next = {
      enabled: options.enabled ?? current.enabled,
      channel: options.channel ?? current.channel,
      timeOfDay: options.timeOfDay ?? current.timeOfDay,
    };

    const updated = await this.digestPreferencesModel.findOneAndUpdate(
      { userId },
      { $set: next },
      { new: true }
    );

    return updated ? updated.toObject() : { ...current, ...next };
  }

  /**
   * whether any digest is already persisted, used to decide if demo history
   * should be seeded.
   */
  async hasDigests(): Promise<boolean> {
    const existing = await this.dailyDigestModel.find().limit(1);
    return Boolean(existing.length);
  }

  /**
   * insert a batch of digest documents, used to seed the demo history.
   */
  async insertDigests(digests: SeedDigestDocument[]): Promise<void> {
    await this.dailyDigestModel.insertMany(digests);
  }
}

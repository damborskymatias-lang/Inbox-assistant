import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import {
  InboxPlatformAspect,
  type InboxPlatformNode,
} from '@lov/inbox-platform.inbox-platform';
import {
  DailyDigest,
  DigestPreferences,
  TrackedAction,
} from '@lov/productivity.entities.daily-digest';
import type { ActionKind, DigestChannel } from '@lov/productivity.entities.daily-digest';
import type { ProductivityConfig } from './productivity-config.js';
import { productivityGqlSchema } from './productivity.graphql.js';
import { DailyDigestModel } from './daily-digest.model.js';
import { DigestPreferencesModel } from './digest-preferences.model.js';
import { ProductivityRepository } from './productivity-repository.js';
import { buildDemoDigestHistory, DEMO_USER_ID } from './digest-seed.js';
import type {
  DigestIncrements,
  ListDigestsOptions,
  TrackActionOptions,
  UpdateNotificationPreferencesOptions,
} from './productivity-types.js';

/**
 * allowed digest delivery channels.
 */
const DIGEST_CHANNELS: DigestChannel[] = ['email', 'push', 'none'];

/**
 * today's date as an ISO date string (YYYY-MM-DD).
 */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * derive the digest counters affected by an action kind.
 */
function toIncrements(kind: ActionKind, count: number, minutesSaved: number): DigestIncrements {
  const increments: DigestIncrements = {
    emailsProcessed: 0,
    repliesSent: 0,
    emailsCleaned: 0,
    minutesSaved,
  };

  if (kind === 'reply_sent') {
    return { ...increments, repliesSent: count, emailsProcessed: count };
  }

  if (kind === 'cleanup') {
    return { ...increments, emailsCleaned: count, emailsProcessed: count };
  }

  if (kind === 'triage') {
    return { ...increments, emailsProcessed: count };
  }

  return increments;
}

/**
 * map a persisted digest document to the DailyDigest entity.
 */
function toDailyDigest(model: DailyDigestModel): DailyDigest {
  return DailyDigest.from({
    id: model.digestId,
    userId: model.userId,
    date: model.date,
    emailsProcessed: model.emailsProcessed,
    repliesSent: model.repliesSent,
    emailsCleaned: model.emailsCleaned,
    minutesSaved: Math.round(model.minutesSaved * 10) / 10,
  });
}

/**
 * map a persisted preferences document to the DigestPreferences entity.
 */
function toDigestPreferences(model: DigestPreferencesModel): DigestPreferences {
  const channel = DIGEST_CHANNELS.includes(model.channel as DigestChannel)
    ? (model.channel as DigestChannel)
    : 'email';

  return DigestPreferences.from({
    enabled: model.enabled,
    channel,
    timeOfDay: model.timeOfDay,
  });
}

export class ProductivityNode {
  constructor(
    private productivityConfig: ProductivityConfig,
    private productivityRepository: ProductivityRepository,
    private inboxPlatform: InboxPlatformNode
  ) {}

  /**
   * the aspect configuration.
   */
  get config(): ProductivityConfig {
    return this.productivityConfig;
  }

  /**
   * resolve the digest owner, falling back to the demo account so the
   * dashboard is populated for anonymous previews.
   */
  private resolveUserId(userId?: string): string {
    return userId || DEMO_USER_ID;
  }

  /**
   * record a time saving action performed by the AI inbox assistant,
   * upserting today's digest and accumulating the minutes saved.
   */
  async trackAction(options: TrackActionOptions, userId?: string): Promise<DailyDigest> {
    const count = options.count ?? 1;
    const action = TrackedAction.from({
      kind: options.kind,
      count,
      minutesSaved: options.minutesSaved ?? TrackedAction.defaultMinutesSaved(options.kind, count),
      ref: options.ref,
      occurredAt: new Date().toISOString(),
    });

    const increments = toIncrements(action.kind, count, action.minutesSaved);
    const digest = await this.productivityRepository.accumulateDigest(
      this.resolveUserId(userId),
      today(),
      increments
    );

    return toDailyDigest(digest);
  }

  /**
   * return today's digest, creating an empty one on the first read of the day.
   */
  async getTodayDigest(userId?: string): Promise<DailyDigest> {
    const digest = await this.productivityRepository.findOrCreateDigest(
      this.resolveUserId(userId),
      today()
    );

    return toDailyDigest(digest);
  }

  /**
   * return the digest history powering the productivity trend, ordered
   * oldest to newest.
   */
  async listDigests(options: ListDigestsOptions = {}, userId?: string): Promise<DailyDigest[]> {
    const days = options.days ?? this.productivityConfig.historyDays ?? 7;
    const digests = await this.productivityRepository.listDigests(this.resolveUserId(userId), days);

    return digests.map((digest) => toDailyDigest(digest));
  }

  /**
   * read the daily digest notification preferences of a user.
   */
  async getNotificationPreferences(userId?: string): Promise<DigestPreferences> {
    const preferences = await this.productivityRepository.findOrCreatePreferences(
      this.resolveUserId(userId)
    );

    return toDigestPreferences(preferences);
  }

  /**
   * update the daily digest notification preferences of a user.
   */
  async updateNotificationPreferences(
    options: UpdateNotificationPreferencesOptions,
    userId?: string
  ): Promise<DigestPreferences> {
    const preferences = await this.productivityRepository.updatePreferences(
      this.resolveUserId(userId),
      options
    );

    return toDigestPreferences(preferences);
  }

  /**
   * the manifest of the hosting platform, used in digest notifications.
   */
  getPlatformManifest() {
    return this.inboxPlatform.getPlatformManifest();
  }

  static dependencies = [SymphonyPlatformAspect, InboxPlatformAspect];

  static defaultConfig: ProductivityConfig = {
    historyDays: 7,
    seedDemoHistory: true,
    digestPath: '/digest',
  };

  static async provider(
    [symphonyPlatform, inboxPlatform]: [SymphonyPlatformNode, InboxPlatformNode],
    config: ProductivityConfig
  ) {
    const dailyDigestModel = getModelForClass(DailyDigestModel);
    const digestPreferencesModel = getModelForClass(DigestPreferencesModel);

    const productivityRepository = new ProductivityRepository(
      dailyDigestModel,
      digestPreferencesModel
    );

    const productivity = new ProductivityNode(config, productivityRepository, inboxPlatform);
    const gqlSchema = productivityGqlSchema(productivity);

    /**
     * seed a week of demo digest history so the productivity trend is
     * populated on a fresh database.
     */
    symphonyPlatform.registerOnStart(async () => {
      if (config.seedDemoHistory === false) return undefined;
      const hasDigests = await productivityRepository.hasDigests();
      if (hasDigests) return undefined;
      await productivityRepository.insertDigests(buildDemoDigestHistory());
      return undefined;
    });

    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    return productivity;
  }
}

export default ProductivityNode;

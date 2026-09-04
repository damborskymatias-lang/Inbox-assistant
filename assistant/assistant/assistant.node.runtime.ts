import { randomUUID } from 'crypto';
import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import {
  InboxPlatformAspect,
  type InboxPlatformNode,
} from '@lov/inbox-platform.inbox-platform';
import { MailAspect, type MailNode } from '@lov/mail.mail';
import { NotFound } from '@bitdev/symphony.exceptions.not-found';
import type { Email } from '@lov/mail.entities.email';
import type { User } from '@lov/inbox-platform.entities.user';
import {
  DailySummary,
  type SuggestedAction,
} from '@lov/assistant.entities.daily-summary';
import {
  ReplyDraft,
  WritingStyle,
  type ReplyLength,
  type ReplyTone,
} from '@lov/assistant.entities.reply-draft';
import { DailySummaryModel } from './daily-summary.model.js';
import { ReplyDraftModel, WritingStyleModel } from './reply-draft.model.js';
import type { AssistantConfig } from './assistant-config.js';
import type { AiProvider, AiProviderSlot } from './ai-provider.js';
import { assistantGqlSchema } from './assistant.graphql.js';
import { AssistantRepository } from './assistant-repository.js';
import { buildDemoWritingStyles, DEMO_USER_ID } from './assistant-seed.js';
import { createOpenAiProvider } from './openai-provider.js';
import { createMockProvider } from './mock-provider.js';
import { buildAnalysisPrompt, buildReplyPrompt } from './prompts.js';
import { QuotaExceededError } from './quota-exceeded-error.js';
import {
  EMAIL_ANALYSIS_SCHEMA,
  EMAIL_CATEGORIES,
  REPLY_SCHEMA,
  type AnalyzeInboxResult,
  type EmailAnalysis,
  type EmailCategory,
  type GenerateReplyOptions,
  type RawEmailAnalysis,
  type RawReply,
  type UpdateWritingStyleOptions,
} from './assistant-types.js';

/**
 * today's date as an ISO date string (YYYY-MM-DD).
 */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * start of the current day, as an ISO timestamp. the reply quota resets on it.
 */
function startOfDay(): string {
  return `${today()}T00:00:00.000Z`;
}

/**
 * coerce an unknown category into one of the smart categories.
 */
function toCategory(value?: string): EmailCategory {
  const normalized = (value || '').toLowerCase() as EmailCategory;
  return EMAIL_CATEGORIES.includes(normalized) ? normalized : 'work';
}

/**
 * clamp the importance score into the 1-10 range expected by the triage view.
 */
function toImportance(value?: number | string): number {
  const parsed = typeof value === 'string' ? Number.parseInt(value, 10) : value;
  if (typeof parsed !== 'number' || Number.isNaN(parsed)) return 5;
  return Math.min(10, Math.max(1, Math.round(parsed)));
}

/**
 * normalize the raw provider payload into the analysis shape stored on emails.
 * providers may answer in snake_case, as described by the JSON schema, or in
 * camelCase — both are accepted.
 */
function toAnalysis(raw: RawEmailAnalysis | undefined, email: Email): EmailAnalysis {
  const needsReply = raw?.needs_reply ?? raw?.needsReply ?? email.needsReply ?? false;
  const suggestedReply = raw?.suggested_reply ?? raw?.suggestedReply;

  return {
    summary: raw?.summary?.trim() || email.summary || email.snippet,
    category: toCategory(raw?.category || email.category),
    importance: toImportance(raw?.importance ?? email.importance),
    needsReply: Boolean(needsReply),
    suggestedReply: suggestedReply?.trim() || undefined,
  };
}

/**
 * map a persisted writing style document to the WritingStyle entity.
 */
function toWritingStyle(model?: WritingStyleModel): WritingStyle {
  if (!model) return WritingStyle.default();

  return WritingStyle.from({
    tone: model.tone as ReplyTone,
    length: model.length as ReplyLength,
    signOff: model.signOff,
  });
}

/**
 * map a persisted daily summary document to the DailySummary entity.
 */
function toDailySummary(model: DailySummaryModel): DailySummary {
  return DailySummary.from({
    id: model.id,
    userId: model.userId,
    date: model.date,
    totalNew: model.totalNew,
    greeting: model.greeting,
    highlights: model.highlights,
    suggestedActions: model.suggestedActions,
  });
}

/**
 * map a persisted reply draft document to the ReplyDraft entity.
 */
function toReplyDraft(model: ReplyDraftModel): ReplyDraft {
  return ReplyDraft.from({
    id: model.id,
    emailId: model.emailId,
    userId: model.userId,
    body: model.body,
    tone: model.tone as ReplyTone,
    generatedAt: model.generatedAt,
    sent: model.sent,
  });
}

/**
 * a greeting matching the time of day, mirroring the prototype's copy.
 */
function buildGreeting(name: string): string {
  const hour = new Date().getHours();
  const partOfDay = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';
  return `Good ${partOfDay}, ${name} 👋`;
}

/**
 * the kind of first action suggested for an email.
 */
function toActionKind(email: Email): SuggestedAction['kind'] {
  if (email.needsReply) return 'reply';
  if (email.category === 'marketing') return 'archive';
  if (email.category === 'bills' || email.category === 'urgent') return 'verify';
  return 'review';
}

/**
 * the label of the first action suggested for an email.
 */
function toActionLabel(email: Email): string {
  const name = email.sender.split(' ')[0];
  if (email.needsReply) return `Reply to ${name}`;
  if (email.category === 'bills' || email.category === 'urgent') return `Check ${email.subject}`;
  return `Review ${email.subject}`;
}

export class AssistantNode {
  constructor(
    private assistantConfig: AssistantConfig,
    private aiProviderSlot: AiProviderSlot,
    private assistantRepository: AssistantRepository,
    private inboxPlatform: InboxPlatformNode,
    private mail: MailNode
  ) {}

  /**
   * the aspect configuration.
   */
  get config(): AssistantConfig {
    return this.assistantConfig;
  }

  /**
   * register AI providers used to analyze emails and draft replies.
   */
  registerAiProvider(aiProviders: AiProvider[]) {
    this.aiProviderSlot.register(aiProviders);
    return this;
  }

  /**
   * list every registered AI provider. the provider named in the aspect
   * configuration comes first, so it is the one used by default.
   */
  listAiProviders(): AiProvider[] {
    const providers = this.aiProviderSlot.flatValues();
    const preferredName = this.assistantConfig.preferredProvider;
    const preferred = providers.find((provider) => provider.name === preferredName);
    if (!preferred) return providers;

    return [preferred, ...providers.filter((provider) => provider !== preferred)];
  }

  /**
   * run a prompt through the registered providers, falling back to the next
   * provider whenever one fails, so a missing API key or a network hiccup never
   * breaks the feature.
   */
  private async complete<ResultType>(prompt: string, schema: object): Promise<ResultType | undefined> {
    const providers = this.listAiProviders();

    /**
     * providers are tried in order, the deterministic mock provider always answers.
     */
    return providers.reduce<Promise<ResultType | undefined>>(async (previous, provider) => {
      const resolved = await previous;
      if (resolved) return resolved;

      try {
        return (await provider.complete(prompt, schema)) as ResultType;
      } catch {
        return undefined;
      }
    }, Promise.resolve(undefined));
  }

  /**
   * resolve the owner of a request, falling back to the demo account so the
   * dashboard and settings are populated for anonymous previews.
   */
  private resolveUserId(user?: User): string {
    return user?.id || DEMO_USER_ID;
  }

  /**
   * analyze a single email and apply the structured result back to the mail
   * aspect, which recomputes its triage bucket.
   */
  async analyzeEmail(emailId: string, user?: User): Promise<EmailAnalysis> {
    const email = await this.mail.getEmail(emailId);
    if (!email) throw new NotFound();

    const raw = await this.complete<RawEmailAnalysis>(
      buildAnalysisPrompt(email),
      EMAIL_ANALYSIS_SCHEMA
    );

    const analysis = toAnalysis(raw, email);

    await this.mail.applyAnalysis(emailId, {
      summary: analysis.summary,
      category: analysis.category,
      importance: analysis.importance,
      needsReply: analysis.needsReply,
      suggestedReply: analysis.suggestedReply,
    });

    /**
     * a fresh analysis invalidates the digest cached earlier today.
     */
    await this.assistantRepository.clearDailySummary(this.resolveUserId(user), today());

    return analysis;
  }

  /**
   * analyze every email which was not classified yet, for example right after
   * a mailbox sync, and return how many emails were processed.
   */
  async analyzeInbox(user?: User): Promise<AnalyzeInboxResult> {
    const limit = this.assistantConfig.maxEmailsPerRun ?? 25;
    const emails = await this.mail.listEmails({ limit });
    const pending = emails.filter((email) => !email.summary || email.importance === undefined);

    const analyzed = await pending.reduce<Promise<number>>(async (previous, email) => {
      const count = await previous;

      try {
        await this.analyzeEmail(email.id, user);
        return count + 1;
      } catch {
        return count;
      }
    }, Promise.resolve(0));

    return { analyzed };
  }

  /**
   * today's digest of the user's unread emails: a greeting, the highlights that
   * actually matter and the suggested first actions. The digest is generated
   * once per day and cached in MongoDB, so opening the dashboard again is free.
   */
  async getDailySummary(user?: User): Promise<DailySummary> {
    const userId = this.resolveUserId(user);
    const date = today();

    const cached = await this.assistantRepository.findDailySummary(userId, date);
    if (cached) return toDailySummary(cached);

    const unread = await this.mail.listEmails({ unreadOnly: true, limit: 50 });
    const ranked = [...unread].sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0));
    const notable = ranked.filter((email) => email.category !== 'marketing').slice(0, 3);
    const promotions = ranked.filter((email) => email.category === 'marketing');

    const highlights = notable.map((email) => email.summary || `${email.sender}: ${email.subject}`);

    const suggestedActions: SuggestedAction[] = notable.map((email) => ({
      label: toActionLabel(email),
      emailId: email.id,
      kind: toActionKind(email),
    }));

    if (promotions.length >= 2) {
      suggestedActions.push({
        label: `Archive ${promotions.length} newsletters`,
        kind: 'archive',
      });
    }

    const name = user?.name?.trim().split(' ')[0] || 'there';

    const saved = await this.assistantRepository.saveDailySummary({
      id: randomUUID(),
      userId,
      date,
      totalNew: unread.length,
      greeting: buildGreeting(name),
      highlights,
      suggestedActions,
    });

    return toDailySummary(saved);
  }

  /**
   * draft a reply to an email in the user's stored writing style. The daily
   * generation quota is checked first, so exhausted plans surface an upgrade
   * prompt instead of consuming another generation.
   */
  async generateReply(options: GenerateReplyOptions, user?: User): Promise<ReplyDraft> {
    const userId = this.resolveUserId(user);
    await this.assertReplyQuota(userId);

    const email = await this.mail.getEmail(options.emailId);
    if (!email) throw new NotFound();

    const writingStyle = await this.getWritingStyle(user);
    const raw = await this.complete<RawReply>(
      buildReplyPrompt(email, writingStyle, options.instructions),
      REPLY_SCHEMA
    );

    const body =
      raw?.body?.trim() ||
      `Hi ${email.sender.split(' ')[0]},\n\nThanks for your message — I'll come back to you shortly.\n\n${writingStyle.signOff}`;

    const draft = await this.assistantRepository.createReplyDraft({
      id: randomUUID(),
      emailId: email.id,
      userId,
      body,
      tone: writingStyle.tone,
      generatedAt: new Date().toISOString(),
      sent: false,
    });

    return toReplyDraft(draft);
  }

  /**
   * the writing style preferences applied to every generated reply, falling
   * back to the default style before a user customized theirs.
   */
  async getWritingStyle(user?: User): Promise<WritingStyle> {
    const style = await this.assistantRepository.findWritingStyle(this.resolveUserId(user));
    return toWritingStyle(style);
  }

  /**
   * update the tone, length or sign-off used when drafting replies. any
   * property left out keeps its previously saved value.
   */
  async updateWritingStyle(
    options: UpdateWritingStyleOptions,
    user?: User
  ): Promise<WritingStyle> {
    const userId = this.resolveUserId(user);
    const current = await this.getWritingStyle(user);

    const next = WritingStyle.from({
      tone: options.tone || current.tone,
      length: options.length || current.length,
      signOff: options.signOff ?? current.signOff,
    });

    const saved = await this.assistantRepository.saveWritingStyle(userId, next.toObject());
    return toWritingStyle(saved);
  }

  /**
   * the amount of AI replies a user may still generate today.
   */
  async getRemainingReplies(user?: User): Promise<number> {
    const limit = this.assistantConfig.dailyReplyLimit ?? 0;
    if (limit <= 0) return Number.MAX_SAFE_INTEGER;

    const used = await this.assistantRepository.countReplyDraftsSince(
      this.resolveUserId(user),
      startOfDay()
    );

    return Math.max(0, limit - used);
  }

  /**
   * the manifest of the hosting platform, used in assistant copy.
   */
  getPlatformManifest() {
    return this.inboxPlatform.getPlatformManifest();
  }

  /**
   * throw a quota exceeded error once the plan's daily allowance is used up.
   */
  private async assertReplyQuota(userId: string): Promise<void> {
    const limit = this.assistantConfig.dailyReplyLimit ?? 0;
    if (limit <= 0) return;

    const used = await this.assistantRepository.countReplyDraftsSince(userId, startOfDay());
    if (used >= limit) throw new QuotaExceededError(used, limit);
  }

  static dependencies = [SymphonyPlatformAspect, InboxPlatformAspect, MailAspect];

  static defaultConfig: AssistantConfig = {
    preferredProvider: 'openai',
    model: 'gpt-4o-mini',
    maxEmailsPerRun: 25,
    dailyReplyLimit: 0,
    analyzeOnStart: true,
    seedDemoWritingStyle: true,
    settingsPath: '/assistant/settings',
  };

  static async provider(
    [symphonyPlatform, inboxPlatform, mail]: [SymphonyPlatformNode, InboxPlatformNode, MailNode],
    config: AssistantConfig,
    [aiProviderSlot]: [AiProviderSlot]
  ) {
    const dailySummaryModel = getModelForClass(DailySummaryModel);
    const replyDraftModel = getModelForClass(ReplyDraftModel);
    const writingStyleModel = getModelForClass(WritingStyleModel);

    const assistantRepository = new AssistantRepository(
      dailySummaryModel,
      replyDraftModel,
      writingStyleModel
    );

    const assistant = new AssistantNode(
      config,
      aiProviderSlot,
      assistantRepository,
      inboxPlatform,
      mail
    );

    /**
     * register the two built-in providers. OpenAI is used whenever an
     * OPENAI_API_KEY is configured, and the deterministic mock provider always
     * stays registered as the last resort so the app works without any key.
     */
    const openAiProvider = createOpenAiProvider(config.model);
    assistant.registerAiProvider(
      openAiProvider ? [openAiProvider, createMockProvider()] : [createMockProvider()]
    );

    /**
     * seed the demo account's writing style, and classify every email which was
     * synced but never analyzed, so a fresh database already shows a triaged
     * inbox and a meaningful daily digest.
     */
    symphonyPlatform.registerOnStart(async () => {
      if (config.seedDemoWritingStyle !== false) {
        const hasWritingStyles = await assistantRepository.hasWritingStyles();
        if (!hasWritingStyles) {
          await assistantRepository.insertWritingStyles(buildDemoWritingStyles());
        }
      }

      if (config.analyzeOnStart === false) return undefined;

      try {
        await assistant.analyzeInbox();
      } catch {
        // the inbox is analyzed again on the next sync, never block startup.
      }

      return undefined;
    });

    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: assistantGqlSchema(assistant),
      },
    ]);

    return assistant;
  }
}

export default AssistantNode;

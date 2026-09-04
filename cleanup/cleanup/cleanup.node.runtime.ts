import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import {
  InboxPlatformAspect,
  type InboxPlatformNode,
} from '@lov/inbox-platform.inbox-platform';
import { MailAspect, type MailNode } from '@lov/mail.mail';
import {
  ProductivityAspect,
  type ProductivityNode,
} from '@lov/productivity.productivity';
import { NotFound } from '@bitdev/symphony.exceptions.not-found';
import { CleanupSuggestion } from '@lov/cleanup.entities.cleanup-suggestion';
import type { Email } from '@lov/mail.entities.email';
import type { User } from '@lov/inbox-platform.entities.user';
import type { CleanupConfig } from './cleanup-config.js';
import type { CleanupRule, CleanupRuleSlot } from './cleanup-rule.js';
import type { CleanupPreview, CleanupResult } from './cleanup-types.js';
import { buildBuiltInRules } from './cleanup-rules.js';
import { cleanupGqlSchema } from './cleanup.graphql.js';

/**
 * prefix of every suggestion id, keeping suggestion ids stable across detections.
 */
const SUGGESTION_ID_PREFIX = 'cleanup';

/**
 * estimated minutes a user saves for every email cleaned up.
 */
const MINUTES_PER_EMAIL = 0.5;

/**
 * maximum amount of emails scanned in a single detection run.
 */
const SCAN_LIMIT = 500;

export class CleanupNode {
  constructor(
    private cleanupConfig: CleanupConfig,
    private cleanupRuleSlot: CleanupRuleSlot,
    private mail: MailNode,
    private productivity: ProductivityNode,
    private inboxPlatform: InboxPlatformNode
  ) {}

  /**
   * the aspect configuration.
   */
  get config(): CleanupConfig {
    return this.cleanupConfig;
  }

  /**
   * register cleanup rules detecting groups of emails which can safely be
   * archived or deleted in bulk.
   */
  registerCleanupRule(cleanupRules: CleanupRule[]) {
    this.cleanupRuleSlot.register(cleanupRules);
    return this;
  }

  /**
   * list all registered cleanup rules, ordered by weight.
   */
  listCleanupRules(): CleanupRule[] {
    return [...this.cleanupRuleSlot.flatValues()].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
  }

  /**
   * detect the cleanup opportunities of the current mailbox by running every
   * registered rule over the active emails read through the mail aspect.
   * rules without a single match are left out.
   */
  async listSuggestions(_user?: User): Promise<CleanupSuggestion[]> {
    const emails = await this.listActiveEmails();

    return this.listCleanupRules()
      .map((rule) => this.toSuggestion(rule, rule.match(emails)))
      .filter((suggestion): suggestion is CleanupSuggestion => Boolean(suggestion));
  }

  /**
   * resolve the emails a suggestion would affect, so the user can review the
   * impact before confirming the bulk action.
   */
  async previewSuggestion(id: string, _user?: User): Promise<CleanupPreview> {
    const { matched } = await this.resolveSuggestion(id);

    return {
      emailIds: matched.map((email) => email.id),
      count: matched.length,
    };
  }

  /**
   * execute a cleanup suggestion, archiving or deleting the matched emails
   * through the mail aspect and reporting the saved minutes to the
   * productivity aspect.
   */
  async executeSuggestion(id: string, user?: User): Promise<CleanupResult> {
    const { rule, matched } = await this.resolveSuggestion(id);
    const emailIds = matched.map((email) => email.id);

    const { affected } =
      rule.action === 'delete'
        ? await this.mail.deleteEmails(emailIds, user)
        : await this.mail.archiveEmails(emailIds, user);

    const minutesSaved = this.estimateMinutesSaved(affected);

    await this.productivity.trackAction(
      {
        kind: 'cleanup',
        count: affected,
        minutesSaved,
        ref: id,
      },
      user?.id
    );

    return {
      id,
      affected,
      action: rule.action,
      minutesSaved,
    };
  }

  /**
   * the manifest of the hosting platform, used in cleanup copy and notifications.
   */
  getPlatformManifest() {
    return this.inboxPlatform.getPlatformManifest();
  }

  /**
   * the active emails of the mailbox, read through the mail aspect so the
   * cleanup aspect never touches the mail store directly.
   */
  private async listActiveEmails(): Promise<Email[]> {
    return this.mail.listEmails({ limit: this.cleanupConfig.scanLimit ?? SCAN_LIMIT });
  }

  /**
   * resolve the rule behind a suggestion id together with the emails it
   * currently matches.
   */
  private async resolveSuggestion(id: string): Promise<{ rule: CleanupRule; matched: Email[] }> {
    const rule = this.listCleanupRules().find((candidate) => this.toSuggestionId(candidate) === id);
    if (!rule) throw new NotFound();

    const emails = await this.listActiveEmails();
    return { rule, matched: rule.match(emails) };
  }

  /**
   * the stable suggestion id produced by a rule.
   */
  private toSuggestionId(rule: CleanupRule): string {
    return `${SUGGESTION_ID_PREFIX}-${rule.name}`;
  }

  /**
   * minutes a user saves by not handling the given amount of emails by hand.
   */
  private estimateMinutesSaved(count: number): number {
    const minutesPerEmail = this.cleanupConfig.minutesPerEmail ?? MINUTES_PER_EMAIL;
    if (count <= 0) return 0;
    return Math.max(1, Math.round(count * minutesPerEmail));
  }

  /**
   * build the suggestion of a rule out of the emails it matched.
   */
  private toSuggestion(rule: CleanupRule, matched: Email[]): CleanupSuggestion | undefined {
    if (!matched.length) return undefined;

    return CleanupSuggestion.from({
      id: this.toSuggestionId(rule),
      rule: rule.name,
      label: `${matched.length} ${rule.label}`,
      description: rule.description || `${matched.length} emails matched by the ${rule.name} rule.`,
      count: matched.length,
      action: rule.action,
      estimatedMinutesSaved: this.estimateMinutesSaved(matched.length),
      pro: Boolean(rule.pro),
    });
  }

  static dependencies = [
    SymphonyPlatformAspect,
    InboxPlatformAspect,
    MailAspect,
    ProductivityAspect,
  ];

  static defaultConfig: CleanupConfig = {
    cleanupPath: '/cleanup',
    recentDays: 30,
    staleDays: 30,
    unreadDays: 7,
    repeatSenderThreshold: 3,
    lowImportanceThreshold: 4,
    minutesPerEmail: MINUTES_PER_EMAIL,
    scanLimit: SCAN_LIMIT,
  };

  static async provider(
    [symphonyPlatform, inboxPlatform, mail, productivity]: [
      SymphonyPlatformNode,
      InboxPlatformNode,
      MailNode,
      ProductivityNode
    ],
    config: CleanupConfig,
    [cleanupRuleSlot]: [CleanupRuleSlot]
  ) {
    const cleanup = new CleanupNode(config, cleanupRuleSlot, mail, productivity, inboxPlatform);

    /**
     * register the built-in rules through the very same slot other aspects use:
     * recent newsletters and marketing (free), stale promotions, abandoned unread
     * marketing and low importance repeat senders (pro).
     */
    cleanup.registerCleanupRule(buildBuiltInRules(config));

    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: cleanupGqlSchema(cleanup),
      },
    ]);

    return cleanup;
  }
}

export default CleanupNode;

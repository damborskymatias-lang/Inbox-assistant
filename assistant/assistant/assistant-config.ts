/**
 * configuration of the assistant aspect, shared by the node and browser runtimes.
 */
export type AssistantConfig = {
  /**
   * name of the AI provider preferred when several providers are registered.
   * falls back to the next available provider whenever it fails.
   */
  preferredProvider?: string;

  /**
   * model used by the built-in OpenAI provider.
   */
  model?: string;

  /**
   * maximum amount of emails analyzed in a single analyzeInbox run.
   */
  maxEmailsPerRun?: number;

  /**
   * amount of AI replies a user may generate per day. the quota is checked
   * before a reply is drafted, mirroring the billing plan allowance.
   */
  dailyReplyLimit?: number;

  /**
   * analyze newly synced emails when the server starts.
   */
  analyzeOnStart?: boolean;

  /**
   * seed the demo account's writing style on a fresh database.
   */
  seedDemoWritingStyle?: boolean;

  /**
   * path the assistant settings page is mounted on.
   */
  settingsPath?: string;
};

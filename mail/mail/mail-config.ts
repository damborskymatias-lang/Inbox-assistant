/**
 * configuration of the mail aspect.
 */
export type MailConfig = {
  /**
   * path the inbox page is mounted on.
   */
  inboxPath?: string;

  /**
   * maximum amount of messages pulled from the active provider on a single sync.
   */
  maxMessagesPerSync?: number;

  /**
   * name of the provider preferred when syncing. falls back to the mock
   * provider when the preferred provider is unavailable for the user.
   */
  preferredProvider?: string;
};

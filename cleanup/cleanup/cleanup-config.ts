export type CleanupConfig = {
  /**
   * path the cleanup page is mounted on.
   */
  cleanupPath?: string;

  /**
   * amount of trailing days considered "recent" when detecting newsletters
   * and marketing emails worth archiving.
   */
  recentDays?: number;

  /**
   * age in days after which a promotional email is considered stale
   * and safe to delete.
   */
  staleDays?: number;

  /**
   * age in days after which an unread marketing email is considered abandoned.
   */
  unreadDays?: number;

  /**
   * amount of emails a single sender must have before it is treated
   * as a repeat sender.
   */
  repeatSenderThreshold?: number;

  /**
   * highest importance score an email may have to be considered low importance.
   */
  lowImportanceThreshold?: number;

  /**
   * estimated minutes a user saves for every email cleaned up, used to
   * report the time saved to the productivity aspect.
   */
  minutesPerEmail?: number;

  /**
   * maximum amount of emails scanned in a single detection run.
   */
  scanLimit?: number;
};

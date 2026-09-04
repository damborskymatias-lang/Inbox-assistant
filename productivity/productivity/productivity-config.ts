export type ProductivityConfig = {
  /**
   * number of days of digest history returned by default, used to
   * populate the productivity trend.
   */
  historyDays?: number;

  /**
   * whether a week of demo digest history is seeded on start, so the
   * trend is populated on a fresh database.
   */
  seedDemoHistory?: boolean;

  /**
   * path of the daily digest page registered by this aspect.
   */
  digestPath?: string;
};

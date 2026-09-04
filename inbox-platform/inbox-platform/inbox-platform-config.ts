export type InboxPlatformConfig = {
  /**
   * MongoDB connection string
   */
  mongoUrl?: string;

  /**
   * Secret key used for session signing
   */
  sessionSecretKey: string;
};
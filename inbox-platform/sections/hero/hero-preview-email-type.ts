/**
 * Triage bucket used to color the stripe and badge of a preview email row.
 */
export type HeroPreviewBucket = `urgent` | `needsReply` | `fyi` | `promotions`;

/**
 * A single row rendered inside the stylized inbox preview mock.
 */
export type HeroPreviewEmail = {
  /**
   * Stable identifier for the preview row.
   */
  id: string;

  /**
   * Display name of the sender.
   */
  sender: string;

  /**
   * Subject line shown in the preview.
   */
  subject: string;

  /**
   * Short AI-generated summary line.
   */
  summary: string;

  /**
   * Triage bucket, used to color the row stripe and badge.
   */
  bucket: HeroPreviewBucket;

  /**
   * Human readable received time.
   */
  receivedAt: string;
};

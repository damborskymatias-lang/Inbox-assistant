import type { BadgeTone } from '@lov/design.content.badge';
import type { EmailCategory } from '@lov/mail.entities.email';

/**
 * visual metadata for a smart email category.
 */
export type CategoryMeta = {
  /**
   * human readable label for the category.
   */
  label: string;

  /**
   * emoji rendered before the label.
   */
  emoji: string;

  /**
   * badge tone matching the category color.
   */
  tone: BadgeTone;
};

/**
 * metadata for every smart category assigned by the AI classifier.
 */
export const CATEGORY_META: Record<EmailCategory, CategoryMeta> = {
  urgent: { label: `Urgent`, emoji: `🔴`, tone: `urgent` },
  work: { label: `Work`, emoji: `💼`, tone: `work` },
  bills: { label: `Bills`, emoji: `💰`, tone: `bills` },
  shopping: { label: `Shopping`, emoji: `🛒`, tone: `shopping` },
  family: { label: `Family`, emoji: `👨‍👩‍👧`, tone: `family` },
  marketing: { label: `Marketing`, emoji: `📢`, tone: `marketing` },
};

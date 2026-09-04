import type { Email } from '@lov/mail.entities.email';
import type { CleanupRule } from './cleanup-rule.js';
import type { CleanupConfig } from './cleanup-config.js';

/**
 * amount of milliseconds in a single day.
 */
const DAY_IN_MS = 24 * 60 * 60 * 1000;

/**
 * amount of days an email counts as recent for the newsletter rule.
 */
export const RECENT_DAYS = 30;

/**
 * age in days after which a promotional email is considered stale.
 */
export const STALE_DAYS = 30;

/**
 * age in days after which an unread marketing email is considered abandoned.
 */
export const UNREAD_DAYS = 7;

/**
 * amount of emails a sender must have sent to count as a repeat sender.
 */
export const REPEAT_SENDER_THRESHOLD = 3;

/**
 * highest importance score an email may have to count as low importance.
 */
export const LOW_IMPORTANCE_THRESHOLD = 4;

/**
 * age of an email in days, relative to now.
 */
function ageInDays(email: Email, now: number): number {
  const receivedAt = Date.parse(email.receivedAt);
  if (Number.isNaN(receivedAt)) return 0;
  return (now - receivedAt) / DAY_IN_MS;
}

/**
 * whether an email is a newsletter, promotion or any other bulk marketing message.
 */
function isMarketing(email: Email): boolean {
  return email.category === 'marketing' || email.bucket === 'promotions';
}

/**
 * the built-in cleanup rules of the aspect, ordered by the value they bring
 * to the user. every rule is registered through the CleanupRule slot, so
 * other aspects can contribute rules the exact same way.
 */
export function buildBuiltInRules(config: CleanupConfig = {}): CleanupRule[] {
  const recentDays = config.recentDays ?? RECENT_DAYS;
  const staleDays = config.staleDays ?? STALE_DAYS;
  const unreadDays = config.unreadDays ?? UNREAD_DAYS;
  const repeatSenderThreshold = config.repeatSenderThreshold ?? REPEAT_SENDER_THRESHOLD;
  const lowImportanceThreshold = config.lowImportanceThreshold ?? LOW_IMPORTANCE_THRESHOLD;

  return [
    {
      name: 'newsletters',
      label: 'newsletters detected',
      description: `Newsletters and marketing emails from the last ${recentDays} days. You can still find them in your Gmail archive.`,
      action: 'archive',
      pro: false,
      weight: 10,
      match: (emails: Email[]) => {
        const now = Date.now();
        return emails.filter((email) => isMarketing(email) && ageInDays(email, now) <= recentDays);
      },
    },
    {
      name: 'old-promotions',
      label: 'promotional emails detected',
      description: `Promotional emails that are more than ${staleDays} days old and unlikely to be needed.`,
      action: 'delete',
      pro: true,
      weight: 20,
      match: (emails: Email[]) => {
        const now = Date.now();
        return emails.filter((email) => isMarketing(email) && ageInDays(email, now) > staleDays);
      },
    },
    {
      name: 'unread-marketing',
      label: 'unread marketing emails detected',
      description: `Marketing emails you never opened, sitting in your inbox for more than ${unreadDays} days.`,
      action: 'archive',
      pro: true,
      weight: 30,
      match: (emails: Email[]) => {
        const now = Date.now();
        return emails.filter(
          (email) => isMarketing(email) && !email.read && ageInDays(email, now) > unreadDays
        );
      },
    },
    {
      name: 'low-importance-repeat-senders',
      label: 'emails from repeat senders detected',
      description: `Low importance emails from senders that keep writing you and rarely need an answer.`,
      action: 'archive',
      pro: true,
      weight: 40,
      match: (emails: Email[]) => {
        const candidates = emails.filter(
          (email) =>
            !isMarketing(email) &&
            !email.needsReply &&
            (email.importance ?? 0) <= lowImportanceThreshold
        );

        const bySender = candidates.reduce<Record<string, Email[]>>((grouped, email) => {
          const senderEmails = grouped[email.senderEmail] || [];
          return { ...grouped, [email.senderEmail]: [...senderEmails, email] };
        }, {});

        return Object.values(bySender)
          .filter((senderEmails) => senderEmails.length >= repeatSenderThreshold)
          .flat();
      },
    },
  ];
}

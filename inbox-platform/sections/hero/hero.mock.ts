import type { HeroPreviewEmail } from './hero-preview-email-type.js';

/**
 * Default stylized inbox preview rows shown on the right of the hero section.
 */
export const heroPreviewEmails: HeroPreviewEmail[] = [
  {
    id: `h1`,
    sender: `John Carter`,
    subject: `Project update for Q3 rollout?`,
    summary: `Client is requesting a project update before the Thursday steering call.`,
    bucket: `urgent`,
    receivedAt: `08:12`,
  },
  {
    id: `h2`,
    sender: `Lena Fischer`,
    subject: `Contract review — one open point`,
    summary: `Legal flagged the liability clause and needs your decision.`,
    bucket: `needsReply`,
    receivedAt: `Yesterday`,
  },
  {
    id: `h3`,
    sender: `Amazon`,
    subject: `Your package has been delayed`,
    summary: `Delivery of your order moved from Tuesday to Friday.`,
    bucket: `fyi`,
    receivedAt: `07:02`,
  },
  {
    id: `h4`,
    sender: `Figma`,
    subject: `What shipped this month in Figma`,
    summary: `Monthly product newsletter — no action needed.`,
    bucket: `promotions`,
    receivedAt: `Yesterday`,
  },
];

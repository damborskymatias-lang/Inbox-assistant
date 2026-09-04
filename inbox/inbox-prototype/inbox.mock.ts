import type { InboxEmail } from './inbox-types.js';

/**
 * Mock inbox used by the prototype to demonstrate AI triage.
 */
export const mockEmails: InboxEmail[] = [
  {
    id: 'e1',
    sender: 'John Carter',
    senderEmail: 'john@northwind.io',
    subject: 'Project update for Q3 rollout?',
    summary: 'Client is requesting a project update before the Thursday steering call.',
    body: 'Hi Peter,\n\nCould you share where we stand on the Q3 rollout? The steering committee meets Thursday and I would like to bring numbers.\n\nThanks,\nJohn',
    category: 'work',
    importance: 9,
    needsReply: true,
    bucket: 'urgent',
    receivedAt: '08:12',
    read: false,
  },
  {
    id: 'e2',
    sender: 'Revolut Security',
    senderEmail: 'no-reply@revolut.com',
    subject: 'Action required: verify your identity',
    summary: 'Your bank requires identity verification within 48 hours.',
    body: 'We need to confirm your identity to keep your account active. Please complete verification within 48 hours.',
    category: 'bills',
    importance: 10,
    needsReply: false,
    bucket: 'urgent',
    receivedAt: '07:45',
    read: false,
  },
  {
    id: 'e3',
    sender: 'Amazon',
    senderEmail: 'ship-confirm@amazon.com',
    subject: 'Your package has been delayed',
    summary: 'Delivery of your order moved from Tuesday to Friday.',
    body: 'Sorry — your package is delayed. New estimated delivery: Friday between 9am and 1pm.',
    category: 'shopping',
    importance: 5,
    needsReply: false,
    bucket: 'fyi',
    receivedAt: '07:02',
    read: false,
  },
  {
    id: 'e4',
    sender: 'Lena Fischer',
    senderEmail: 'lena@designstudio.de',
    subject: 'Contract review — one open point',
    summary: 'Legal flagged the liability clause and needs your decision.',
    body: 'Hi Peter,\n\nLegal is fine with everything except clause 7.2 on liability. Can you confirm the cap we agreed on?\n\nBest,\nLena',
    category: 'work',
    importance: 8,
    needsReply: true,
    bucket: 'needsReply',
    receivedAt: 'Yesterday',
    read: true,
  },
  {
    id: 'e5',
    sender: 'Mom',
    senderEmail: 'mom@family.net',
    subject: 'Sunday lunch?',
    summary: 'Family lunch invitation for Sunday at 1pm.',
    body: 'Are you coming Sunday? Grandma is making the good soup. Let me know before Friday!',
    category: 'family',
    importance: 6,
    needsReply: true,
    bucket: 'needsReply',
    receivedAt: 'Yesterday',
    read: true,
  },
  {
    id: 'e6',
    sender: 'Figma',
    senderEmail: 'news@figma.com',
    subject: 'What shipped this month in Figma',
    summary: 'Monthly product newsletter — no action needed.',
    body: 'Variables, new dev mode features, and more.',
    category: 'marketing',
    importance: 1,
    needsReply: false,
    bucket: 'promotions',
    receivedAt: 'Yesterday',
    read: true,
  },
];

/**
 * Counts per triage bucket shown on the dashboard.
 */
export const bucketCounts = {
  urgent: 5,
  needsReply: 12,
  fyi: 18,
  promotions: 31,
};

/**
 * AI generated daily summary highlights.
 */
export const dailyHighlights = [
  'Client is requesting a project update.',
  'Your bank requires identity verification.',
  'Amazon package has been delayed.',
];

/**
 * AI suggested first actions for the day.
 */
export const suggestedActions = [
  'Reply to John',
  'Verify your bank account',
  'Archive newsletters',
];

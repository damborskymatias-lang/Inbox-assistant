import { v4 as uuidv4 } from 'uuid';
import { ReplyDraft, WritingStyle } from './reply-draft.js';
import type { PlainReplyDraft, PlainWritingStyle } from './reply-draft.js';

/**
 * mock reply draft representing the prototype's example reply to John Carter,
 * confirming a Q3 rollout update will be shared the next morning.
 */
export function mockReplyDraft(overrides: Partial<PlainReplyDraft> = {}): ReplyDraft {
  return ReplyDraft.from({
    id: 'reply-e1',
    emailId: 'e1',
    userId: 'user-peter-novak',
    body: "Hi John,\n\nThanks for reaching out.\n\nI'll send you the project update tomorrow morning.\n\nBest,\nPeter",
    tone: 'friendly',
    generatedAt: '2024-01-15T08:20:00.000Z',
    sent: false,
    ...overrides,
  });
}

/**
 * a handful of mock reply drafts for compositions and tests, covering
 * different tones and sent states.
 */
export function mockReplyDrafts(): ReplyDraft[] {
  return [
    mockReplyDraft(),
    mockReplyDraft({
      id: uuidv4(),
      emailId: 'e4',
      body: "Hi Lena,\n\nWe agreed on a liability cap of 1.5x annual fees. Please confirm clause 7.2 reflects that.\n\nBest,\nPeter",
      tone: 'formal',
      generatedAt: '2024-01-14T10:05:00.000Z',
      sent: true,
    }),
    mockReplyDraft({
      id: uuidv4(),
      emailId: 'e5',
      body: "Hi Mom,\n\nSunday works for me — I'll be there around 1pm.\n\nLove,\nPeter",
      tone: 'warm',
      generatedAt: '2024-01-14T18:30:00.000Z',
      sent: true,
    }),
  ];
}

/**
 * mock writing style used for compositions and tests, matching the
 * default preferences applied by the assistant.
 */
export function mockWritingStyle(overrides: Partial<PlainWritingStyle> = {}): WritingStyle {
  return WritingStyle.from({
    tone: 'friendly',
    length: 'medium',
    signOff: 'Best,\nPeter',
    ...overrides,
  });
}

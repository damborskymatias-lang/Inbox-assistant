import { DEFAULT_WRITING_STYLE } from '@lov/assistant.entities.reply-draft';
import type { WritingStyleData } from './assistant-repository.js';

/**
 * id of the seeded demo account (Peter Novak), used whenever no user is
 * attached to the session so previews are always populated.
 */
export const DEMO_USER_ID = 'user-peter-novak';

/**
 * writing style preferences persisted on a fresh database, so the assistant
 * settings page and generated replies are meaningful from the first visit.
 */
export function buildDemoWritingStyles(): Array<WritingStyleData & { userId: string }> {
  return [
    {
      userId: DEMO_USER_ID,
      tone: DEFAULT_WRITING_STYLE.tone,
      length: DEFAULT_WRITING_STYLE.length,
      signOff: DEFAULT_WRITING_STYLE.signOff,
    },
  ];
}

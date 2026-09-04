import type { Email } from '@lov/mail.entities.email';
import type { WritingStyle } from '@lov/assistant.entities.reply-draft';

/**
 * truncate long email bodies so prompts stay within a reasonable token budget.
 */
function clamp(value: string, max = 1200): string {
  const text = (value || '').trim();
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
}

/**
 * build the prompt asking a provider to classify a single email. the labelled
 * format is also what the deterministic mock provider reads back, so both
 * providers work off the exact same input.
 */
export function buildAnalysisPrompt(email: Email): string {
  return [
    'Analyze the following email and classify it for an inbox triage view.',
    'Pick the category from: urgent, work, bills, shopping, family, marketing.',
    'Rate importance from 1 (ignorable) to 10 (critical), set needs_reply, and draft a short suggested_reply when a reply is expected.',
    '',
    `From: ${email.sender} <${email.senderEmail}>`,
    `Subject: ${email.subject}`,
    `Received: ${email.receivedAt}`,
    'Body:',
    clamp(email.body || email.snippet),
  ].join('\n');
}

/**
 * build the prompt asking a provider to draft a reply in the user's writing style.
 */
export function buildReplyPrompt(
  email: Email,
  writingStyle: WritingStyle,
  instructions?: string
): string {
  return [
    'Draft a reply to the email below on behalf of the recipient.',
    `Tone: ${writingStyle.tone}.`,
    `Length: ${writingStyle.length}.`,
    `Sign-off: ${writingStyle.signOff.replace(/\n/g, ' ')}`,
    instructions ? `Additional instructions: ${instructions}` : 'No additional instructions.',
    '',
    `From: ${email.sender} <${email.senderEmail}>`,
    `Subject: ${email.subject}`,
    'Body:',
    clamp(email.body || email.snippet),
  ].join('\n');
}

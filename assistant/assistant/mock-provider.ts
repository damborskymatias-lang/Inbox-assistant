import type { AiProvider } from './ai-provider.js';

/**
 * keyword rules used by the deterministic classifier. the first matching rule
 * wins, so the most specific signals are listed first.
 */
const CATEGORY_RULES: Array<{ category: string; importance: number; keywords: string[] }> = [
  {
    category: 'urgent',
    importance: 9,
    keywords: ['urgent', 'asap', 'immediately', 'verify', 'suspended', 'security alert', 'deadline'],
  },
  {
    category: 'bills',
    importance: 7,
    keywords: ['invoice', 'payment', 'receipt', 'billing', 'subscription', 'renewal', 'due'],
  },
  {
    category: 'marketing',
    importance: 2,
    keywords: ['newsletter', 'unsubscribe', 'sale', 'deal', 'webinar', 'promo', 'offer'],
  },
  {
    category: 'shopping',
    importance: 4,
    keywords: ['order', 'shipped', 'delivery', 'package', 'tracking', 'delayed'],
  },
  {
    category: 'family',
    importance: 5,
    keywords: ['lunch', 'dinner', 'weekend', 'birthday', 'mom', 'dad', 'family'],
  },
  {
    category: 'work',
    importance: 6,
    keywords: ['project', 'meeting', 'contract', 'review', 'roadmap', 'status', 'sync', 'proposal'],
  },
];

/**
 * signals that the sender is waiting for an answer.
 */
const REPLY_SIGNALS = [
  '?',
  'could you',
  'can you',
  'please confirm',
  'let me know',
  'waiting for',
  'what do you think',
  'thoughts',
  'update',
];

/**
 * read a labelled line out of a prompt built by the assistant.
 */
function readField(prompt: string, label: string): string {
  const match = new RegExp(`^${label}:\\s*(.*)$`, 'mi').exec(prompt);
  return match?.[1]?.trim() || '';
}

/**
 * a stable pseudo random number derived from the text, so the same email
 * always yields the same nudge and previews never flicker between runs.
 */
function stableSeed(text: string): number {
  let hash = 0;
  for (const char of text) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100000;
  }
  return hash;
}

/**
 * the sender's first name, used to personalize deterministic replies.
 */
function firstName(sender: string): string {
  const name = sender.replace(/<.*>/, '').trim().split(' ')[0];
  return name || 'there';
}

/**
 * classify the email described by the prompt using keyword heuristics.
 */
function analyze(prompt: string) {
  const subject = readField(prompt, 'Subject');
  const sender = readField(prompt, 'From');
  const bodyIndex = prompt.toLowerCase().lastIndexOf('body:');
  const body = bodyIndex === -1 ? '' : prompt.slice(bodyIndex + 5).trim();
  const haystack = `${subject}\n${body}`.toLowerCase();

  const rule =
    CATEGORY_RULES.find((candidate) =>
      candidate.keywords.some((keyword) => haystack.includes(keyword))
    ) || CATEGORY_RULES[CATEGORY_RULES.length - 1];

  const needsReply =
    rule.category !== 'marketing' && REPLY_SIGNALS.some((signal) => haystack.includes(signal));

  const nudge = stableSeed(subject || body) % 2;
  const importance = Math.min(10, Math.max(1, rule.importance + (needsReply ? 1 : 0) - nudge));
  const name = firstName(sender);
  const topic = subject || 'your message';

  return {
    summary: `${name} writes about ${topic.toLowerCase()}${needsReply ? ' and is waiting for an answer' : ''}.`,
    category: rule.category,
    importance,
    needs_reply: needsReply,
    suggested_reply: needsReply
      ? `Hi ${name},\n\nThanks for the note on ${topic.toLowerCase()} — I'm on it and will come back to you with details shortly.`
      : undefined,
  };
}

/**
 * draft a deterministic reply from the tone, length and sign-off encoded in the prompt.
 */
function reply(prompt: string) {
  const sender = readField(prompt, 'From');
  const subject = readField(prompt, 'Subject');
  const tone = readField(prompt, 'Tone').replace(/\.$/, '') || 'friendly';
  const length = readField(prompt, 'Length').replace(/\.$/, '') || 'medium';
  const signOff = readField(prompt, 'Sign-off') || 'Best,';
  const instructions = readField(prompt, 'Additional instructions');
  const name = firstName(sender);
  const topic = (subject || 'your message').toLowerCase();

  const openings: Record<string, string> = {
    friendly: `Thanks so much for reaching out about ${topic}!`,
    formal: `Thank you for your message regarding ${topic}.`,
    concise: `Thanks for the note on ${topic}.`,
    warm: `It's always good to hear from you — thanks for writing about ${topic}.`,
  };

  const extras: Record<string, string[]> = {
    short: [],
    medium: [`I've looked into it and will have everything ready for you by tomorrow morning.`],
    long: [
      `I've looked into it and will have everything ready for you by tomorrow morning.`,
      `In the meantime, let me know if there is anything else you need from my side and I'll prioritize it.`,
    ],
  };

  const guided =
    instructions && instructions !== 'No additional instructions.' ? [instructions] : [];

  const paragraphs = [
    openings[tone] || openings.friendly,
    ...guided,
    ...(extras[length] || extras.medium),
  ];

  return {
    body: `Hi ${name},\n\n${paragraphs.join(' ')}\n\n${signOff}`,
  };
}

/**
 * create the deterministic mock AI provider. It runs entirely offline using
 * keyword heuristics over the prompt, so the assistant keeps producing sensible
 * analyses and replies when no OPENAI_API_KEY is configured — the same input
 * always yields the same output.
 */
export function createMockProvider(): AiProvider {
  return {
    name: 'mock',

    complete: async (prompt: string) => {
      if (/^Draft a reply/im.test(prompt)) {
        return reply(prompt);
      }

      return analyze(prompt);
    },
  };
}

import type { PricingFaqItem } from './pricing-faq-item-type.js';

/**
 * default FAQ content shown on the pricing page.
 */
export const DEFAULT_FAQ_ITEMS: PricingFaqItem[] = [
  {
    question: `What counts as an AI reply?`,
    answer: `Every reply the assistant drafts or sends counts as one AI reply, whether you edit it first or send it as-is.`,
  },
  {
    question: `Can I switch plans at any time?`,
    answer: `Yes. Upgrades apply immediately, and downgrades take effect at the end of your current billing period.`,
  },
  {
    question: `What happens when I run out of AI replies on the Free plan?`,
    answer: `You can keep triaging and reading your daily summary for free — you'll just need to write replies manually until your monthly limit resets, or upgrade to Pro for unlimited replies.`,
  },
  {
    question: `Is there a free trial for Pro?`,
    answer: `The Free plan has no time limit, so you can try the assistant risk-free before deciding to upgrade to Pro.`,
  },
];

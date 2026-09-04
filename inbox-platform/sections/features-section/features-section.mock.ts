import type { FeatureItem } from './feature-item-type.js';

export const defaultFeatures: FeatureItem[] = [
  {
    icon: `✨`,
    title: `AI daily summary`,
    description: `Wake up to a concise digest of what actually matters — highlights, key threads and suggested first actions, generated fresh every morning.`,
    highlight: `Good morning, Peter 👋`,
  },
  {
    icon: `📥`,
    title: `Smart categories`,
    description: `Every email is triaged into Urgent, Needs Reply, FYI or Promotions, with an importance score so nothing critical slips by.`,
    highlight: `Importance scored 0-10`,
  },
  {
    icon: `⚡`,
    title: `One-click AI replies`,
    description: `Draft, tone-matched replies are ready before you even open the thread. Review, tweak, and send in a single click.`,
    highlight: `Reply in seconds`,
  },
  {
    icon: `🧹`,
    title: `Bulk inbox cleanup`,
    description: `Newsletters and promotions are grouped automatically so you can archive dozens of emails from the last 30 days at once.`,
    highlight: `42 newsletters cleared`,
  },
  {
    icon: `⏱`,
    title: `Minutes saved, daily`,
    description: `A running digest tracks exactly how much time our AI has saved you today — reading, sorting and replying, so you can see the impact.`,
    highlight: `You saved ~24 minutes today`,
  },
];

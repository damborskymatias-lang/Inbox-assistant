import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { Hero } from './hero.js';
import type { HeroPreviewEmail } from './hero-preview-email-type.js';

export const BasicHero = () => {
  return (
    <MockProvider>
      <Hero />
    </MockProvider>
  );
};

export const HeroWithCtaHandler = () => {
  return (
    <MockProvider>
      <Hero
        onCtaClick={() => alert(`Continue with Google clicked`)}
        ctaNote="Connect your Google account securely in seconds."
      />
    </MockProvider>
  );
};

const customPreviewEmails: HeroPreviewEmail[] = [
  {
    id: `c1`,
    sender: `Sarah Kim`,
    subject: `Can we move the demo to Friday?`,
    summary: `Client wants to reschedule the product demo call.`,
    bucket: `urgent`,
    receivedAt: `09:20`,
  },
  {
    id: `c2`,
    sender: `Stripe`,
    subject: `Your payout has been sent`,
    summary: `A payout of $4,210 was sent to your bank account.`,
    bucket: `fyi`,
    receivedAt: `Yesterday`,
  },
  {
    id: `c3`,
    sender: `Notion`,
    subject: `New comments on your workspace`,
    summary: `Two teammates left comments awaiting your reply.`,
    bucket: `needsReply`,
    receivedAt: `Yesterday`,
  },
];

export const HeroWithCustomContent = () => {
  return (
    <MockProvider>
      <Hero
        headline="Take back your mornings"
        subheadline="Let AI sort, summarize and draft replies for every email so you can start your day with a clear inbox."
        stats={[
          { value: `20 min`, label: `average saved daily` },
          { value: `98%`, label: `triage accuracy` },
        ]}
        previewEmails={customPreviewEmails}
      />
    </MockProvider>
  );
};

import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { InboxPlatformAspect, type InboxPlatformBrowser } from '@lov/inbox-platform.inbox-platform';
import { MailAspect, type MailBrowser } from '@lov/mail.mail';
import { DailySummaryPanel } from '@lov/assistant.dashboard-panel.daily-summary-panel';
import { GenerateReplyAction } from '@lov/assistant.ui.generate-reply-action';
import { AssistantSettings } from '@lov/assistant.pages.assistant-settings';
import { SparklesIcon } from '@lov/assistant.icons.assistant-icons';
import type { AssistantConfig } from './assistant-config.js';

export class AssistantBrowser {
  constructor(
    private assistantConfig: AssistantConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private inboxPlatform: InboxPlatformBrowser,
    private mail: MailBrowser,
  ) {}

  static dependencies = [SymphonyPlatformAspect, InboxPlatformAspect, MailAspect];

  static async provider(
    [symphonyPlatform, inboxPlatform, mail]: [SymphonyPlatformBrowser, InboxPlatformBrowser, MailBrowser],
    config: AssistantConfig,
  ) {
    const assistant = new AssistantBrowser(config, symphonyPlatform, inboxPlatform, mail);

    symphonyPlatform.registerRoute([
      {
        path: 'assistant/settings',
        component: () => <AssistantSettings />,
      },
    ]);

    inboxPlatform.registerDashboardPanel([
      {
        name: 'daily-summary',
        span: 'full',
        weight: 10,
        component: () => <DailySummaryPanel />,
      },
    ]);

    inboxPlatform.registerUserBarMenuItem?.([
      {
        label: 'Assistant Settings',
        href: '/assistant/settings',
        icon: () => <SparklesIcon size="sm" />,
      },
    ]);

    mail.registerEmailAction?.([
      {
        name: 'generate-reply',
        component: ({ email }: { email: any }) => <GenerateReplyAction email={email} />,
      },
    ]);

    return assistant;
  }
}

export default AssistantBrowser;
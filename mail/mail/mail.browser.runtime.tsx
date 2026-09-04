import React from 'react';
import {
  InboxPlatformAspect,
  type InboxPlatformBrowser,
} from '@lov/inbox-platform.inbox-platform';
import { InboxPage } from '@lov/mail.pages.inbox-page';
import { InboxSummaryPanel } from '@lov/mail.dashboard-panel.inbox-summary-panel';
import { InboxIcon } from '@lov/mail.icons.mail-icons';
import type { MailConfig } from './mail-config.js';
import type { EmailAction, EmailActionSlot } from './email-action.js';
import { UrgentCountStore } from './urgent-count-store.js';

export class MailBrowser {
  constructor(
    private mailConfig: MailConfig,
    private emailActionSlot: EmailActionSlot,
    private urgentCountStore: UrgentCountStore
  ) {}

  /**
   * register actions rendered into the email reader toolbar, for example
   * an AI "Generate Reply" button contributed by the assistant aspect.
   */
  registerEmailAction(emailActions: EmailAction[]) {
    this.emailActionSlot.register(emailActions);
    return this;
  }

  /**
   * list all registered email actions, ordered by weight.
   */
  listEmailActions(): EmailAction[] {
    return [...this.emailActionSlot.flatValues()].sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0));
  }

  /**
   * the amount of urgent emails, rendered as the badge of the inbox navigation item.
   */
  getUrgentCount(): number | undefined {
    return this.urgentCountStore.getCount();
  }

  /**
   * the path the inbox page is mounted on.
   */
  get inboxPath(): string {
    return this.mailConfig.inboxPath || '/inbox';
  }

  static dependencies = [InboxPlatformAspect];

  static defaultConfig: MailConfig = {
    inboxPath: '/inbox',
  };

  static async provider(
    [inboxPlatform]: [InboxPlatformBrowser],
    config: MailConfig,
    [emailActionSlot]: [EmailActionSlot]
  ) {
    const mail = new MailBrowser(config, emailActionSlot, new UrgentCountStore());

    /**
     * the inbox page. email actions are read at render time so actions
     * registered by other aspects are always picked up.
     */
    function InboxRoute() {
      const emailActions = mail.listEmailActions();

      return <InboxPage emailActions={emailActions} />;
    }

    /**
     * the inbox summary panel rendered on the dashboard, linking each
     * triage tile back to the pre-filtered inbox.
     */
    function InboxSummaryDashboardPanel() {
      return <InboxSummaryPanel inboxPath={mail.inboxPath} />;
    }

    inboxPlatform.registerRoute([
      {
        path: mail.inboxPath,
        component: InboxRoute,
        protected: true,
      },
    ]);

    inboxPlatform.registerNavigationItem([
      {
        label: 'Inbox',
        href: mail.inboxPath,
        icon: InboxIcon,
        weight: 10,
        badge: () => mail.getUrgentCount(),
      },
    ]);

    inboxPlatform.registerDashboardPanel([
      {
        name: 'inbox-summary',
        component: InboxSummaryDashboardPanel,
        weight: 10,
        span: 'full',
      },
    ]);

    return mail;
  }
}

export default MailBrowser;

import { MailAspect } from './mail.aspect.js';

export type { MailNode } from './mail.node.runtime.js';
export type { MailBrowser } from './mail.browser.runtime.js';
export type { MailConfig } from './mail-config.js';
export type { EmailAction, EmailActionSlot } from './email-action.js';
export type { MailProvider, MailProviderSlot, RawMessage } from './mail-provider.js';
export type {
  TriageBucket,
  EmailCategory,
  ListEmailsOptions,
  TriageCounts,
  EmailAnalysis,
  SyncEmailsResult,
  EmailActionResult,
} from './mail-options.js';

export default MailAspect;
export { MailAspect };

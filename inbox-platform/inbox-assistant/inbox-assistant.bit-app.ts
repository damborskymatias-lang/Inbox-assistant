import { HarmonyPlatform } from '@bitdev/harmony.harmony-platform';
import { NodeJSRuntime } from '@bitdev/harmony.runtimes.nodejs-runtime';
import { BrowserRuntime } from '@bitdev/harmony.runtimes.browser-runtime';
import { SymphonyPlatformAspect } from '@bitdev/symphony.symphony-platform';
import { InboxPlatformAspect } from '@lov/inbox-platform.inbox-platform';
import { MailAspect } from '@lov/mail.mail';
import { AssistantAspect } from '@lov/assistant.assistant';
import { CleanupAspect } from '@lov/cleanup.cleanup';
import { ProductivityAspect } from '@lov/productivity.productivity';
import { BillingAspect } from '@lov/billing.billing';

/**
 * compose the inbox-assistant platform.
 * the platform aspect owns auth, layout and routing shell.
 * feature aspects (mail, assistant, cleanup, productivity, billing) register
 * themselves into the platform's slots — the platform never imports them directly.
 */
export const InboxAssistant = HarmonyPlatform.from({
  name: 'inbox-assistant',
  platform: [
    SymphonyPlatformAspect,
    {
      name: 'InboxAssistant',
      slogan: 'Your AI-powered inbox copilot',
      logo: 'https://static.bit.dev/extensions-icons/wayne.svg',
    },
  ],

  runtimes: [new BrowserRuntime(), new NodeJSRuntime()],

  aspects: [
    InboxPlatformAspect,
    MailAspect,
    AssistantAspect,
    CleanupAspect,
    ProductivityAspect,
    BillingAspect,
  ],
});

export default InboxAssistant;

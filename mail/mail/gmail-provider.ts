import type { InboxPlatformNode } from '@lov/inbox-platform.inbox-platform';
import { deriveBucket, type EmailCategory } from '@lov/mail.entities.email';
import type { User } from '@lov/inbox-platform.entities.user';
import type { MailProvider, RawMessage } from './mail-provider.js';

const GMAIL_API = 'https://gmail.googleapis.com/gmail/v1/users/me';
const DEMO_TOKEN_PREFIX = 'demo-google-access-token-';

type GmailHeader = {
  name?: string;
  value?: string;
};

type GmailPart = {
  mimeType?: string;
  body?: { data?: string; size?: number };
  parts?: GmailPart[];
};

type GmailMessage = {
  id?: string;
  threadId?: string;
  snippet?: string;
  labelIds?: string[];
  internalDate?: string;
  payload?: GmailPart & { headers?: GmailHeader[] };
};

/**
 * create the Gmail mail provider. it acts on behalf of a user using the Google
 * OAuth tokens stored by the platform aspect. when no real token is available
 * the provider reports itself as unavailable so the mock provider takes over.
 */
export function createGmailProvider(
  inboxPlatform: InboxPlatformNode,
  maxMessagesPerSync: number
): MailProvider {
  async function resolveAccessToken(user?: User): Promise<string | undefined> {
    const tokens = await inboxPlatform.getGoogleTokens(user?.id);
    const accessToken = tokens?.accessToken;
    if (!accessToken) return undefined;
    if (accessToken.startsWith(DEMO_TOKEN_PREFIX)) return undefined;
    return accessToken;
  }

  async function gmailRequest<TResult>(
    accessToken: string,
    path: string,
    init?: { method?: string; body?: unknown }
  ): Promise<TResult | undefined> {
    try {
      const response = await fetch(`${GMAIL_API}${path}`, {
        method: init?.method || 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: init?.body ? JSON.stringify(init.body) : undefined,
      });

      if (!response.ok) return undefined;
      return (await response.json()) as TResult;
    } catch {
      return undefined;
    }
  }

  return {
    name: 'gmail',
    weight: 1,

    isAvailable: async (user?: User) => {
      const accessToken = await resolveAccessToken(user);
      return Boolean(accessToken);
    },

    fetchMessages: async (user: User, since?: string) => {
      const accessToken = await resolveAccessToken(user);
      if (!accessToken) return [];

      const query = since ? `&q=after:${toGmailDate(since)}` : '';
      const list = await gmailRequest<{ messages?: Array<{ id: string }> }>(
        accessToken,
        `/messages?maxResults=${maxMessagesPerSync}&labelIds=INBOX${query}`
      );

      const ids = list?.messages?.map((message) => message.id) || [];
      const messages = await Promise.all(
        ids.map((id) => gmailRequest<GmailMessage>(accessToken, `/messages/${id}?format=full`))
      );

      return messages
        .filter((message): message is GmailMessage => Boolean(message?.id))
        .map((message) => toRawMessage(message));
    },

    archive: async (user: User, ids: string[]) => {
      const accessToken = await resolveAccessToken(user);
      if (!accessToken) return;

      await Promise.all(
        ids.map((id) =>
          gmailRequest(accessToken, `/messages/${id}/modify`, {
            method: 'POST',
            body: { removeLabelIds: ['INBOX', 'UNREAD'] },
          })
        )
      );
    },

    remove: async (user: User, ids: string[]) => {
      const accessToken = await resolveAccessToken(user);
      if (!accessToken) return;

      await Promise.all(
        ids.map((id) => gmailRequest(accessToken, `/messages/${id}/trash`, { method: 'POST' }))
      );
    },

    send: async (user: User, to: string, subject: string, body: string, threadId?: string) => {
      const accessToken = await resolveAccessToken(user);
      if (!accessToken) return;

      const mime = [
        `To: ${to}`,
        `Subject: ${subject}`,
        'Content-Type: text/plain; charset="UTF-8"',
        '',
        body,
      ].join('\r\n');

      await gmailRequest(accessToken, '/messages/send', {
        method: 'POST',
        body: {
          raw: toBase64Url(mime),
          threadId,
        },
      });
    },
  };
}

/**
 * map a Gmail API message into a provider agnostic raw message.
 */
function toRawMessage(message: GmailMessage): RawMessage {
  const headers = message.payload?.headers || [];
  const from = headerValue(headers, 'From');
  const subject = headerValue(headers, 'Subject') || '(no subject)';
  const { sender, senderEmail } = parseFrom(from);
  const body = readBody(message.payload) || message.snippet || '';
  const snippet = message.snippet || body.slice(0, 140);
  const labels = message.labelIds || [];
  const category: EmailCategory | undefined = labels.includes('CATEGORY_PROMOTIONS')
    ? 'marketing'
    : undefined;
  const importance = labels.includes('IMPORTANT') ? 8 : 4;

  return {
    gmailId: message.id as string,
    threadId: message.threadId,
    sender,
    senderEmail,
    subject,
    body,
    snippet,
    category,
    importance,
    needsReply: false,
    bucket: deriveBucket({ importance, needsReply: false, category }),
    receivedAt: message.internalDate
      ? new Date(Number(message.internalDate)).toISOString()
      : new Date().toISOString(),
    read: !labels.includes('UNREAD'),
    archived: !labels.includes('INBOX'),
  };
}

/**
 * read a header value from a Gmail payload, case insensitively.
 */
function headerValue(headers: GmailHeader[], name: string): string {
  const header = headers.find((item) => item.name?.toLowerCase() === name.toLowerCase());
  return header?.value || '';
}

/**
 * split a `Name <email>` header into its display name and address.
 */
function parseFrom(from: string): { sender: string; senderEmail: string } {
  const match = from.match(/^\s*"?([^"<]*)"?\s*<([^>]+)>\s*$/);
  if (match) {
    const name = match[1].trim();
    const email = match[2].trim();
    return { sender: name || email, senderEmail: email };
  }

  const email = from.trim();
  return { sender: email || 'Unknown sender', senderEmail: email };
}

/**
 * recursively extract the plain text body of a Gmail payload.
 */
function readBody(part?: GmailPart): string {
  if (!part) return '';

  if (part.mimeType === 'text/plain' && part.body?.data) {
    return fromBase64Url(part.body.data);
  }

  const children = part.parts || [];
  const found = children.map((child) => readBody(child)).find((value) => Boolean(value));
  if (found) return found;

  if (part.body?.data) return fromBase64Url(part.body.data);
  return '';
}

/**
 * decode a base64url encoded Gmail body part.
 */
function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(normalized, 'base64').toString('utf-8');
}

/**
 * encode a MIME message as base64url, as required by the Gmail send API.
 */
function toBase64Url(value: string): string {
  return Buffer.from(value, 'utf-8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * format an ISO timestamp as the `YYYY/MM/DD` value expected by Gmail search.
 */
function toGmailDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return '';
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}/${month}/${day}`;
}

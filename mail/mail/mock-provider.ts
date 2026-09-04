import { mockEmails } from '@lov/mail.entities.email';
import type { MailProvider, RawMessage } from './mail-provider.js';

/**
 * create the mock mail provider. it serves the demo account and acts as the
 * fallback whenever Gmail is not connected, so the inbox is never empty.
 */
export function createMockProvider(): MailProvider {
  return {
    name: 'mock',
    weight: 100,

    isAvailable: async () => true,

    fetchMessages: async (_user, since?: string) => {
      const messages: RawMessage[] = mockEmails().map((email) => {
        const plain = email.toObject();

        return {
          gmailId: plain.gmailId,
          threadId: plain.threadId,
          sender: plain.sender,
          senderEmail: plain.senderEmail,
          subject: plain.subject,
          body: plain.body,
          snippet: plain.snippet,
          summary: plain.summary,
          category: plain.category,
          importance: plain.importance,
          needsReply: plain.needsReply,
          bucket: plain.bucket,
          receivedAt: plain.receivedAt,
          read: plain.read,
          archived: plain.archived,
        };
      });

      if (!since) return messages;
      const sinceTime = new Date(since).getTime();
      if (Number.isNaN(sinceTime)) return messages;

      return messages.filter((message) => {
        const receivedAt = message.receivedAt ? new Date(message.receivedAt).getTime() : 0;
        return receivedAt > sinceTime;
      });
    },

    archive: async () => {},

    remove: async () => {},

    send: async () => {},
  };
}

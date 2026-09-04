import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { User } from '@lov/inbox-platform.entities.user';
import type { MailNode } from './mail.node.runtime.js';
import type { ListEmailsOptions, EmailAnalysis } from './mail-options.js';

type Context = {
  session?: {
    user?: User;
  };
};

/**
 * create the GraphQL schema of the mail aspect, exposing the inbox
 * queries and mutations backed by the mail node runtime.
 */
export function mailGqlSchema(mailNode: MailNode): GqlSchema {
  return {
    typeDefs: gql`
      type Email {
        id: ID!
        gmailId: String!
        threadId: String
        sender: String!
        senderEmail: String!
        subject: String!
        body: String!
        snippet: String!
        summary: String
        category: String
        importance: Int
        needsReply: Boolean
        replyGenerated: Boolean
        bucket: String!
        receivedAt: String!
        read: Boolean!
        archived: Boolean!
      }

      type TriageCounts {
        urgent: Int!
        needsReply: Int!
        fyi: Int!
        promotions: Int!
        total: Int!
      }

      type SyncEmailsResult {
        synced: Int!
      }

      type EmailActionResult {
        affected: Int!
      }

      input ListEmailsOptions {
        bucket: String
        category: String
        search: String
        unreadOnly: Boolean
        limit: Int
        offset: Int
      }

      input ArchiveEmailsOptions {
        ids: [String]
      }

      input DeleteEmailsOptions {
        ids: [String]
      }

      input SendReplyOptions {
        emailId: String!
        body: String!
      }

      input EmailAnalysisOptions {
        summary: String
        category: String
        importance: Int
        needsReply: Boolean
        suggestedReply: String
      }

      input ApplyAnalysisOptions {
        emailId: String!
        analysis: EmailAnalysisOptions
      }

      type Query {
        listEmails(options: ListEmailsOptions): [Email]
        getEmail(id: ID!): Email
        getTriageCounts: TriageCounts
      }

      type Mutation {
        syncEmails: SyncEmailsResult
        archiveEmails(options: ArchiveEmailsOptions): EmailActionResult
        deleteEmails(options: DeleteEmailsOptions): EmailActionResult
        sendReply(options: SendReplyOptions): Email
        applyAnalysis(options: ApplyAnalysisOptions): Email
      }
    `,
    resolvers: {
      Query: {
        listEmails: async (_req: unknown, { options }: { options?: ListEmailsOptions }) => {
          const emails = await mailNode.listEmails(options);
          return emails.map((email) => email.toObject());
        },

        getEmail: async (_req: unknown, { id }: { id: string }) => {
          const email = await mailNode.getEmail(id);
          if (!email) return null;
          return email.toObject();
        },

        getTriageCounts: async () => {
          return mailNode.getTriageCounts();
        },
      },

      Mutation: {
        syncEmails: async (_req: unknown, _args: unknown, context: Context) => {
          return mailNode.syncEmails(context.session?.user);
        },

        archiveEmails: async (
          _req: unknown,
          { options }: { options?: { ids?: string[] } },
          context: Context
        ) => {
          return mailNode.archiveEmails(options?.ids || [], context.session?.user);
        },

        deleteEmails: async (
          _req: unknown,
          { options }: { options?: { ids?: string[] } },
          context: Context
        ) => {
          return mailNode.deleteEmails(options?.ids || [], context.session?.user);
        },

        sendReply: async (
          _req: unknown,
          { options }: { options: { emailId: string; body: string } },
          context: Context
        ) => {
          const email = await mailNode.sendReply(options.emailId, options.body, context.session?.user);
          return email.toObject();
        },

        applyAnalysis: async (
          _req: unknown,
          { options }: { options: { emailId: string; analysis?: EmailAnalysis } }
        ) => {
          const email = await mailNode.applyAnalysis(options.emailId, options.analysis || {});
          return email.toObject();
        },
      },
    },
  };
}

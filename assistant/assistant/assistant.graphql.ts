import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { User } from '@lov/inbox-platform.entities.user';
import type { AssistantNode } from './assistant.node.runtime.js';
import { createMockProvider } from './mock-provider.js';
import type {
  AnalyzeEmailOptions,
  GenerateReplyOptions,
  RegisterAiProviderOptions,
  UpdateWritingStyleOptions,
} from './assistant-types.js';

type Context = {
  session?: {
    user?: User;
  };
};

/**
 * create the GraphQL schema of the assistant aspect, exposing email analysis,
 * the daily digest, reply generation and the writing style preferences.
 */
export function assistantGqlSchema(assistantNode: AssistantNode): GqlSchema {
  return {
    typeDefs: gql`
      type AssistantEmailAnalysis {
        summary: String!
        category: String!
        importance: Int!
        needsReply: Boolean!
        suggestedReply: String
      }

      type AssistantInboxAnalysis {
        analyzed: Int!
      }

      type AssistantSuggestedAction {
        label: String!
        emailId: String
        kind: String!
      }

      type AssistantDailySummary {
        id: ID!
        date: String!
        totalNew: Int!
        greeting: String!
        highlights: [String]
        suggestedActions: [AssistantSuggestedAction]
      }

      type AssistantReplyDraft {
        id: ID!
        emailId: String!
        body: String!
        tone: String!
        generatedAt: String!
      }

      type AssistantWritingStyle {
        tone: String!
        length: String!
        signOff: String!
      }

      input AnalyzeEmailOptions {
        emailId: String!
      }

      input GenerateReplyOptions {
        emailId: String!
        instructions: String
      }

      input UpdateWritingStyleOptions {
        tone: String
        length: String
        signOff: String
      }

      input RegisterAiProviderOptions {
        name: String!
        providerType: String
      }

      type Query {
        getDailySummary: AssistantDailySummary
        getWritingStyle: AssistantWritingStyle
      }

      type Mutation {
        analyzeEmail(options: AnalyzeEmailOptions): AssistantEmailAnalysis
        analyzeInbox: AssistantInboxAnalysis
        generateReply(options: GenerateReplyOptions): AssistantReplyDraft
        updateWritingStyle(options: UpdateWritingStyleOptions): AssistantWritingStyle
        registerAiProvider(options: RegisterAiProviderOptions): Boolean
      }
    `,

    resolvers: {
      Query: {
        getDailySummary: async (_req: unknown, _args: unknown, context: Context) => {
          const summary = await assistantNode.getDailySummary(context.session?.user);
          return summary.toObject();
        },

        getWritingStyle: async (_req: unknown, _args: unknown, context: Context) => {
          const writingStyle = await assistantNode.getWritingStyle(context.session?.user);
          return writingStyle.toObject();
        },
      },

      Mutation: {
        analyzeEmail: async (
          _req: unknown,
          { options }: { options: AnalyzeEmailOptions },
          context: Context
        ) => {
          return assistantNode.analyzeEmail(options.emailId, context.session?.user);
        },

        analyzeInbox: async (_req: unknown, _args: unknown, context: Context) => {
          return assistantNode.analyzeInbox(context.session?.user);
        },

        generateReply: async (
          _req: unknown,
          { options }: { options: GenerateReplyOptions },
          context: Context
        ) => {
          const draft = await assistantNode.generateReply(options, context.session?.user);
          return draft.toObject();
        },

        updateWritingStyle: async (
          _req: unknown,
          { options }: { options?: UpdateWritingStyleOptions },
          context: Context
        ) => {
          const writingStyle = await assistantNode.updateWritingStyle(
            options || {},
            context.session?.user
          );

          return writingStyle.toObject();
        },

        registerAiProvider: async (
          _req: unknown,
          { options }: { options: RegisterAiProviderOptions }
        ) => {
          const provider = createMockProvider();
          assistantNode.registerAiProvider([{ ...provider, name: options.name }]);
          return true;
        },
      },
    },
  };
}

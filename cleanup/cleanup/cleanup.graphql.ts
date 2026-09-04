import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { Email } from '@lov/mail.entities.email';
import type { CleanupNode } from './cleanup.node.runtime.js';
import type { CleanupRule } from './cleanup-rule.js';
import type {
  CleanupRuleOptions,
  ExecuteSuggestionOptions,
  PreviewSuggestionOptions,
  RegisterCleanupRuleOptions,
} from './cleanup-types.js';

/**
 * build a keyword matcher out of a cleanup rule contributed over the network.
 * the words of the rule name are matched against the sender, subject and snippet.
 */
function toKeywordRule(options: CleanupRuleOptions): CleanupRule {
  const keywords = options.name
    .toLowerCase()
    .split(/[\s,._-]+/)
    .filter((keyword) => keyword.length > 2);

  return {
    name: options.id || options.name,
    label: `${options.name} emails detected`,
    description: options.description,
    action: options.action === 'delete' ? 'delete' : 'archive',
    pro: true,
    weight: 100,
    match: (emails: Email[]) =>
      emails.filter((email) => {
        const haystack = `${email.sender} ${email.senderEmail} ${email.subject} ${email.snippet}`.toLowerCase();
        return keywords.some((keyword) => haystack.includes(keyword));
      }),
  };
}

/**
 * creates the GraphQL schema exposing the cleanup detection and execution API.
 */
export function cleanupGqlSchema(cleanupNode: CleanupNode): GqlSchema {
  return {
    typeDefs: gql`
      type CleanupSuggestion {
        id: String
        rule: String
        label: String
        description: String
        count: Int
        action: String
        estimatedMinutesSaved: Int
        pro: Boolean
      }

      type CleanupResult {
        id: String
        affected: Int
        action: String
        minutesSaved: Int
      }

      type CleanupPreview {
        emailIds: [String]
        count: Int
      }

      input PreviewSuggestionOptions {
        id: String
      }

      input ExecuteSuggestionOptions {
        id: String
      }

      input CleanupRuleOptions {
        id: String
        name: String
        description: String
        action: String
      }

      input RegisterCleanupRuleOptions {
        rules: [CleanupRuleOptions]
      }

      type Query {
        listSuggestions: [CleanupSuggestion]
        previewSuggestion(options: PreviewSuggestionOptions): CleanupPreview
      }

      type Mutation {
        executeSuggestion(options: ExecuteSuggestionOptions): CleanupResult
        registerCleanupRule(options: RegisterCleanupRuleOptions): Boolean
      }
    `,
    resolvers: {
      Query: {
        listSuggestions: async (_req: unknown, _args: unknown, context: any) => {
          const user = context.session?.user;
          const suggestions = await cleanupNode.listSuggestions(user);
          return suggestions.map((suggestion) => suggestion.toObject());
        },

        previewSuggestion: async (
          _req: unknown,
          { options }: { options?: PreviewSuggestionOptions },
          context: any
        ) => {
          if (!options?.id) return { emailIds: [], count: 0 };
          const user = context.session?.user;
          return cleanupNode.previewSuggestion(options.id, user);
        },
      },

      Mutation: {
        executeSuggestion: async (
          _req: unknown,
          { options }: { options?: ExecuteSuggestionOptions },
          context: any
        ) => {
          if (!options?.id) return null;
          const user = context.session?.user;
          return cleanupNode.executeSuggestion(options.id, user);
        },

        registerCleanupRule: async (
          _req: unknown,
          { options }: { options?: RegisterCleanupRuleOptions }
        ) => {
          const rules = options?.rules?.filter((rule) => Boolean(rule?.name)) || [];
          if (!rules.length) return false;
          cleanupNode.registerCleanupRule(rules.map((rule) => toKeywordRule(rule)));
          return true;
        },
      },
    },
  };
}

import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { ProductivityNode } from './productivity.node.runtime.js';
import type {
  ListDigestsOptions,
  TrackActionOptions,
  UpdateNotificationPreferencesOptions,
} from './productivity-types.js';

/**
 * creates the GraphQL schema exposing the productivity digest API.
 */
export function productivityGqlSchema(productivityNode: ProductivityNode): GqlSchema {
  return {
    typeDefs: gql`
      type ProductivityDailyDigest {
        id: ID!
        date: String!
        emailsProcessed: Int!
        repliesSent: Int!
        emailsCleaned: Int!
        minutesSaved: Float!
      }

      type ProductivityDigestPreferences {
        enabled: Boolean!
        channel: String!
        timeOfDay: String!
      }

      input TrackActionOptions {
        kind: String!
        minutesSaved: Float!
        count: Int
        ref: String
      }

      input ListDigestsOptions {
        days: Int
      }

      input UpdateNotificationPreferencesOptions {
        enabled: Boolean
        channel: String
        timeOfDay: String
      }

      type Query {
        getTodayDigest: ProductivityDailyDigest
        listDigests(options: ListDigestsOptions): [ProductivityDailyDigest]
        getNotificationPreferences: ProductivityDigestPreferences
      }

      type Mutation {
        trackAction(options: TrackActionOptions): Boolean
        updateNotificationPreferences(
          options: UpdateNotificationPreferencesOptions
        ): ProductivityDigestPreferences
      }
    `,
    resolvers: {
      Query: {
        getTodayDigest: async (_req: unknown, _args: unknown, context: any) => {
          const user = context.session?.user;
          const digest = await productivityNode.getTodayDigest(user?.id);
          return digest.toObject();
        },

        listDigests: async (
          _req: unknown,
          { options }: { options?: ListDigestsOptions },
          context: any
        ) => {
          const user = context.session?.user;
          const digests = await productivityNode.listDigests(options || {}, user?.id);
          return digests.map((digest) => digest.toObject());
        },

        getNotificationPreferences: async (_req: unknown, _args: unknown, context: any) => {
          const user = context.session?.user;
          const preferences = await productivityNode.getNotificationPreferences(user?.id);
          return preferences.toObject();
        },
      },

      Mutation: {
        trackAction: async (
          _req: unknown,
          { options }: { options?: TrackActionOptions },
          context: any
        ) => {
          if (!options) return false;
          const user = context.session?.user;
          await productivityNode.trackAction(options, user?.id);
          return true;
        },

        updateNotificationPreferences: async (
          _req: unknown,
          { options }: { options?: UpdateNotificationPreferencesOptions },
          context: any
        ) => {
          const user = context.session?.user;
          const preferences = await productivityNode.updateNotificationPreferences(
            options || {},
            user?.id
          );
          return preferences.toObject();
        },
      },
    },
  };
}

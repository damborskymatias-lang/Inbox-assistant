import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { GatedFeature, PlanId } from '@lov/billing.entities.plan';
import type { BillingNode } from './billing.node.runtime.js';
import type { CanUseOptions, ChangePlanOptions } from './billing-types.js';

/**
 * creates the GraphQL schema exposing the billing plan, quota and feature gate API.
 */
export function billingGqlSchema(billingNode: BillingNode): GqlSchema {
  return {
    typeDefs: gql`
      type BillingPlan {
        id: String!
        name: String!
        priceEur: Float!
        interval: String!
        features: [String]
        highlighted: Boolean
      }

      type BillingUserPlan {
        planId: String!
        aiRepliesUsed: Int!
        aiRepliesLimit: Int!
        periodStart: String!
        periodEnd: String!
      }

      type BillingCanUseResult {
        allowed: Boolean!
        reason: String
        remaining: Int
      }

      type BillingConsumeAiReplyResult {
        used: Int!
        limit: Int!
      }

      input BillingCanUseOptions {
        feature: String!
      }

      input BillingChangePlanOptions {
        planId: String!
      }

      type Query {
        getPlan: BillingUserPlan
        listPlans: [BillingPlan]
        canUse(options: BillingCanUseOptions): BillingCanUseResult
      }

      type Mutation {
        consumeAiReply: BillingConsumeAiReplyResult
        changePlan(options: BillingChangePlanOptions): BillingUserPlan
      }
    `,
    resolvers: {
      Query: {
        getPlan: async (_req: unknown, _args: unknown, context: any) => {
          const user = context.session?.user;
          const userPlan = await billingNode.getPlan(user?.id);
          return userPlan.toObject();
        },

        listPlans: async () => {
          const plans = await billingNode.listPlans();
          return plans.map((plan) => plan.toObject());
        },

        canUse: async (_req: unknown, { options }: { options?: CanUseOptions }, context: any) => {
          const user = context.session?.user;
          const feature = (options?.feature || 'unlimitedAiReplies') as GatedFeature;
          return billingNode.canUse(feature, user?.id);
        },
      },

      Mutation: {
        consumeAiReply: async (_req: unknown, _args: unknown, context: any) => {
          const user = context.session?.user;
          return billingNode.consumeAiReply(user?.id);
        },

        changePlan: async (
          _req: unknown,
          { options }: { options?: ChangePlanOptions },
          context: any
        ) => {
          const user = context.session?.user;
          const planId = (options?.planId || 'free') as PlanId;
          const userPlan = await billingNode.changePlan(planId, user?.id);
          return userPlan.toObject();
        },
      },
    },
  };
}

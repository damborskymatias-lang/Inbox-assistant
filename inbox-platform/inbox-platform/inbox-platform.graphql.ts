import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import type { User } from '@lov/inbox-platform.entities.user';
import type { InboxPlatformNode } from './inbox-platform.node.runtime.js';

type LoginWithGoogleOptions = {
  code?: string;
};

type LoginWithPasswordOptions = {
  email?: string;
  password?: string;
};

export function inboxPlatformGqlSchema(inboxPlatform: InboxPlatformNode): GqlSchema {
  return {
    typeDefs: gql`
      type Query {
        getCurrentUser: InboxUser
        getGoogleTokens: InboxGoogleTokens
        listRoutes: [InboxPlatformRoute]
        listNavigationItems: [InboxNavigationItem]
        listDashboardPanels: [InboxDashboardPanel]
        listHeaderActions: [InboxHeaderAction]
        listUserBarMenuItems: [InboxUserBarMenuItem]
      }

      type Mutation {
        loginWithGoogle(options: InboxLoginWithGoogleOptions): InboxAuthPayload
        loginWithPassword(options: InboxLoginWithPasswordOptions): InboxAuthPayload
        logout: Boolean
        registerRoute(options: InboxRegisterRouteOptions): Boolean
        registerNavigationItem(options: InboxRegisterNavigationItemOptions): Boolean
        registerDashboardPanel(options: InboxRegisterDashboardPanelOptions): Boolean
        registerHeaderAction(options: InboxRegisterHeaderActionOptions): Boolean
        registerUserBarMenuItem(options: InboxRegisterUserBarMenuItemOptions): Boolean
      }

      type InboxUser {
        id: ID
        userId: String
        email: String
        name: String
        avatarUrl: String
        createdAt: String
        googleConnected: Boolean
      }

      type InboxGoogleTokens {
        accessToken: String
        refreshToken: String
        expiresAt: String
        scopes: [String]
      }

      type InboxAuthPayload {
        user: InboxUser
        token: String
      }

      type InboxPlatformRoute {
        path: String
        component: String
        protected: Boolean
      }

      type InboxNavigationItem {
        label: String
        href: String
        icon: String
        weight: Int
      }

      type InboxDashboardPanel {
        name: String
        component: String
        weight: Int
        span: String
      }

      type InboxHeaderAction {
        name: String
        component: String
        weight: Int
      }

      type InboxUserBarMenuItem {
        label: String
        href: String
        weight: Int
      }

      input InboxLoginWithGoogleOptions {
        code: String
      }

      input InboxLoginWithPasswordOptions {
        email: String
        password: String
      }

      input InboxPlatformRouteOptions {
        path: String
        component: String
        protected: Boolean
      }

      input InboxRegisterRouteOptions {
        routes: [InboxPlatformRouteOptions]
      }

      input InboxNavigationItemOptions {
        label: String
        href: String
        icon: String
        weight: Int
      }

      input InboxRegisterNavigationItemOptions {
        items: [InboxNavigationItemOptions]
      }

      input InboxDashboardPanelOptions {
        name: String
        component: String
        weight: Int
        span: String
      }

      input InboxRegisterDashboardPanelOptions {
        panels: [InboxDashboardPanelOptions]
      }

      input InboxHeaderActionOptions {
        name: String
        component: String
        weight: Int
      }

      input InboxRegisterHeaderActionOptions {
        actions: [InboxHeaderActionOptions]
      }

      input InboxUserBarMenuItemOptions {
        label: String
        href: String
        weight: Int
      }

      input InboxRegisterUserBarMenuItemOptions {
        items: [InboxUserBarMenuItemOptions]
      }
    `,
    resolvers: {
      Query: {
        getCurrentUser: async (_: any, __: any, context: any) => {
          const user = await inboxPlatform.getCurrentUser(context.session?.userId);
          if (!user) return undefined;
          return serializeUser(user);
        },

        getGoogleTokens: async (_: any, __: any, context: any) => {
          const tokens = await inboxPlatform.getGoogleTokens(context.session?.userId);
          if (!tokens) return undefined;
          return tokens;
        },

        listRoutes: () => {
          return inboxPlatform.listRoutes().map((route) => ({
            path: route.path,
            component: route.component?.name,
            protected: Boolean(route.protected),
          }));
        },

        listNavigationItems: () => {
          return inboxPlatform.listNavigationItems().map((item) => ({
            label: item.label,
            href: item.href,
            icon: item.icon?.name,
            weight: item.weight,
          }));
        },

        listDashboardPanels: () => {
          return inboxPlatform.listDashboardPanels().map((panel) => ({
            name: panel.name,
            component: panel.component?.name,
            weight: panel.weight,
            span: panel.span,
          }));
        },

        listHeaderActions: () => {
          return inboxPlatform.listHeaderActions().map((action) => ({
            name: action.name,
            component: action.component?.name,
            weight: action.weight,
          }));
        },

        listUserBarMenuItems: () => {
          return inboxPlatform.listUserBarMenuItems().map((item) => ({
            label: item.label,
            href: item.href,
            weight: item.weight,
          }));
        },
      },

      Mutation: {
        loginWithGoogle: async (
          _: any,
          { options }: { options?: LoginWithGoogleOptions },
          context: any
        ) => {
          const payload = await inboxPlatform.loginWithGoogle(options?.code);
          await startSession(context, payload.user);

          return {
            user: serializeUser(payload.user),
            token: payload.token,
          };
        },

        loginWithPassword: async (
          _: any,
          { options }: { options?: LoginWithPasswordOptions },
          context: any
        ) => {
          const payload = await inboxPlatform.loginWithPassword(
            options?.email || '',
            options?.password || ''
          );
          await startSession(context, payload.user);

          return {
            user: serializeUser(payload.user),
            token: payload.token,
          };
        },

        logout: async (_: any, __: any, context: any) => {
          await inboxPlatform.logout();
          if (!context.session?.destroy) return true;
          await new Promise<void>((resolve, reject) => {
            context.session.destroy((err: Error) => (err ? reject(err) : resolve()));
          });
          return true;
        },

        registerRoute: (_: any, { options }: any) => {
          if (!options?.routes) return false;
          inboxPlatform.registerRoute(options.routes);
          return true;
        },

        registerNavigationItem: (_: any, { options }: any) => {
          if (!options?.items) return false;
          inboxPlatform.registerNavigationItems(options.items);
          return true;
        },

        registerDashboardPanel: (_: any, { options }: any) => {
          if (!options?.panels) return false;
          inboxPlatform.registerDashboardPanels(options.panels);
          return true;
        },

        registerHeaderAction: (_: any, { options }: any) => {
          if (!options?.actions) return false;
          inboxPlatform.registerHeaderActions(options.actions);
          return true;
        },

        registerUserBarMenuItem: (_: any, { options }: any) => {
          if (!options?.items) return false;
          inboxPlatform.registerUserBarMenuItems(options.items);
          return true;
        },
      },
    },
  };
}

/**
 * serialize a user entity into the InboxUser graphql shape.
 */
function serializeUser(user: User) {
  const plainUser = user.toObject();
  return {
    ...plainUser,
    userId: plainUser.id,
  };
}

/**
 * persist the authenticated user id on the session.
 */
async function startSession(context: any, user: User): Promise<void> {
  if (!context.session) return;
  context.session.userId = user.id;
  if (!context.session.save) return;
  await new Promise<void>((resolve, reject) => {
    context.session.save((err: Error) => (err ? reject(err) : resolve()));
  });
}

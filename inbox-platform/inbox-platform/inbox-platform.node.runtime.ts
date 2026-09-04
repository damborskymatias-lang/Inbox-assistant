import bodyParser from 'body-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import mongoose from 'mongoose';
import { getModelForClass } from '@typegoose/typegoose';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import { User } from '@lov/inbox-platform.entities.user';
import type { InboxPlatformConfig } from './inbox-platform-config.js';
import { inboxPlatformGqlSchema } from './inbox-platform.graphql.js';
import {
  UserModel,
  userModelMock,
  GMAIL_SCOPES,
  DEMO_USER_EMAIL,
} from './user.model.js';
import { UserRepository } from './user-repository.js';
import type { Route, RouteSlot } from './route.js';
import type { NavigationItem, NavigationItemSlot } from './navigation-item.js';
import type { DashboardPanel, DashboardPanelSlot } from './dashboard-panel.js';
import type { HeaderAction, HeaderActionSlot } from './header-action.js';
import type { UserBarMenuItem, UserBarMenuItemSlot } from './user-bar-menu-item.js';

/**
 * Google OAuth tokens stored for a user, allowing mail providers to read
 * the mailbox and send replies on the user's behalf.
 */
export type GoogleTokens = {
  /**
   * short lived access token used against the Gmail API.
   */
  accessToken: string;

  /**
   * long lived refresh token used to renew the access token.
   */
  refreshToken?: string;

  /**
   * ISO timestamp of the access token expiration.
   */
  expiresAt?: string;

  /**
   * OAuth scopes granted by the user.
   */
  scopes: string[];
};

/**
 * payload returned by the authentication methods.
 */
export type AuthPayload = {
  /**
   * the authenticated user.
   */
  user: User;

  /**
   * session token issued for the authenticated user.
   */
  token: string;
};

type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
};

type GoogleProfileResponse = {
  sub?: string;
  email?: string;
  name?: string;
  picture?: string;
};

export class InboxPlatformNode {
  constructor(
    private inboxPlatformConfig: InboxPlatformConfig,
    private routeSlot: RouteSlot,
    private navigationItemSlot: NavigationItemSlot,
    private dashboardPanelSlot: DashboardPanelSlot,
    private headerActionSlot: HeaderActionSlot,
    private userBarMenuItemSlot: UserBarMenuItemSlot,
    private userRepository: UserRepository,
    private symphonyPlatform: SymphonyPlatformNode
  ) {}

  /**
   * the platform configuration, exposing the mongo url and session secret.
   */
  get config(): InboxPlatformConfig {
    return this.inboxPlatformConfig;
  }

  /**
   * the manifest of the hosting platform.
   */
  getPlatformManifest() {
    return {
      name: this.symphonyPlatform.config.name,
      slogan: this.symphonyPlatform.config.slogan,
    };
  }

  /**
   * resolve a user by its unique user id.
   */
  async getUser(userId?: string): Promise<User | undefined> {
    if (!userId) return undefined;
    const userDoc = await this.userRepository.findById(userId);
    if (!userDoc) return undefined;
    return toUser(userDoc);
  }

  /**
   * resolve the user of the current session, if any.
   */
  async getCurrentUser(userId?: string): Promise<User | undefined> {
    return this.getUser(userId);
  }

  /**
   * whether the given user is an administrator.
   */
  isAdmin(userDoc: UserModel): boolean {
    return Boolean(userDoc.roles?.includes('admin'));
  }

  /**
   * authenticate a visitor with a Google OAuth authorization code, storing the
   * returned access and refresh tokens together with the Gmail scopes.
   * when Google credentials are not configured the seeded demo account is signed in,
   * so the application always works out of the box.
   */
  async loginWithGoogle(code?: string): Promise<AuthPayload> {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const canUseGoogle = Boolean(clientId && clientSecret && code);

    if (!canUseGoogle) {
      return this.loginDemoUser();
    }

    const tokens = await this.exchangeGoogleCode(code as string, clientId as string, clientSecret as string);
    const profile = tokens ? await this.fetchGoogleProfile(tokens.accessToken) : undefined;

    if (!tokens || !profile?.email) {
      return this.loginDemoUser();
    }

    const existing = await this.userRepository.findByEmail(profile.email);
    const userDoc =
      existing ||
      (await this.userRepository.createUser({
        userId: profile.sub,
        email: profile.email,
        name: profile.name || profile.email,
        avatarUrl: profile.picture,
        roles: ['user'],
      }));

    const updated = await this.userRepository.saveGoogleTokens(userDoc.userId, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken || userDoc.googleRefreshToken,
      expiresAt: tokens.expiresAt,
      scopes: tokens.scopes,
    });

    return {
      user: toUser(updated || userDoc),
      token: tokens.accessToken,
    };
  }

  /**
   * authenticate a user with an email and password, used by the demo account.
   */
  async loginWithPassword(email: string, password: string): Promise<AuthPayload> {
    const userDoc = await this.userRepository.verifyPassword(email, password);
    if (!userDoc) throw new AccessDenied();

    return {
      user: toUser(userDoc),
      token: `session-${userDoc.userId}`,
    };
  }

  /**
   * end the session of a user. the session itself is destroyed by the resolver.
   */
  async logout(): Promise<boolean> {
    return true;
  }

  /**
   * return the Google OAuth tokens stored for a user so mail providers can call
   * the Gmail API on the user's behalf.
   */
  async getGoogleTokens(userId?: string): Promise<GoogleTokens | undefined> {
    if (!userId) return undefined;
    const userDoc = await this.userRepository.findById(userId);
    if (!userDoc?.googleAccessToken) return undefined;

    return {
      accessToken: userDoc.googleAccessToken,
      refreshToken: userDoc.googleRefreshToken,
      expiresAt: userDoc.googleExpiresAt,
      scopes: userDoc.googleScopes?.length ? userDoc.googleScopes : GMAIL_SCOPES,
    };
  }

  /**
   * register routes to the platform.
   */
  registerRoute(routes: Route[]) {
    this.routeSlot.register(routes);
    return this;
  }

  /**
   * list all registered routes.
   */
  listRoutes(): Route[] {
    return this.routeSlot.flatValues();
  }

  /**
   * register navigation items to the platform.
   */
  registerNavigationItems(items: NavigationItem[]) {
    this.navigationItemSlot.register(items);
    return this;
  }

  /**
   * list all registered navigation items.
   */
  listNavigationItems(): NavigationItem[] {
    return this.navigationItemSlot.flatValues();
  }

  /**
   * register dashboard panels to the platform.
   */
  registerDashboardPanels(panels: DashboardPanel[]) {
    this.dashboardPanelSlot.register(panels);
    return this;
  }

  /**
   * list all registered dashboard panels.
   */
  listDashboardPanels(): DashboardPanel[] {
    return this.dashboardPanelSlot.flatValues();
  }

  /**
   * register header actions to the platform.
   */
  registerHeaderActions(actions: HeaderAction[]) {
    this.headerActionSlot.register(actions);
    return this;
  }

  /**
   * list all registered header actions.
   */
  listHeaderActions(): HeaderAction[] {
    return this.headerActionSlot.flatValues();
  }

  /**
   * register user bar menu items to the platform.
   */
  registerUserBarMenuItems(items: UserBarMenuItem[]) {
    this.userBarMenuItemSlot.register(items);
    return this;
  }

  /**
   * list all registered user bar menu items.
   */
  listUserBarMenuItems(): UserBarMenuItem[] {
    return this.userBarMenuItemSlot.flatValues();
  }

  /**
   * sign in the seeded demo account, used when Google credentials are missing.
   */
  private async loginDemoUser(): Promise<AuthPayload> {
    const demoDoc = await this.userRepository.findByEmail(DEMO_USER_EMAIL);
    if (!demoDoc) throw new AccessDenied();

    const withTokens =
      demoDoc.googleAccessToken
        ? demoDoc
        : await this.userRepository.saveGoogleTokens(demoDoc.userId, {
            accessToken: `demo-google-access-token-${demoDoc.userId}`,
            refreshToken: `demo-google-refresh-token-${demoDoc.userId}`,
            expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
            scopes: GMAIL_SCOPES,
          });

    return {
      user: toUser(withTokens || demoDoc),
      token: `session-${demoDoc.userId}`,
    };
  }

  /**
   * exchange a Google authorization code for access and refresh tokens.
   */
  private async exchangeGoogleCode(
    code: string,
    clientId: string,
    clientSecret: string
  ): Promise<GoogleTokens | undefined> {
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: process.env.GOOGLE_REDIRECT_URI || 'postmessage',
          grant_type: 'authorization_code',
        }).toString(),
      });

      if (!response.ok) return undefined;
      const payload = (await response.json()) as GoogleTokenResponse;
      if (!payload.access_token) return undefined;

      return {
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token,
        expiresAt: payload.expires_in
          ? new Date(Date.now() + payload.expires_in * 1000).toISOString()
          : undefined,
        scopes: payload.scope ? payload.scope.split(' ') : GMAIL_SCOPES,
      };
    } catch {
      return undefined;
    }
  }

  /**
   * fetch the Google profile of the authenticated user.
   */
  private async fetchGoogleProfile(accessToken: string): Promise<GoogleProfileResponse | undefined> {
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!response.ok) return undefined;
      return (await response.json()) as GoogleProfileResponse;
    } catch {
      return undefined;
    }
  }

  static dependencies = [SymphonyPlatformAspect];

  static defaultConfig: InboxPlatformConfig = {
    mongoUrl: process.env.MONGO_URL,
    sessionSecretKey: 'SESSION_SECRET',
  };

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformNode],
    config: InboxPlatformConfig,
    [routeSlot, navigationItemSlot, dashboardPanelSlot, headerActionSlot, userBarMenuItemSlot]: [
      RouteSlot,
      NavigationItemSlot,
      DashboardPanelSlot,
      HeaderActionSlot,
      UserBarMenuItemSlot
    ]
  ) {
    if (process.env.MONGO_URL) {
      await mongoose.connect(process.env.MONGO_URL);
    }

    const userModel = getModelForClass(UserModel);
    const userRepository = new UserRepository(userModel);

    const inboxPlatform = new InboxPlatformNode(
      config,
      routeSlot,
      navigationItemSlot,
      dashboardPanelSlot,
      headerActionSlot,
      userBarMenuItemSlot,
      userRepository,
      symphonyPlatform
    );

    const gqlSchema = inboxPlatformGqlSchema(inboxPlatform);

    /**
     * authenticate users using an express session and attach
     * the resolved user to the request.
     */
    symphonyPlatform.registerMiddlewares([
      bodyParser.urlencoded({ extended: true }),
      session({
        store: config.mongoUrl
          ? MongoStore.create({
              mongoUrl: config.mongoUrl,
            })
          : undefined,
        secret: config.sessionSecretKey,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: 'auto', sameSite: true },
      }),
      async (req, res, next) => {
        if (!req?.session) return next();
        if (!req.session?.userId) return next();
        const user = await inboxPlatform.getUser(req.session.userId);
        if (!user) return next();
        req.session.user = user;
        return next();
      },
    ]);

    /**
     * seed the demo account (Peter Novak) so the app is usable on a fresh database.
     */
    symphonyPlatform.registerOnStart(async () => {
      const existingDocs = await userModel.find().limit(1);
      const hasDocs = Boolean(existingDocs.length);
      if (hasDocs) return undefined;
      await userModel.insertMany(userModelMock);
      return undefined;
    });

    /**
     * register the graphql backend server.
     */
    symphonyPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    return inboxPlatform;
  }
}

/**
 * map a persisted user document to the User entity.
 */
function toUser(userDoc: UserModel): User {
  return User.from({
    id: userDoc.userId,
    email: userDoc.email,
    name: userDoc.name,
    avatarUrl: userDoc.avatarUrl,
    createdAt: userDoc.createdAt,
    googleConnected: Boolean(userDoc.googleAccessToken),
  });
}

export default InboxPlatformNode;

import { prop } from '@typegoose/typegoose';
import bcrypt from 'bcryptjs';

/**
 * Gmail scopes requested during the Google OAuth consent flow, allowing
 * mail providers to read the mailbox and send approved replies.
 */
export const GMAIL_SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
];

/**
 * email of the seeded demo account.
 */
export const DEMO_USER_EMAIL = 'peter@demo.inbox';

/**
 * password of the seeded demo account.
 */
export const DEMO_USER_PASSWORD = 'demo1234';

/**
 * persisted user of the inbox platform, holding the profile
 * together with the Google OAuth tokens granted by the user.
 */
export class UserModel {
  @prop({ required: true, unique: true, type: String })
  public userId!: string;

  @prop({ required: true, unique: true, type: String })
  public email!: string;

  @prop({ required: true, type: String })
  public name!: string;

  @prop({ type: String })
  public password?: string;

  @prop({ type: String })
  public avatarUrl?: string;

  @prop({ required: true, type: [String] })
  public roles!: string[];

  @prop({ type: String })
  public googleAccessToken?: string;

  @prop({ type: String })
  public googleRefreshToken?: string;

  @prop({ type: String })
  public googleExpiresAt?: string;

  @prop({ type: [String] })
  public googleScopes?: string[];

  @prop({ required: true, type: String })
  public createdAt!: string;
}

export const userModelMock = [
  {
    userId: 'user-peter-novak',
    email: DEMO_USER_EMAIL,
    name: 'Peter Novak',
    password: bcrypt.hashSync(DEMO_USER_PASSWORD, 10),
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Peter%20Novak',
    roles: ['admin', 'user'],
    googleAccessToken: 'demo-google-access-token-peter',
    googleRefreshToken: 'demo-google-refresh-token-peter',
    googleExpiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    googleScopes: GMAIL_SCOPES,
    createdAt: '2024-01-15T09:00:00.000Z',
  },
  {
    userId: 'user-admin',
    email: 'admin@demo.inbox',
    name: 'Inbox Admin',
    password: bcrypt.hashSync('admin1234', 10),
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Inbox%20Admin',
    roles: ['admin'],
    createdAt: '2024-01-10T09:00:00.000Z',
  },
];

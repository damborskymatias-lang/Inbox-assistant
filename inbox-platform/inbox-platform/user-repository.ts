import bcrypt from 'bcryptjs';
import { ReturnModelType } from '@typegoose/typegoose';
import { UserModel } from './user.model.js';

export type CreateUserProps = {
  /**
   * unique identifier of the user, generated when not provided.
   */
  userId?: string;

  /**
   * email address of the user.
   */
  email: string;

  /**
   * display name of the user.
   */
  name: string;

  /**
   * plain password, hashed before it is persisted.
   */
  password?: string;

  /**
   * url of the avatar image.
   */
  avatarUrl?: string;

  /**
   * roles granted to the user.
   */
  roles?: string[];
};

export type GoogleTokensProps = {
  /**
   * short lived access token used to call the Gmail API.
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
  scopes?: string[];
};

/**
 * data access layer for platform users, wrapping the typegoose user model.
 */
export class UserRepository {
  constructor(private userModel: ReturnModelType<typeof UserModel>) {}

  /**
   * find a user by its unique user id.
   */
  async findById(userId: string): Promise<UserModel | undefined> {
    const user = await this.userModel.findOne({ userId });
    return user?.toObject();
  }

  /**
   * find a user by its email address.
   */
  async findByEmail(email: string): Promise<UserModel | undefined> {
    const user = await this.userModel.findOne({ email });
    return user?.toObject();
  }

  /**
   * create a new user, hashing the password when one is given.
   */
  async createUser(options: CreateUserProps): Promise<UserModel> {
    const userId = options.userId || crypto.randomUUID();
    const password = options.password ? await bcrypt.hash(options.password, 10) : undefined;

    const user = await this.userModel.create({
      userId,
      email: options.email,
      name: options.name,
      password,
      avatarUrl: options.avatarUrl,
      roles: options.roles || ['user'],
      createdAt: new Date().toISOString(),
    });

    return user.toObject();
  }

  /**
   * verify a password against the stored hash.
   */
  async verifyPassword(email: string, password: string): Promise<UserModel | undefined> {
    if (!email || !password) return undefined;
    const user = await this.userModel.findOne({ email });
    if (!user?.password) return undefined;
    const matches = await bcrypt.compare(password, user.password);
    if (!matches) return undefined;
    return user.toObject();
  }

  /**
   * persist the Google OAuth tokens granted by a user, so mail providers
   * can act on their behalf.
   */
  async saveGoogleTokens(userId: string, tokens: GoogleTokensProps): Promise<UserModel | undefined> {
    const user = await this.userModel.findOneAndUpdate(
      { userId },
      {
        googleAccessToken: tokens.accessToken,
        googleRefreshToken: tokens.refreshToken,
        googleExpiresAt: tokens.expiresAt,
        googleScopes: tokens.scopes,
      },
      { new: true }
    );

    return user?.toObject();
  }
}

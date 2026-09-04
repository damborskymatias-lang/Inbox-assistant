/**
 * Plain, serializable representation of a User.
 */
export type PlainUser = {
  /**
   * unique identifier of the user.
   */
  id: string;

  /**
   * email address of the user.
   */
  email: string;

  /**
   * display name of the user.
   */
  name: string;

  /**
   * url of the user's avatar image.
   */
  avatarUrl?: string;

  /**
   * ISO timestamp of when the user was created.
   */
  createdAt: string;

  /**
   * whether the user has granted access to their Gmail account.
   */
  googleConnected?: boolean;
};

/**
 * User entity for the inbox platform.
 * Represents an authenticated account, its profile info and
 * whether Gmail access has been granted.
 */
export class User {
  constructor(
    /**
     * unique identifier of the user.
     */
    readonly id: string,

    /**
     * email address of the user.
     */
    readonly email: string,

    /**
     * display name of the user.
     */
    readonly name: string,

    /**
     * ISO timestamp of when the user was created.
     */
    readonly createdAt: string,

    /**
     * url of the user's avatar image.
     */
    readonly avatarUrl?: string,

    /**
     * whether the user has granted access to their Gmail account.
     */
    readonly googleConnected?: boolean
  ) {}

  /**
   * serialize the User into a plain object.
   */
  toObject(): PlainUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt,
      googleConnected: this.googleConnected,
    };
  }

  /**
   * create a User instance from a plain object.
   */
  static from(plainUser: PlainUser): User {
    const {
      id = '',
      email = '',
      name = '',
      avatarUrl = undefined,
      createdAt = new Date().toISOString(),
      googleConnected = undefined,
    } = plainUser || {};

    return new User(id, email, name, createdAt, avatarUrl, googleConnected);
  }
}

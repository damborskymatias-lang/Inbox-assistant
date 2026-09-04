import { prop } from '@typegoose/typegoose';

/**
 * default delivery channel of the daily digest notification.
 */
export const DEFAULT_DIGEST_CHANNEL = 'email';

/**
 * default time of day (HH:mm, 24h) the daily digest is delivered.
 */
export const DEFAULT_DIGEST_TIME_OF_DAY = '08:00';

/**
 * persisted notification preferences controlling when and how the
 * daily digest is delivered to a user.
 */
export class DigestPreferencesModel {
  @prop({ required: true, unique: true, type: String })
  public id!: string;

  @prop({ required: true, unique: true, type: String })
  public userId!: string;

  @prop({ required: true, default: true, type: Boolean })
  public enabled!: boolean;

  @prop({ required: true, default: DEFAULT_DIGEST_CHANNEL, type: String })
  public channel!: string;

  @prop({ required: true, default: DEFAULT_DIGEST_TIME_OF_DAY, type: String })
  public timeOfDay!: string;
}

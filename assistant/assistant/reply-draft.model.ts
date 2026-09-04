import { prop } from '@typegoose/typegoose';

/**
 * persisted AI generated reply draft, linking an email and a user
 * to the generated body until it is sent.
 * Kept in the aspect's node runtime (not the entity component) so the
 * mongoose/typegoose dependency never reaches the browser bundle.
 */
export class ReplyDraftModel {
  @prop({ required: true, unique: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public emailId!: string;

  @prop({ required: true, type: String })
  public userId!: string;

  @prop({ required: true, type: String })
  public body!: string;

  @prop({ required: true, type: String })
  public tone!: string;

  @prop({ required: true, type: String })
  public generatedAt!: string;

  @prop({ required: true, type: Boolean })
  public sent!: boolean;
}

/**
 * persisted writing style preferences for a user, applied when
 * generating new reply drafts.
 */
export class WritingStyleModel {
  @prop({ required: true, unique: true, type: String })
  public userId!: string;

  @prop({ required: true, type: String })
  public tone!: string;

  @prop({ required: true, type: String })
  public length!: string;

  @prop({ required: true, type: String })
  public signOff!: string;
}

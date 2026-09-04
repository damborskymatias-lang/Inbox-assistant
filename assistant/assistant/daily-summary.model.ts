import { prop } from '@typegoose/typegoose';
import type { SuggestedAction } from '@lov/assistant.entities.daily-summary';

/**
 * Typegoose model of a persisted DailySummary document.
 * Kept in the aspect's node runtime (not the entity component) so the
 * mongoose/typegoose dependency never reaches the browser bundle.
 */
export class DailySummaryModel {
  @prop({ required: true, unique: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public userId!: string;

  @prop({ required: true, type: String })
  public date!: string;

  @prop({ required: true, type: Number })
  public totalNew!: number;

  @prop({ required: true, type: String })
  public greeting!: string;

  @prop({ required: true, type: [String] })
  public highlights!: string[];

  @prop({ required: true, type: () => [Object] })
  public suggestedActions!: SuggestedAction[];
}

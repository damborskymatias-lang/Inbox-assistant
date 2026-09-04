import { prop } from '@typegoose/typegoose';
import { mockEmails } from '@lov/mail.entities.email';

/**
 * typegoose model persisting a single synced email.
 */
export class EmailModel {
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  @prop({ required: true, type: String })
  public gmailId!: string;

  @prop({ type: String })
  public threadId?: string;

  @prop({ required: true, type: String })
  public sender!: string;

  @prop({ required: true, type: String })
  public senderEmail!: string;

  @prop({ required: true, type: String })
  public subject!: string;

  @prop({ required: true, type: String })
  public body!: string;

  @prop({ required: true, type: String })
  public snippet!: string;

  @prop({ type: String })
  public summary?: string;

  @prop({ type: String })
  public category?: string;

  @prop({ type: Number })
  public importance?: number;

  @prop({ type: Boolean, default: false })
  public needsReply?: boolean;

  @prop({ type: Boolean, default: false })
  public replyGenerated?: boolean;

  @prop({ required: true, type: String })
  public bucket!: string;

  @prop({ required: true, type: String })
  public receivedAt!: string;

  @prop({ required: true, type: Boolean, default: false })
  public read!: boolean;

  @prop({ required: true, type: Boolean, default: false })
  public archived!: boolean;
}

/**
 * demo emails seeded on start, mirroring the inbox prototype. built from the
 * email entity mocks so the demo account always has a realistic inbox.
 */
export const emailModelMock: EmailModel[] = mockEmails().map((email) => {
  const plain = email.toObject();

  return {
    id: plain.id,
    gmailId: plain.gmailId,
    threadId: plain.threadId,
    sender: plain.sender,
    senderEmail: plain.senderEmail,
    subject: plain.subject,
    body: plain.body,
    snippet: plain.snippet,
    summary: plain.summary,
    category: plain.category,
    importance: plain.importance,
    needsReply: plain.needsReply,
    replyGenerated: plain.replyGenerated,
    bucket: plain.bucket,
    receivedAt: plain.receivedAt,
    read: plain.read,
    archived: plain.archived,
  };
});

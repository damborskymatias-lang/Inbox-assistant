import { ReplyDraft, WritingStyle, DEFAULT_WRITING_STYLE } from './reply-draft.js';
import { mockReplyDraft, mockReplyDrafts, mockWritingStyle } from './reply-draft.mock.js';

it('has a ReplyDraft.from() method', () => {
  expect(ReplyDraft.from).toBeTruthy();
});

it('creates a ReplyDraft instance from a plain object', () => {
  const draft = ReplyDraft.from({
    id: 'r1',
    emailId: 'e1',
    userId: 'u1',
    body: 'Hi there',
    tone: 'friendly',
    generatedAt: '2024-01-15T08:20:00.000Z',
    sent: false,
  });

  expect(draft).toBeInstanceOf(ReplyDraft);
  expect(draft.id).toEqual('r1');
  expect(draft.emailId).toEqual('e1');
  expect(draft.userId).toEqual('u1');
  expect(draft.body).toEqual('Hi there');
  expect(draft.tone).toEqual('friendly');
  expect(draft.sent).toEqual(false);
});

it('serializes a ReplyDraft into a plain object with toObject()', () => {
  const draft = mockReplyDraft();
  const plainDraft = draft.toObject();

  expect(plainDraft).toEqual({
    id: draft.id,
    emailId: draft.emailId,
    userId: draft.userId,
    body: draft.body,
    tone: draft.tone,
    generatedAt: draft.generatedAt,
    sent: draft.sent,
  });
});

it('round-trips a ReplyDraft through toObject() and from()', () => {
  const original = mockReplyDraft();
  const restored = ReplyDraft.from(original.toObject());

  expect(restored).toEqual(original);
});

it('defaults missing properties safely when deserializing', () => {
  const draft = ReplyDraft.from({});

  expect(draft.id).toEqual('');
  expect(draft.emailId).toEqual('');
  expect(draft.userId).toEqual('');
  expect(draft.body).toEqual('');
  expect(draft.sent).toEqual(false);
  expect(typeof draft.generatedAt).toEqual('string');
});

it('provides a mock reply draft representing the reply to John', () => {
  const draft = mockReplyDraft();

  expect(draft.emailId).toEqual('e1');
  expect(draft.body).toContain('Hi John');
  expect(draft.body).toContain("I'll send you the project update tomorrow morning");
});

it('supports partial overrides on the mock reply draft', () => {
  const draft = mockReplyDraft({ sent: true, tone: 'formal' });

  expect(draft.sent).toEqual(true);
  expect(draft.tone).toEqual('formal');
  expect(draft.emailId).toEqual('e1');
});

it('provides a list of mock reply drafts', () => {
  const drafts = mockReplyDrafts();

  expect(drafts.length).toBeGreaterThan(1);
  drafts.forEach((draft) => expect(draft).toBeInstanceOf(ReplyDraft));
});

it('has a WritingStyle.default() method returning the default style', () => {
  const style = WritingStyle.default();

  expect(style).toBeInstanceOf(WritingStyle);
  expect(style.toObject()).toEqual(DEFAULT_WRITING_STYLE);
});

it('falls back to default writing style values when deserializing partial data', () => {
  const style = WritingStyle.from({ tone: 'concise' });

  expect(style.tone).toEqual('concise');
  expect(style.length).toEqual(DEFAULT_WRITING_STYLE.length);
  expect(style.signOff).toEqual(DEFAULT_WRITING_STYLE.signOff);
});

it('provides a mock writing style with partial overrides', () => {
  const style = mockWritingStyle({ tone: 'formal' });

  expect(style.tone).toEqual('formal');
  expect(style.length).toEqual('medium');
});

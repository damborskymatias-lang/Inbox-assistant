import { Email, deriveBucket } from './email.js';
import { mockEmail, mockEmails } from './email.mock.js';

it('has an Email.from() method', () => {
  expect(Email.from).toBeTruthy();
});

it('creates an Email from a plain object', () => {
  const email = Email.from({
    gmailId: 'gmail-1',
    sender: 'Jane Doe',
    senderEmail: 'jane@example.com',
    subject: 'Hi there',
    body: 'Hello world',
  });

  expect(email.id).toEqual('gmail-1');
  expect(email.sender).toEqual('Jane Doe');
  expect(email.subject).toEqual('Hi there');
});

it('serializes an Email into a plain object with toObject()', () => {
  const email = mockEmail({ id: 'e-123', sender: 'John Smith' });
  const plain = email.toObject();

  expect(plain.id).toEqual('e-123');
  expect(plain.sender).toEqual('John Smith');
  expect(plain).toHaveProperty('bucket');
  expect(plain).toHaveProperty('receivedAt');
});

describe('deriveBucket()', () => {
  it('returns "promotions" for marketing category regardless of importance', () => {
    expect(deriveBucket({ category: 'marketing', importance: 9, needsReply: true })).toEqual('promotions');
  });

  it('returns "urgent" when importance is 8 or higher', () => {
    expect(deriveBucket({ importance: 8 })).toEqual('urgent');
    expect(deriveBucket({ importance: 10 })).toEqual('urgent');
  });

  it('returns "needsReply" when needsReply is true and importance is below 8', () => {
    expect(deriveBucket({ importance: 5, needsReply: true })).toEqual('needsReply');
  });

  it('returns "fyi" as the default bucket', () => {
    expect(deriveBucket({ importance: 3, needsReply: false })).toEqual('fyi');
  });
});

describe('mockEmails()', () => {
  it('returns a rich set of ~15 mock emails', () => {
    const emails = mockEmails();
    expect(emails.length).toBeGreaterThanOrEqual(15);
  });

  it('includes emails across all triage buckets', () => {
    const buckets = new Set(mockEmails().map((email) => email.bucket));
    expect(buckets.has('urgent')).toBe(true);
    expect(buckets.has('needsReply')).toBe(true);
    expect(buckets.has('fyi')).toBe(true);
    expect(buckets.has('promotions')).toBe(true);
  });
});

describe('mockEmail()', () => {
  it('supports partial overrides', () => {
    const email = mockEmail({ subject: 'Custom subject' });
    expect(email.subject).toEqual('Custom subject');
  });
});

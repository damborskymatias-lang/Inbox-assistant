import { DailyDigest, TrackedAction, DigestPreferences, DEFAULT_MINUTES_SAVED } from './daily-digest.js';
import { mockDailyDigest, mockWeeklyDigests } from './daily-digest.mock.js';

it('has a DailyDigest.from() method', () => {
  expect(DailyDigest.from).toBeTruthy();
});

it('creates a DailyDigest instance from a plain object', () => {
  const digest = DailyDigest.from({
    id: 'd1',
    userId: 'user-peter-novak',
    date: '2024-01-15',
    emailsProcessed: 38,
    repliesSent: 4,
    emailsCleaned: 42,
    minutesSaved: 34.4,
  });

  expect(digest).toBeInstanceOf(DailyDigest);
  expect(digest.id).toEqual('d1');
  expect(digest.userId).toEqual('user-peter-novak');
  expect(digest.minutesSaved).toEqual(34.4);
});

it('serializes a DailyDigest into a plain object with toObject()', () => {
  const digest = mockDailyDigest();
  const plainDigest = digest.toObject();

  expect(plainDigest).toEqual({
    id: digest.id,
    userId: digest.userId,
    date: digest.date,
    emailsProcessed: digest.emailsProcessed,
    repliesSent: digest.repliesSent,
    emailsCleaned: digest.emailsCleaned,
    minutesSaved: digest.minutesSaved,
  });
});

it('round-trips a DailyDigest through toObject() and from()', () => {
  const original = mockDailyDigest();
  const restored = DailyDigest.from(original.toObject());

  expect(restored).toEqual(original);
});

it('defaults missing properties safely when deserializing', () => {
  // @ts-expect-error - testing defensive defaults for malformed input
  const digest = DailyDigest.from({});

  expect(digest.id).toEqual('');
  expect(digest.userId).toEqual('');
  expect(digest.emailsProcessed).toEqual(0);
  expect(digest.repliesSent).toEqual(0);
  expect(digest.emailsCleaned).toEqual(0);
  expect(digest.minutesSaved).toEqual(0);
  expect(typeof digest.date).toEqual('string');
});

it('supports partial overrides on the mock digest', () => {
  const digest = mockDailyDigest({ emailsProcessed: 10, minutesSaved: 5 });

  expect(digest.emailsProcessed).toEqual(10);
  expect(digest.minutesSaved).toEqual(5);
  expect(digest.userId).toEqual('user-peter-novak');
});

it('provides a week of mock digests for the trend chart', () => {
  const digests = mockWeeklyDigests();

  expect(digests).toHaveLength(7);
  digests.forEach((digest) => {
    expect(digest).toBeInstanceOf(DailyDigest);
  });

  // dates should be in ascending order (oldest to newest)
  const dates = digests.map((digest) => digest.date);
  const sortedDates = [...dates].sort();
  expect(dates).toEqual(sortedDates);
});

describe('TrackedAction', () => {
  it('has default minutes saved per action kind', () => {
    expect(DEFAULT_MINUTES_SAVED.reply_sent).toEqual(4);
    expect(DEFAULT_MINUTES_SAVED.cleanup).toEqual(0.2);
    expect(DEFAULT_MINUTES_SAVED.triage).toEqual(0.5);
    expect(DEFAULT_MINUTES_SAVED.summary_read).toEqual(6);
  });

  it('computes default minutes saved for a flat action kind', () => {
    expect(TrackedAction.defaultMinutesSaved('reply_sent')).toEqual(4);
    expect(TrackedAction.defaultMinutesSaved('summary_read')).toEqual(6);
  });

  it('computes default minutes saved per email for cleanup actions', () => {
    expect(TrackedAction.defaultMinutesSaved('cleanup', 10)).toEqual(2);
  });

  it('creates a TrackedAction instance from a plain object', () => {
    const action = TrackedAction.from({
      kind: 'reply_sent',
      minutesSaved: 4,
      occurredAt: '2024-01-15T09:00:00.000Z',
    });

    expect(action).toBeInstanceOf(TrackedAction);
    expect(action.kind).toEqual('reply_sent');
    expect(action.minutesSaved).toEqual(4);
  });

  it('round-trips a TrackedAction through toObject() and from()', () => {
    const original = TrackedAction.from({
      kind: 'cleanup',
      count: 42,
      minutesSaved: 8.4,
      occurredAt: '2024-01-15T09:00:00.000Z',
    });
    const restored = TrackedAction.from(original.toObject());

    expect(restored).toEqual(original);
  });
});

describe('DigestPreferences', () => {
  it('creates a DigestPreferences instance with defaults', () => {
    // @ts-expect-error - testing defensive defaults for malformed input
    const preferences = DigestPreferences.from({});

    expect(preferences.enabled).toEqual(true);
    expect(preferences.channel).toEqual('email');
    expect(preferences.timeOfDay).toEqual('08:00');
  });

  it('round-trips a DigestPreferences through toObject() and from()', () => {
    const original = DigestPreferences.from({
      enabled: false,
      channel: 'push',
      timeOfDay: '18:30',
    });
    const restored = DigestPreferences.from(original.toObject());

    expect(restored).toEqual(original);
  });
});

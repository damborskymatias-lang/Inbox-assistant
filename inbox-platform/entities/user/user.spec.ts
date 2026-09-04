import { User } from './user.js';
import { mockUser } from './user.mock.js';

it('has a User.from() method', () => {
  expect(User.from).toBeTruthy();
});

it('creates a User instance from a plain object', () => {
  const user = User.from({
    id: 'u1',
    email: 'peter@demo.inbox',
    name: 'Peter Novak',
    createdAt: '2024-01-15T09:00:00.000Z',
    googleConnected: true,
  });

  expect(user).toBeInstanceOf(User);
  expect(user.id).toEqual('u1');
  expect(user.email).toEqual('peter@demo.inbox');
  expect(user.name).toEqual('Peter Novak');
  expect(user.googleConnected).toEqual(true);
});

it('serializes a User into a plain object with toObject()', () => {
  const user = mockUser();
  const plainUser = user.toObject();

  expect(plainUser).toEqual({
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    createdAt: user.createdAt,
    googleConnected: user.googleConnected,
  });
});

it('round-trips a User through toObject() and from()', () => {
  const original = mockUser();
  const restored = User.from(original.toObject());

  expect(restored).toEqual(original);
});

it('provides a mock user representing Peter Novak', () => {
  const user = mockUser();

  expect(user.name).toEqual('Peter Novak');
  expect(user.email).toEqual('peter@demo.inbox');
  expect(user.googleConnected).toEqual(true);
});

it('supports partial overrides on the mock user', () => {
  const user = mockUser({ name: 'Jane Doe', googleConnected: false });

  expect(user.name).toEqual('Jane Doe');
  expect(user.googleConnected).toEqual(false);
  expect(user.email).toEqual('peter@demo.inbox');
});

it('defaults missing properties safely when deserializing', () => {
  // @ts-expect-error - testing defensive defaults for malformed input
  const user = User.from({});

  expect(user.id).toEqual('');
  expect(user.email).toEqual('');
  expect(user.name).toEqual('');
  expect(typeof user.createdAt).toEqual('string');
});

import { User } from './user.js';
import type { PlainUser } from './user.js';

/**
 * mock user used for compositions and tests.
 * represents Peter Novak, a demo account with Gmail already connected.
 */
export function mockUser(overrides: Partial<PlainUser> = {}): User {
  return User.from({
    id: 'user-peter-novak',
    email: 'peter@demo.inbox',
    name: 'Peter Novak',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Peter%20Novak',
    createdAt: '2024-01-15T09:00:00.000Z',
    googleConnected: true,
    ...overrides,
  });
}

import { MemoryRouter } from 'react-router-dom';
import { InboxPrototype } from './inbox-prototype.js';

export const SignIn = () => (
  <MemoryRouter initialEntries={['/']}>
    <InboxPrototype />
  </MemoryRouter>
);

export const Dashboard = () => (
  <MemoryRouter initialEntries={['/dashboard']}>
    <InboxPrototype />
  </MemoryRouter>
);

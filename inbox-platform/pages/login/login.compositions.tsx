import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { Login } from './login.js';

export const BasicLogin = () => {
  return (
    <MockProvider>
      <Login mockUser={mockUser()} />
    </MockProvider>
  );
};

export const LoginWithCustomDemoAccount = () => {
  return (
    <MockProvider>
      <Login
        mockUser={mockUser()}
        demoEmail="priya@demo.inbox"
        demoPassword="priya-demo-pass"
      />
    </MockProvider>
  );
};

export const LoginWithCustomRedirect = () => {
  return (
    <MockProvider>
      <Login mockUser={mockUser()} redirectPath="/dashboard/urgent" />
    </MockProvider>
  );
};

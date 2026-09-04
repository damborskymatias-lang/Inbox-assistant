import React from 'react';
import { useLocation } from 'react-router-dom';
import { MockProvider } from './mock-provider.js';
import { useIsMock } from './use-is-mock.js';

function CurrentRoute() {
  const location = useLocation();
  return <span>Current route: {location.pathname}</span>;
}

function MockStatus() {
  const isMock = useIsMock();
  return <span>Running in mock context: {isMock ? 'yes' : 'no'}</span>;
}

export const BasicMockProvider = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        <h3>Hello from the inbox mock provider!</h3>
        <MockStatus />
      </div>
    </MockProvider>
  );
};

export const MockProviderWithInitialRoute = () => {
  return (
    <MockProvider initialEntries={['/dashboard/urgent']}>
      <div style={{ padding: '1.5rem' }}>
        <h3>Composition rendered with an initial route</h3>
        <CurrentRoute />
      </div>
    </MockProvider>
  );
};

export const MockProviderWithGraphqlMocks = () => {
  return (
    <MockProvider mocks={[]}>
      <div style={{ padding: '1.5rem' }}>
        <h3>Composition ready for Apollo mocked queries</h3>
        <p>Pass a mocks array of MockedResponse objects to simulate GraphQL data.</p>
      </div>
    </MockProvider>
  );
};

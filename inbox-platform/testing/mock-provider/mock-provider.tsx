import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import type { MockedResponse } from '@apollo/client/testing';
import { InboxTheme } from '@lov/design.inbox-theme';
import { MockContext } from './mock-provider-context.js';

export type MockProviderProps = {
  /**
   * the component tree to render within the mocked app context.
   */
  children?: ReactNode;

  /**
   * graphql mocked responses to provide to the Apollo MockedProvider.
   */
  mocks?: MockedResponse[];

  /**
   * initial route entries for the MemoryRouter.
   */
  initialEntries?: string[];
};

/**
 * a testing provider composing a MemoryRouter, Apollo MockedProvider and the
 * inbox theme, so every component composition and test renders in a
 * realistic app context.
 */
export function MockProvider({ children, mocks, initialEntries }: MockProviderProps) {
  return (
    <MockContext.Provider value>
      <MemoryRouter initialEntries={initialEntries || ['/']}>
        <InboxTheme>
          <MockedProvider mocks={mocks} showWarnings={false}>
            {children}
          </MockedProvider>
        </InboxTheme>
      </MemoryRouter>
    </MockContext.Provider>
  );
}

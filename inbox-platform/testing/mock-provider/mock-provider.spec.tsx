import React from 'react';
import { render } from '@testing-library/react';
import {
  BasicMockProvider,
  MockProviderWithInitialRoute,
} from './mock-provider.compositions.js';
import { MockProvider } from './mock-provider.js';
import { useIsMock } from './use-is-mock.js';

function IsMockLabel() {
  const isMock = useIsMock();
  return <span className="is-mock-label">{isMock ? 'yes' : 'no'}</span>;
}

describe('MockProvider', () => {
  it('renders the children passed to it', () => {
    const { container } = render(<BasicMockProvider />);
    const heading = container.querySelector('h3');

    expect(heading?.textContent).toBe('Hello from the inbox mock provider!');
  });

  it('renders children within the memory router at the provided initial route', () => {
    const { container } = render(<MockProviderWithInitialRoute />);
    const routeLabel = container.querySelector('span');

    expect(routeLabel?.textContent).toContain('/dashboard/urgent');
  });

  it('exposes a mock context that useIsMock reads as true', () => {
    const { container } = render(
      <MockProvider>
        <IsMockLabel />
      </MockProvider>
    );
    const label = container.querySelector('.is-mock-label');

    expect(label?.textContent).toBe('yes');
  });
});

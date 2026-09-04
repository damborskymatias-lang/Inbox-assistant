import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { AssistantSettings } from './assistant-settings.js';
import styles from './assistant-settings.module.scss';

describe('AssistantSettings', () => {
  it('shows the upgrade prompt for free users', () => {
    const { container } = render(
      <MockProvider initialEntries={['/assistant/settings']}>
        <AssistantSettings
          mockUser={mockUser()}
          isPro={false}
          mockWritingStyle={{ tone: `friendly`, length: `medium`, signOff: `Best,\nPeter` }}
        />
      </MockProvider>
    );

    const upgradeCard = container.querySelector(`.${styles.upgradeCard}`);
    expect(upgradeCard).toBeTruthy();
  });

  it('does not show the upgrade prompt for pro users', () => {
    const { container } = render(
      <MockProvider initialEntries={['/assistant/settings']}>
        <AssistantSettings
          mockUser={mockUser()}
          isPro
          mockWritingStyle={{ tone: `friendly`, length: `medium`, signOff: `Best,\nPeter` }}
        />
      </MockProvider>
    );

    const upgradeCard = container.querySelector(`.${styles.upgradeCard}`);
    expect(upgradeCard).toBeNull();
  });

  it('renders the sign-off value from the writing style', () => {
    const { container } = render(
      <MockProvider initialEntries={['/assistant/settings']}>
        <AssistantSettings
          mockUser={mockUser()}
          isPro
          mockWritingStyle={{ tone: `friendly`, length: `medium`, signOff: `Best,\nPeter` }}
        />
      </MockProvider>
    );

    const signOffInput = container.querySelector(`input`) as HTMLInputElement;
    expect(signOffInput.value).toContain(`Best,`);
    expect(signOffInput.value).toContain(`Peter`);
  });

  it('updates the preview when the sign-off input changes', () => {
    const { container } = render(
      <MockProvider initialEntries={['/assistant/settings']}>
        <AssistantSettings
          mockUser={mockUser()}
          isPro
          mockWritingStyle={{ tone: `friendly`, length: `medium`, signOff: `Best,\nPeter` }}
        />
      </MockProvider>
    );

    const signOffInput = container.querySelector(`input`) as HTMLInputElement;
    fireEvent.change(signOffInput, { target: { value: `Cheers,\nJordan` } });

    const previewBody = container.querySelector(`.${styles.previewBody}`);
    expect(previewBody?.textContent).toContain(`Cheers,`);
    expect(previewBody?.textContent).toContain(`Jordan`);
  });

  it('disables the save button for free users', () => {
    const { container } = render(
      <MockProvider initialEntries={['/assistant/settings']}>
        <AssistantSettings
          mockUser={mockUser()}
          isPro={false}
          mockWritingStyle={{ tone: `friendly`, length: `medium`, signOff: `Best,\nPeter` }}
        />
      </MockProvider>
    );

    const buttons = container.querySelectorAll(`button`);
    const saveButton = Array.from(buttons).find((button) =>
      button.textContent?.includes(`Save changes`)
    ) as HTMLButtonElement;

    expect(saveButton.disabled).toBe(true);
  });

  it('enables the save button for pro users', () => {
    const { container } = render(
      <MockProvider initialEntries={['/assistant/settings']}>
        <AssistantSettings
          mockUser={mockUser()}
          isPro
          mockWritingStyle={{ tone: `friendly`, length: `medium`, signOff: `Best,\nPeter` }}
        />
      </MockProvider>
    );

    const buttons = container.querySelectorAll(`button`);
    const saveButton = Array.from(buttons).find((button) =>
      button.textContent?.includes(`Save changes`)
    ) as HTMLButtonElement;

    expect(saveButton.disabled).toBe(false);
  });

  it('opens the tone select list menu when the trigger is clicked', () => {
    const { container } = render(
      <MockProvider initialEntries={['/assistant/settings']}>
        <AssistantSettings
          mockUser={mockUser()}
          isPro
          mockWritingStyle={{ tone: `friendly`, length: `medium`, signOff: `Best,\nPeter` }}
        />
      </MockProvider>
    );

    const buttons = container.querySelectorAll(`button`);
    const toneTrigger = Array.from(buttons).find((button) =>
      button.textContent?.includes(`Friendly`)
    ) as HTMLButtonElement;
    fireEvent.click(toneTrigger);

    const optionButtons = Array.from(container.querySelectorAll(`button[role="option"]`));
    expect(optionButtons.length).toBeGreaterThan(0);
  });
});

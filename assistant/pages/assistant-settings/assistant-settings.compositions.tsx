import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockUser } from '@lov/inbox-platform.entities.user';
import { AssistantSettings } from './assistant-settings.js';

export const FreeUserSeesUpgradePrompt = () => {
  return (
    <MockProvider initialEntries={['/assistant/settings']}>
      <AssistantSettings
        mockUser={mockUser()}
        isPro={false}
        mockWritingStyle={{ tone: `friendly`, length: `medium`, signOff: `Best,\nPeter` }}
      />
    </MockProvider>
  );
};

export const ProUserCanSaveStyle = () => {
  return (
    <MockProvider initialEntries={['/assistant/settings']}>
      <AssistantSettings
        mockUser={mockUser({ name: `Alex Rivera` })}
        isPro
        mockWritingStyle={{ tone: `formal`, length: `long`, signOff: `Regards,\nAlex` }}
      />
    </MockProvider>
  );
};

export const ConciseWarmPreview = () => {
  return (
    <MockProvider initialEntries={['/assistant/settings']}>
      <AssistantSettings
        mockUser={mockUser()}
        isPro
        mockWritingStyle={{ tone: `warm`, length: `short`, signOff: `Love,\nPeter` }}
      />
    </MockProvider>
  );
};

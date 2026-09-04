import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { Toggle } from './toggle.js';

export const BasicToggle = () => {
  const [checked, setChecked] = useState(true);

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', maxWidth: '360px' }}>
        <Toggle
          checked={checked}
          onChange={(value) => setChecked(value)}
          label="Daily digest"
          description="Receive a summary of your most important emails every morning."
        />
      </div>
    </MockProvider>
  );
};

export const AssistantSettingsList = () => {
  const [prefs, setPrefs] = useState({
    autoReply: true,
    smartTriage: true,
    weeklyReport: false,
  });

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem', maxWidth: '420px' }}>
        <Toggle
          checked={prefs.autoReply}
          onChange={(value) => setPrefs({ ...prefs, autoReply: value })}
          label="Auto-reply suggestions"
          description="Let the assistant draft quick replies for routine emails."
        />
        <Toggle
          checked={prefs.smartTriage}
          onChange={(value) => setPrefs({ ...prefs, smartTriage: value })}
          label="Smart triage"
          description="Automatically sort incoming mail into urgent, needs reply and FYI."
        />
        <Toggle
          checked={prefs.weeklyReport}
          onChange={(value) => setPrefs({ ...prefs, weeklyReport: value })}
          label="Weekly productivity report"
          description="Get a Monday morning recap of time saved and inbox trends."
        />
      </div>
    </MockProvider>
  );
};

export const ToggleSizesAndStates = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem', display: 'grid', gap: '1.25rem', maxWidth: '420px' }}>
        <Toggle checked size="sm" label="Small" description="Compact switch size." />
        <Toggle checked size="md" label="Medium" description="Default switch size." />
        <Toggle checked size="lg" label="Large" description="Larger switch size." />
        <Toggle
          checked={false}
          disabled
          label="Disabled digest"
          description="This preference is managed by your organization."
        />
      </div>
    </MockProvider>
  );
};

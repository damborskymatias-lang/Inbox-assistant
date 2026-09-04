import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { SelectList } from './select-list.js';
import { writingStyleOptions, triageFilterOptions, cleanupRuleOptions } from './select-list.mock.js';

export const WritingStylePicker = () => {
  const [value, setValue] = useState(`professional`);

  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <div style={{ padding: '3rem', background: '#f6f7fb' }}>
        <SelectList
          label="Writing style"
          options={writingStyleOptions}
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
          placeholder="Choose a style"
        />
      </div>
    </MemoryRouter>
  );
};

export const TriageFilterPicker = () => {
  const [value, setValue] = useState(`all`);

  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <div style={{ padding: '3rem', background: '#f6f7fb' }}>
        <SelectList
          label="Filter by triage"
          options={triageFilterOptions}
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
        />
      </div>
    </MemoryRouter>
  );
};

export const CleanupRulePickerEmpty = () => {
  const [value, setValue] = useState<string | undefined>(undefined);

  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <div style={{ padding: '3rem', background: '#f6f7fb' }}>
        <SelectList
          label="Cleanup rule"
          options={cleanupRuleOptions}
          value={value}
          onChange={(nextValue) => setValue(nextValue)}
          placeholder="Pick a cleanup rule"
        />
      </div>
    </MemoryRouter>
  );
};

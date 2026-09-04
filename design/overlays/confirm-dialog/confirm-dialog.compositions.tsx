import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { ConfirmDialog } from './confirm-dialog.js';

export const DefaultCleanupConfirmation = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        <ConfirmDialog
          open
          title="Archive 42 newsletters?"
          description="42 newsletters detected from the last 30 days. This will move them out of your inbox — you can always find them in Archive."
          confirmLabel="Archive all"
          cancelLabel="Not now"
        />
      </div>
    </MockProvider>
  );
};

export const DangerTone = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        <ConfirmDialog
          open
          tone="danger"
          title="Delete 12 promotions?"
          description="This action permanently deletes these emails and cannot be undone."
          confirmLabel="Delete permanently"
          cancelLabel="Cancel"
        />
      </div>
    </MockProvider>
  );
};

export const LoadingConfirmation = () => {
  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        <ConfirmDialog
          open
          loading
          title="Archiving newsletters…"
          description="42 newsletters are being archived. This will only take a moment."
          confirmLabel="Archiving"
          cancelLabel="Cancel"
        />
      </div>
    </MockProvider>
  );
};

export const InteractiveConfirmation = () => {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [archived, setArchived] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
      setArchived(true);
    }, 900);
  };

  return (
    <MockProvider>
      <div style={{ padding: '1.5rem' }}>
        {!open && (
          <button type="button" onClick={() => setOpen(true)}>
            {archived ? 'Archived — open again' : 'Open confirmation'}
          </button>
        )}
        <ConfirmDialog
          open={open}
          loading={loading}
          title="Archive 42 newsletters?"
          description="Once archived, these emails will be removed from your inbox view."
          confirmLabel="Archive all"
          cancelLabel="Cancel"
          onConfirm={() => handleConfirm()}
          onCancel={() => setOpen(false)}
        />
      </div>
    </MockProvider>
  );
};

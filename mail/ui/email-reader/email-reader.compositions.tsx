import React, { useState } from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { Button } from '@lov/design.actions.button';
import { mockEmail } from '@lov/mail.entities.email';
import { EmailReader } from './email-reader.js';

const urgentEmail = mockEmail({
  id: `e1`,
  sender: `John Carter`,
  senderEmail: `john@northwind.io`,
  subject: `Project update for Q3 rollout?`,
  body: `Hi Peter,\n\nCould you share where we stand on the Q3 rollout? The steering committee meets Thursday and I would like to bring numbers.\n\nThanks,\nJohn`,
  category: `work`,
  importance: 9,
  needsReply: true,
  bucket: `urgent`,
  receivedAt: new Date().toISOString(),
  read: false,
}).toObject();

const familyEmail = mockEmail({
  id: `e5`,
  sender: `Mom`,
  senderEmail: `mom@family.net`,
  subject: `Sunday lunch?`,
  body: `Are you coming Sunday? Grandma is making the good soup. Let me know before Friday!`,
  category: `family`,
  importance: 6,
  needsReply: true,
  bucket: `needsReply`,
  receivedAt: new Date(Date.now() - 86400000).toISOString(),
  read: true,
}).toObject();

export const BasicEmailReader = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: `560px`, padding: `1.5rem` }}>
        <EmailReader email={urgentEmail} />
      </div>
    </MockProvider>
  );
};

export const WithRegisteredActions = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: `560px`, padding: `1.5rem` }}>
        <EmailReader
          email={familyEmail}
          actions={[
            <Button key="generate-reply" variant="primary" size="sm">
              ✨ Generate Reply
            </Button>,
          ]}
        />
      </div>
    </MockProvider>
  );
};

export const InteractiveWithArchiveAndDelete = () => {
  const [status, setStatus] = useState(`open`);

  if (status !== `open`) {
    return (
      <MockProvider>
        <div style={{ maxWidth: `560px`, padding: `1.5rem` }}>
          <EmailReader />
          <p style={{ marginTop: `1rem`, fontFamily: `sans-serif`, fontSize: `0.85rem` }}>
            {`Email was ${status}.`}
          </p>
        </div>
      </MockProvider>
    );
  }

  return (
    <MockProvider>
      <div style={{ maxWidth: `560px`, padding: `1.5rem` }}>
        <EmailReader
          email={urgentEmail}
          onArchive={() => setStatus(`archived`)}
          onDelete={() => setStatus(`deleted`)}
        />
      </div>
    </MockProvider>
  );
};

export const EmptyEmailReader = () => {
  return (
    <MockProvider>
      <div style={{ maxWidth: `560px`, padding: `1.5rem` }}>
        <EmailReader />
      </div>
    </MockProvider>
  );
};

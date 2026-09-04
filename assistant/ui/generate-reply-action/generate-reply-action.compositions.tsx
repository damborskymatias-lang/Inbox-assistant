import React from 'react';
import { MockProvider } from '@lov/inbox-platform.testing.mock-provider';
import { mockEmail } from '@lov/mail.entities.email';
import { GenerateReplyAction } from './generate-reply-action.js';

const johnEmail = mockEmail({
  id: `e1`,
  sender: `John Carter`,
  senderEmail: `john@northwind.io`,
  subject: `Project update for Q3 rollout?`,
  body: `Hi Peter,\n\nCould you share where we stand on the Q3 rollout? The steering committee meets Thursday and I would like to bring numbers.\n\nThanks,\nJohn`,
  category: `work`,
  importance: 9,
  needsReply: true,
}).toObject();

const lenaEmail = mockEmail({
  id: `e4`,
  sender: `Lena Fischer`,
  senderEmail: `lena@designstudio.de`,
  subject: `Contract review — one open point`,
  body: `Hi Peter,\n\nLegal is fine with everything except clause 7.2 on liability. Can you confirm the cap we agreed on?\n\nBest,\nLena`,
  category: `work`,
  importance: 8,
  needsReply: true,
}).toObject();

export const BasicGenerateReplyAction = () => {
  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `520px` }}>
        <GenerateReplyAction email={johnEmail} />
      </div>
    </MockProvider>
  );
};

export const GenerateReplyActionInToolbar = () => {
  return (
    <MockProvider>
      <div
        style={{
          padding: `1.5rem`,
          maxWidth: `520px`,
          display: `flex`,
          flexDirection: `column`,
          gap: `0.75rem`,
        }}
      >
        <div style={{ display: `flex`, gap: `0.5rem`, alignItems: `center` }}>
          <span style={{ fontSize: `0.85rem`, color: `var(--colors-text-secondary)` }}>
            Reader toolbar:
          </span>
          <GenerateReplyAction email={lenaEmail} />
        </div>
      </div>
    </MockProvider>
  );
};

export const GenerateReplyActionWithCallback = () => {
  const handleSent = (email: typeof johnEmail, minutesSaved: number) => {
    // eslint-disable-next-line no-console
    console.log(`Reply sent to ${email.sender}, ~${minutesSaved} minutes saved`);
  };

  return (
    <MockProvider>
      <div style={{ padding: `1.5rem`, maxWidth: `520px` }}>
        <GenerateReplyAction email={johnEmail} onSent={(email, minutesSaved) => handleSent(email, minutesSaved)} />
      </div>
    </MockProvider>
  );
};

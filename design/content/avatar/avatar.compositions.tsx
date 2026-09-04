import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Avatar } from './avatar.js';

export const BasicAvatar = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem' }}>
        <Avatar name="Peter Cole" size="lg" />
        <Avatar name="Amelia Grant" size="md" />
        <Avatar name="Noah Bennett" size="sm" />
        <Avatar name="Zoe Fisher" size="xs" />
      </div>
    </MemoryRouter>
  );
};

export const AvatarWithImage = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1.5rem' }}>
        <Avatar
          name="Peter Cole"
          size="lg"
          src="https://storage.googleapis.com/static.bit.dev/extensions-icons/default.svg"
        />
        <Avatar name="Amelia Grant" size="md" />
      </div>
    </MemoryRouter>
  );
};

export const EmailSenderAvatars = () => {
  const senders = [
    'Alice Johnson',
    'Bank of Meridian',
    'Michael Torres',
    'Sofia Martinez',
    'Support Team',
  ];

  return (
    <MemoryRouter>
      <div style={{ display: 'grid', gap: '0.75rem', padding: '1.5rem', maxWidth: '320px' }}>
        {senders.map((sender) => (
          <div key={sender} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Avatar name={sender} size="sm" />
            <span style={{ fontSize: '0.9rem', fontFamily: 'Inter, sans-serif' }}>{sender}</span>
          </div>
        ))}
      </div>
    </MemoryRouter>
  );
};

import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { MailIcons } from './mail-icons.js';
import { InboxIcon } from './inbox-icon.js';
import { MailOpenIcon } from './mail-open-icon.js';
import { ArchiveIcon } from './archive-icon.js';
import { TrashIcon } from './trash-icon.js';
import { ReplyIcon } from './reply-icon.js';
import { SendIcon } from './send-icon.js';
import { FlameIcon } from './flame-icon.js';
import { PaperIcon } from './paper-icon.js';
import { CheckCircleIcon } from './check-circle-icon.js';
import { TagIcon } from './tag-icon.js';
import { RefreshIcon } from './refresh-icon.js';
import styles from './mail-icons.module.scss';

export const AllMailIcons = () => {
  const icons = [
    { label: 'Inbox', node: <InboxIcon title="Inbox" /> },
    { label: 'Mail open', node: <MailOpenIcon title="Mail open" /> },
    { label: 'Archive', node: <ArchiveIcon title="Archive" /> },
    { label: 'Trash', node: <TrashIcon title="Trash" /> },
    { label: 'Reply', node: <ReplyIcon title="Reply" /> },
    { label: 'Send', node: <SendIcon title="Send" /> },
    { label: 'Urgent', node: <FlameIcon title="Urgent" /> },
    { label: 'Needs reply', node: <PaperIcon title="Needs reply" /> },
    { label: 'FYI', node: <CheckCircleIcon title="FYI" /> },
    { label: 'Promotions', node: <TagIcon title="Promotions" /> },
    { label: 'Sync', node: <RefreshIcon title="Sync" /> },
  ];

  return (
    <MemoryRouter>
      <div className={styles.grid}>
        {icons.map((icon) => (
          <div key={icon.label} className={styles.item}>
            {icon.node}
            <span className={styles.label}>{icon.label}</span>
          </div>
        ))}
      </div>
    </MemoryRouter>
  );
};

export const MailIconsByName = () => {
  const names: Array<{ name: 'inbox' | 'archive' | 'trash' | 'sync'; label: string }> = [
    { name: 'inbox', label: 'Inbox' },
    { name: 'archive', label: 'Archive' },
    { name: 'trash', label: 'Trash' },
    { name: 'sync', label: 'Sync' },
  ];

  return (
    <MemoryRouter>
      <div className={styles.grid}>
        {names.map((item) => (
          <div key={item.name} className={styles.item}>
            <MailIcons name={item.name} size="lg" color="primary" title={item.label} />
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </MemoryRouter>
  );
};

export const TriageIconColors = () => {
  const triage: Array<{ name: 'urgent' | 'needsReply' | 'fyi' | 'promotions'; label: string; color: string }> = [
    { name: 'urgent', label: 'Urgent', color: 'urgent' },
    { name: 'needsReply', label: 'Needs Reply', color: 'needsReply' },
    { name: 'fyi', label: 'FYI', color: 'fyi' },
    { name: 'promotions', label: 'Promotions', color: 'promotions' },
  ];

  return (
    <MemoryRouter>
      <div className={styles.grid}>
        {triage.map((item) => (
          <div key={item.name} className={styles.item}>
            <MailIcons name={item.name} size="lg" color={item.color} title={item.label} />
            <span className={styles.label}>{item.label}</span>
          </div>
        ))}
      </div>
    </MemoryRouter>
  );
};

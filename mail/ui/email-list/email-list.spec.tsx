import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockEmails } from '@lov/mail.entities.email';
import { EmailList } from './email-list.js';
import styles from './email-list.module.scss';

const emails = mockEmails()
  .slice(0, 3)
  .map((email) => email.toObject());

describe(`EmailList`, () => {
  it(`should render a row for each email`, () => {
    const { container } = render(
      <MemoryRouter>
        <EmailList emails={emails} />
      </MemoryRouter>
    );

    const rows = container.querySelectorAll(`.${styles.row}`);
    expect(rows.length).toBe(emails.length);
  });

  it(`should render the empty state when there are no emails`, () => {
    const { container, getByText } = render(
      <MemoryRouter>
        <EmailList emails={[]} />
      </MemoryRouter>
    );

    expect(container.querySelectorAll(`.${styles.row}`).length).toBe(0);
    expect(getByText(`Inbox zero for this filter`)).toBeTruthy();
  });

  it(`should render skeleton rows while loading`, () => {
    const { container } = render(
      <MemoryRouter>
        <EmailList emails={emails} loading />
      </MemoryRouter>
    );

    expect(container.querySelectorAll(`.${styles.row}`).length).toBe(0);
  });

  it(`should call onSelect with the email id when a row is clicked`, () => {
    const handleSelect = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <EmailList emails={emails} onSelect={handleSelect} />
      </MemoryRouter>
    );

    const firstRow = container.querySelector(`.${styles.row}`) as HTMLElement;
    fireEvent.click(firstRow);

    expect(handleSelect).toHaveBeenCalledWith(emails[0].id);
  });

  it(`should apply the selected class to the matching row`, () => {
    const { container } = render(
      <MemoryRouter>
        <EmailList emails={emails} selectedId={emails[1].id} />
      </MemoryRouter>
    );

    const rows = container.querySelectorAll(`.${styles.row}`);
    expect(rows[1].className).toContain(styles.rowSelected);
  });
});

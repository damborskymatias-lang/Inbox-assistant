import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Dropdown } from './dropdown.js';

const menuItemStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem',
  fontSize: '0.85rem',
  cursor: 'pointer',
  borderRadius: '8px',
};

export const UserMenuDropdown = () => {
  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <div style={{ padding: '3rem', display: 'flex', justifyContent: 'flex-end' }}>
        <Dropdown
          placement="bottom-end"
          trigger={
            <button
              type="button"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: '#dfe3ec',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              PN
            </button>
          }
        >
          <button type="button" style={menuItemStyle}>
            Profile settings
          </button>
          <button type="button" style={menuItemStyle}>
            Notification preferences
          </button>
          <button type="button" style={menuItemStyle}>
            Sign out
          </button>
        </Dropdown>
      </div>
    </MemoryRouter>
  );
};

export const SelectListDropdown = () => {
  const options = ['All email', 'Urgent', 'Needs reply', 'FYI', 'Promotions'];
  const [selected, setSelected] = useState(options[0]);

  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <div style={{ padding: '3rem' }}>
        <Dropdown
          placement="bottom-start"
          trigger={
            <button
              type="button"
              style={{
                border: '1px solid #e6e9f0',
                background: '#fff',
                borderRadius: '10px',
                padding: '0.5rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {selected} ▾
            </button>
          }
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              style={menuItemStyle}
              onClick={() => setSelected(option)}
            >
              {option}
            </button>
          ))}
        </Dropdown>
      </div>
    </MemoryRouter>
  );
};

export const ControlledDropdown = () => {
  const [open, setOpen] = useState(false);

  return (
    <MemoryRouter initialEntries={['/dashboard']}>
      <div style={{ padding: '3rem', display: 'grid', gap: '0.75rem', justifyItems: 'start' }}>
        <span style={{ fontSize: '0.85rem', color: '#5b6478' }}>
          Dropdown is {open ? 'open' : 'closed'}
        </span>
        <Dropdown
          open={open}
          onOpenChange={(nextOpen) => setOpen(nextOpen)}
          placement="bottom-start"
          trigger={
            <button
              type="button"
              style={{
                border: '1px solid #4f46e5',
                background: '#4f46e5',
                color: '#fff',
                borderRadius: '10px',
                padding: '0.5rem 0.85rem',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Archive options
            </button>
          }
        >
          <button type="button" style={menuItemStyle}>
            Archive all newsletters
          </button>
          <button type="button" style={menuItemStyle}>
            Archive read emails
          </button>
        </Dropdown>
      </div>
    </MemoryRouter>
  );
};

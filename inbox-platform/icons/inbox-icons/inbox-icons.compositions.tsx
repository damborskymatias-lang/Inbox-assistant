import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HomeIcon } from './home-icon.js';
import { DashboardIcon } from './dashboard-icon.js';
import { MenuIcon } from './menu-icon.js';
import { CloseIcon } from './close-icon.js';
import { ChevronDownIcon } from './chevron-down-icon.js';
import { ChevronRightIcon } from './chevron-right-icon.js';
import { SettingsIcon } from './settings-icon.js';
import { LogoutIcon } from './logout-icon.js';
import { GoogleIcon } from './google-icon.js';
import { SearchIcon } from './search-icon.js';
import { BellIcon } from './bell-icon.js';
import { ClockIcon } from './clock-icon.js';
import styles from './inbox-icons.compositions.module.scss';

export const AllInboxIcons = () => {
  const icons: Array<{ label: string; Icon: typeof HomeIcon }> = [
    { label: `Home`, Icon: HomeIcon },
    { label: `Dashboard`, Icon: DashboardIcon },
    { label: `Menu`, Icon: MenuIcon },
    { label: `Close`, Icon: CloseIcon },
    { label: `Chevron down`, Icon: ChevronDownIcon },
    { label: `Chevron right`, Icon: ChevronRightIcon },
    { label: `Settings`, Icon: SettingsIcon },
    { label: `Logout`, Icon: LogoutIcon },
    { label: `Google`, Icon: GoogleIcon },
    { label: `Search`, Icon: SearchIcon },
    { label: `Bell`, Icon: BellIcon },
    { label: `Clock`, Icon: ClockIcon },
  ];

  return (
    <MemoryRouter>
      <div className={styles.grid}>
        {icons.map((item) => {
          const IconComponent = item.Icon;
          return (
            <div key={item.label} className={styles.cell}>
              <IconComponent size="lg" />
              <span className={styles.label}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </MemoryRouter>
  );
};

export const IconSizesAndColors = () => {
  return (
    <MemoryRouter>
      <div className={styles.row}>
        <HomeIcon size="xs" color="secondary" title="Home extra small" />
        <HomeIcon size="sm" color="primary" title="Home small" />
        <HomeIcon size="md" color="default" title="Home medium" />
        <HomeIcon size="lg" color="urgent" title="Home large" />
        <HomeIcon size={32} color="inherit" title="Home custom size" />
      </div>
    </MemoryRouter>
  );
};

export const NavigationExample = () => {
  return (
    <MemoryRouter>
      <div className={styles.nav}>
        <div className={styles.navItem}>
          <HomeIcon size="sm" title="Home" />
          <span>Home</span>
        </div>
        <div className={styles.navItem}>
          <DashboardIcon size="sm" title="Dashboard" />
          <span>Dashboard</span>
        </div>
        <div className={styles.navItem}>
          <SearchIcon size="sm" title="Search" />
          <span>Search</span>
          <ChevronRightIcon size="xs" className={styles.chevron} />
        </div>
        <div className={styles.navItem}>
          <BellIcon size="sm" title="Notifications" />
          <span>Notifications</span>
        </div>
        <div className={styles.navItem}>
          <ClockIcon size="sm" title="Activity" />
          <span>Saved 24 minutes today</span>
        </div>
        <div className={styles.navItem}>
          <SettingsIcon size="sm" title="Settings" />
          <span>Settings</span>
        </div>
        <div className={styles.navItem}>
          <LogoutIcon size="sm" title="Log out" />
          <span>Log out</span>
        </div>
      </div>
    </MemoryRouter>
  );
};

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/useAuth';
import { ToggleButton } from 'primereact/togglebutton';
import { on } from 'events';
import ProfileMenu from '@/app/components/profile-menu/ProfileMenu';
import { MenuItem } from 'primereact/menuitem';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar, onThemeToogle } = useContext(LayoutContext);
  const menubuttonRef = useRef(null);
  const topbarmenuRef = useRef(null);
  const topbarmenubuttonRef = useRef(null);
  const router = useRouter();

  const { logout } = useAuth();

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
    topbarmenu: topbarmenuRef.current,
    topbarmenubutton: topbarmenubuttonRef.current
  }));

  const menuItems: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      command: () => {
        router.push('/user/profile');
      }
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out',
      command: () => {
        logout();
      }
    }
  ];

  return (
    <div className="layout-topbar">
      <Link href="/" className="layout-topbar-logo">
        <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} alt="logo" />
        <span>GORA</span>
      </Link>
      <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
        <i className="pi pi-bars" />
      </button>
      <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
        <i className="pi pi-ellipsis-v" />
      </button>
      <div
        ref={topbarmenuRef}
        className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}
      >
        <ToggleButton
          checked={layoutConfig.theme !== 'lara-light-blue'} // true if dark theme
          onIcon="pi pi-sun"
          offIcon="pi pi-moon"
          offLabel=""
          onLabel=""
          onChange={onThemeToogle}
          className="p-button-rounded p-button-text p-button-icon-only"
          aria-label="Toggle theme"
        />

        <Button label="Kiosk" onClick={() => router.push('/kiosk')} rounded></Button>

        <ProfileMenu items={menuItems} />
      </div>
    </div>
  );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;

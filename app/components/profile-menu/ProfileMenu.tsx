import React, { useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Avatar } from 'primereact/avatar';
import { Button } from 'primereact/button';
import { useAuth } from '@/app/contexts/useAuth'; // Import your auth hook
import { on } from 'events';
import { MenuItem } from 'primereact/menuitem';

interface ProfileMenuProps {
  items: MenuItem[];
}

const ProfileMenu = ({ items }: ProfileMenuProps) => {
  const menu = useRef<any>(null);

  const { user } = useAuth(); // Get user from auth context

  // Get the initial (fallback to 'U' if not available)
  const userInitial = user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="flex justify-content-end align-items-center">
      {/* PrimeReact Menu */}
      <Menu model={items} popup ref={menu} />

      {/* Trigger (Avatar or Logo) */}
      <Button className="p-link bg-transparent" onClick={(e) => menu.current.toggle(e)} aria-label="Profile menu" rounded>
        <Avatar label={userInitial} size="large" shape="circle" />
      </Button>
    </div>
  );
};

export default ProfileMenu;

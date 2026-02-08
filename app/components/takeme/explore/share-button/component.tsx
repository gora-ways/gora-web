import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

interface ShareButtonProps {
  className?: string;
  onShareClick?: (type: 'copy' | 'facebook') => void;
}
export default function ShareButton({ className, onShareClick }: ShareButtonProps) {
  const menuLeft = useRef<any>(null);
  const items = [
    {
      label: 'Copy Link',
      icon: 'pi pi-copy',
      command: () => {
        if (onShareClick) onShareClick('copy');
      }
    },
    {
      label: 'Share Facebook',
      icon: 'pi pi-facebook',
      command: () => {
        if (onShareClick) onShareClick('facebook');
      }
    }
  ];

  return (
    <div className={`${className}`}>
      <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
      <Button
        outlined
        rounded
        severity="success"
        size="small"
        label="Share"
        icon="pi pi-share-alt"
        onClick={(event) => menuLeft.current.toggle(event)}
        aria-controls="popup_menu_left"
        aria-haspopup
      />
    </div>
  );
}

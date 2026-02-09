import React, { useRef } from 'react';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';

interface ShareButtonProps {
  id?: string;
  className?: string;
  onShareClick?: (type: 'copy' | 'facebook') => void;
}
export default function ShareButton({ id, className, onShareClick }: ShareButtonProps) {
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
    <div id={id} className={`${className}`}>
      <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
      <Button
        outlined
        tooltip="Share GORA Routes"
        tooltipOptions={{ position: 'left' }}
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

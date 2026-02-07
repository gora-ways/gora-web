import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Button } from 'primereact/button';

import './component.scss';
import AppLogoIcon from '../icons/AppLogoIcon';

type InitialLoaderProps = {
  visible: boolean;
  appName?: string;
  tagline?: string;
  onRetry?: () => void; // optional retry button
};

export default function InitialLoader({
  visible,
  appName = 'GORA',
  tagline = 'Explore the Philippines — plan your journey',

  onRetry
}: InitialLoaderProps) {
  return (
    <div className={`screen-loader ${visible ? 'is-visible' : 'is-hidden'}`} aria-hidden={!visible}>
      <div className="app">
        <AppLogoIcon size={54} className="drop-shadow-lg" />
        <div className="app-name">
          <h6>{appName}</h6>
          <div className="app-tag-line">{tagline}</div>
        </div>

        <div className="loader-row">
          <ProgressSpinner style={{ width: '42px', height: '42px' }} strokeWidth="6" aria-label="Loading" />
        </div>

        {onRetry && (
          <div className="actions">
            <Button label="Retry" icon="pi pi-refresh" className="p-button-sm p-button-outlined" onClick={onRetry} />
          </div>
        )}
      </div>
    </div>
  );
}

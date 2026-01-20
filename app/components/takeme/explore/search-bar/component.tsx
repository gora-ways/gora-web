import React, { useEffect, useMemo, useState } from 'react';
import { AutoComplete, AutoCompleteCompleteEvent } from 'primereact/autocomplete';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import AppLogoIcon from '@/app/components/icons/AppLogoIcon';

import './component.scss';

export type LocationOption = {
  label: string; // display name
  lat: number;
  lng: number;
  raw?: any; // optional extra payload
};

type Props = {
  searchLocations: (query: string) => Promise<LocationOption[]>;
  onChange?: (value: { origin?: LocationOption; destination?: LocationOption }) => void;
  onSearchRoute?: ({ origin, destination }: { origin?: LocationOption; destination?: LocationOption }) => void;
  onClear?: () => void;
  onSelectMap?: (type?: 'destination' | 'origin') => void;
  initialLocations?: { origin?: LocationOption; destination?: LocationOption };
  top?: number;
  left?: number;
  width?: number | string;
};

export function FloatingRouteSearch({
  searchLocations,
  onChange,
  onSearchRoute,
  onClear,
  onSelectMap,
  initialLocations,
  top = 25,
  left = 25,
  width = 360
}: Props) {
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');

  const [isSearchBoxVisible, setIsSearchBoxVisible] = useState<boolean>(false);

  const [origin, setOrigin] = useState<LocationOption | undefined>(undefined);
  const [destination, setDestination] = useState<LocationOption | undefined>(undefined);

  const [originSuggestions, setOriginSuggestions] = useState<LocationOption[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationOption[]>([]);

  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingDest, setLoadingDest] = useState(false);

  useEffect(() => {
    if (initialLocations) {
      if (initialLocations.origin) setOrigin(initialLocations.origin);
      if (initialLocations.destination) setDestination(initialLocations.destination);
    }
  }, [initialLocations]);

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      top,
      left,
      width,
      zIndex: 1000 // make sure it's above the map
    }),
    [top, left, width]
  );

  const completeOrigin = async (e: AutoCompleteCompleteEvent) => {
    const q = (e.query ?? '').trim();
    setOriginQuery(q);
    if (!q) return setOriginSuggestions([]);

    setLoadingOrigin(true);
    try {
      const results = await searchLocations(q);
      setOriginSuggestions(results);
    } finally {
      setLoadingOrigin(false);
    }
  };

  const completeDestination = async (e: AutoCompleteCompleteEvent) => {
    const q = (e.query ?? '').trim();
    setDestQuery(q);
    if (!q) return setDestSuggestions([]);

    setLoadingDest(true);
    try {
      const results = await searchLocations(q);
      setDestSuggestions(results);
    } finally {
      setLoadingDest(false);
    }
  };

  const emitChange = (nextOrigin?: LocationOption, nextDest?: LocationOption) => {
    onChange?.({ origin: nextOrigin, destination: nextDest });
  };

  const clearAll = () => {
    setOrigin(undefined);
    setDestination(undefined);
    setOriginQuery('');
    setDestQuery('');
    setOriginSuggestions([]);
    setDestSuggestions([]);
    onClear?.();
    emitChange(undefined, undefined);
  };

  const canSearch = Boolean(origin?.lat && destination?.lat);

  return (
    <div className="search-bar" style={containerStyle}>
      <div className="flex align-items-center gap-2">
        <div className="flex align-items-center app-icon">
          <AppLogoIcon size={54} className="drop-shadow-lg" />
          <div className="app-name">
            <h6>GORA</h6>
            <span className="app-tag-line">Commute Smarter</span>
          </div>
        </div>
        <Button
          className="btn-blue"
          icon="pi pi-search"
          rounded
          outlined
          severity="info"
          aria-label="User"
          onClick={() => setIsSearchBoxVisible(!isSearchBoxVisible)}
        />
      </div>

      {isSearchBoxVisible && (
        <Card className="search-box" style={{ borderRadius: 12 }}>
          <h5>
            <i className="pi pi-directions" /> Find Your Way
          </h5>
          <div className="flex flex-column gap-2">
            <div className="flex flex-column gap-1">
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-map-marker text-red-700"></i>
                </span>

                <AutoComplete
                  value={origin ?? originQuery}
                  suggestions={originSuggestions}
                  completeMethod={completeOrigin}
                  field="label"
                  dropdown={false}
                  forceSelection
                  placeholder="I am here..."
                  onChange={(e) => {
                    // typing
                    if (typeof e.value === 'string') setOriginQuery(e.value);
                  }}
                  onSelect={(e) => {
                    const selected = e.value as LocationOption;
                    setOrigin(selected);
                    setOriginQuery(selected.label);
                    emitChange(selected, destination);
                  }}
                  onClick={() => onSelectMap?.('origin')}
                  className="w-full"
                  inputClassName="w-full"
                />
              </div>
            </div>

            <div className="flex flex-column gap-1">
              <div className="p-inputgroup flex-1">
                <span className="p-inputgroup-addon">
                  <i className="pi pi-map-marker text-blue-700"></i>
                </span>
                <AutoComplete
                  value={destination ?? destQuery}
                  suggestions={destSuggestions}
                  completeMethod={completeDestination}
                  onClick={() => onSelectMap?.('destination')}
                  field="label"
                  dropdown={false}
                  forceSelection
                  placeholder="Take me there..."
                  onChange={(e) => {
                    if (typeof e.value === 'string') setDestQuery(e.value);
                  }}
                  onSelect={(e) => {
                    const selected = e.value as LocationOption;
                    setDestination(selected);
                    setDestQuery(selected.label);
                    emitChange(origin, selected);
                  }}
                  className="w-full"
                  inputClassName="w-full"
                />
              </div>
            </div>
            <div className="flex gap-2 justify-content-end pt-1">
              <Button
                label="Clear"
                size="small"
                rounded
                icon="pi pi-times"
                severity="warning"
                title="Clear Search"
                outlined
                onClick={clearAll}
                type="button"
              />
              <Button
                label="GORA"
                title="Find Routes"
                size="small"
                icon="pi pi-directions"
                disabled={!canSearch}
                onClick={() => onSearchRoute?.({ origin, destination })}
                type="button"
                className="btn-blue"
                rounded
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

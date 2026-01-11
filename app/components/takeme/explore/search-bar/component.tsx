import React, { useEffect, useMemo, useState } from "react";
import { AutoComplete, AutoCompleteCompleteEvent } from "primereact/autocomplete";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

export type LocationOption = {
  label: string;     // display name
  lat: number;
  lng: number;
  raw?: any;         // optional extra payload
};

type Props = {
  searchLocations: (query: string) => Promise<LocationOption[]>;
  onChange?: (value: { origin?: LocationOption; destination?: LocationOption }) => void;
  onSearchRoute?: (value: { origin?: LocationOption; destination?: LocationOption }) => void;
  onClear?: () => void;
  onSelectMap?: () => void;
  initialLocations?: { origin: LocationOption; destination: LocationOption };
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
  top = 16,
  left = 16,
  width = 360,
}: Props) {
  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");

  const [origin, setOrigin] = useState<LocationOption | undefined>(undefined);
  const [destination, setDestination] = useState<LocationOption | undefined>(undefined);

  const [originSuggestions, setOriginSuggestions] = useState<LocationOption[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<LocationOption[]>([]);

  const [loadingOrigin, setLoadingOrigin] = useState(false);
  const [loadingDest, setLoadingDest] = useState(false);

  useEffect(() => {
    if (initialLocations) {
      setOrigin(initialLocations.origin);
      setDestination(initialLocations.destination);
    }
  }, [initialLocations])

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "absolute",
      top,
      left,
      width,
      zIndex: 1000, // make sure it's above the map
    }),
    [top, left, width]
  );

  const completeOrigin = async (e: AutoCompleteCompleteEvent) => {
    const q = (e.query ?? "").trim();
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
    const q = (e.query ?? "").trim();
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
    setOriginQuery("");
    setDestQuery("");
    setOriginSuggestions([]);
    setDestSuggestions([]);
    onClear?.();
    emitChange(undefined, undefined);
  };

  const canSearch = Boolean(origin?.lat && destination?.lat);

  return (
    <div style={containerStyle}>
      <Card className="shadow-3" style={{ borderRadius: 12 }}>
        <div className="flex flex-column gap-2">
          <div className="flex flex-column gap-1">
            <label style={{ fontSize: 12, opacity: 0.8 }}>Origin</label>
            <AutoComplete
              value={origin ?? originQuery}
              suggestions={originSuggestions}
              completeMethod={completeOrigin}
              field="label"
              dropdown={false}
              forceSelection
              placeholder="Search origin location..."
              onChange={(e) => {
                // typing
                if (typeof e.value === "string") setOriginQuery(e.value);
              }}
              onSelect={(e) => {
                const selected = e.value as LocationOption;
                setOrigin(selected);
                setOriginQuery(selected.label);
                emitChange(selected, destination);
              }}
              className="w-full"
              inputClassName="w-full"
            />
          </div>

          <div className="flex flex-column gap-1">
            <label style={{ fontSize: 12, opacity: 0.8 }}>Destination</label>
            <AutoComplete
              value={destination ?? destQuery}
              suggestions={destSuggestions}
              completeMethod={completeDestination}
              field="label"
              dropdown={false}
              forceSelection
              placeholder="Search destination location..."
              onChange={(e) => {
                if (typeof e.value === "string") setDestQuery(e.value);
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

          <div className="flex gap-2 justify-content-end pt-1">
            <Button
              label="Clear"
              icon="pi pi-times"
              severity="secondary"
              outlined
              onClick={clearAll}
              type="button"
            />
            <Button
              label="Route"
              icon="pi pi-directions"
              disabled={!canSearch}
              onClick={() => onSearchRoute?.({ origin, destination })}
              type="button"
            />
          </div>
          <p className="cursor-pointer" onClick={onSelectMap}>Select on map</p>
        </div>
      </Card>
    </div>
  );
}

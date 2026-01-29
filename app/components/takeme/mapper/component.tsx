'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { LatLng, Route, RoutePoints } from '@/app/types/route';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png'
});

function FlyToLocation({ position }: { position?: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, {
        animate: true,
        duration: 1.2
      });
    }
  }, [position, map]);

  return null;
}

function DrawToolbar({ featureGroupRef }: { featureGroupRef: React.RefObject<L.FeatureGroup | null> }) {
  const map = useMap();

  useEffect(() => {
    const fg = new L.FeatureGroup();
    featureGroupRef.current = fg;
    map.addLayer(fg);

    const onCreated = (e: any) => {
      const layer = e.layer as L.Layer;
      fg.clearLayers();
      fg.addLayer(layer);
    };

    // @ts-ignore
    map.on(L.Draw.Event.CREATED, onCreated);

    return () => {
      // @ts-ignore
      map.off(L.Draw.Event.CREATED, onCreated);
      map.removeLayer(fg);
      featureGroupRef.current = null;
    };
  }, [map, featureGroupRef]);

  return null;
}

function ClickToDropPin({
  value,
  disabled,
  onSelect,
  icon = 'red',
  clearNow = false,
  clearPrevious = true,
  tooltip
}: {
  icon?: 'red' | 'blue' | 'circle-blue';
  tooltip?: string;
  disabled?: boolean;
  clearNow?: boolean;
  value?: LatLng;
  onSelect?: (coords: LatLng) => void;
  clearPrevious?: boolean;
}) {
  const markerRef = React.useRef<L.Marker | null>(null);
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const circleBlueIcon = L.divIcon({
    html: `
    <svg width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" opacity="0.2"/>
      <circle cx="12" cy="12" r="5" fill="#2563EB"/>
    </svg>
  `,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const markerIcon = useMemo(() => {
    if (icon === 'red') return redIcon;
    if (icon === 'blue') return blueIcon;
    if (icon === 'circle-blue') return circleBlueIcon;

    return blueIcon; // For default
  }, [icon]);

  useMapEvents({
    click(e) {
      // Disable set marker
      if (disabled) return;

      const { lat, lng } = e.latlng;

      // Remove previous marker if needed
      if (clearPrevious && markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      const marker = L.marker([lat, lng], { icon: markerIcon }).addTo(e.target);
      markerRef.current = marker;

      onSelect?.({ lat, lng });
    }
  });

  useEffect(() => {
    if (markerRef.current && clearNow) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [clearNow]);

  return value ? (
    <Marker position={[value.lat, value.lng]} icon={markerIcon}>
      <Tooltip direction="top" offset={[0, -12]}>
        {tooltip}
      </Tooltip>
    </Marker>
  ) : null;
}

export function RouteMapper({
  origin,
  destination,
  chooseDirection,
  onChoosedDirection,

  initialCenter = { lat: 14.5995, lng: 120.9842 },
  routes
}: {
  chooseDirection?: 'origin' | 'destination' | undefined;
  origin?: LatLng;
  destination?: LatLng;
  initialCenter?: LatLng;
  routes?: Route[];
  onChoosedDirection?: ({ type, coordinates }: { type: 'origin' | 'destination'; coordinates: LatLng }) => void;
}) {
  const [routePoints, setRoutePoints] = useState<RoutePoints[]>([]);
  const [direction, setDirection] = useState<LatLng | undefined>();

  const [clearChooseDirection, setClearChooseDirection] = useState<boolean>();

  // Holds the editable layers for Leaflet Draw
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  // Load route from DB into state
  useEffect(() => {
    if (routes) {
      if (routes && routes.length > 0) setRoutePoints(routes.map((r: Route) => ({ color: r?.points_color ?? '#782fc2', points: r.points ?? [] })));
      else {
        const fg = featureGroupRef.current;
        if (!fg) return;
        // remove ALL old polylines
        fg.clearLayers();
      }
    }
  }, [routes]);

  // Sync React state -> Leaflet editable layer (so loaded routes become editable)
  useEffect(() => {
    const fg = featureGroupRef.current;
    console.log(fg);
    if (!fg) return;

    // remove ALL old polylines
    fg.clearLayers();

    for (let index = 0; index < routePoints.length; index++) {
      const route = routePoints[index];
      const points = route.points;
      // Add new editable polyline if we have points
      if (points.length > 1) {
        const polyline = L.polyline(
          points.map((p) => [p.lat, p.lng] as [number, number]),
          { color: route.color ?? '#2563eb', weight: 6 }
        );

        fg.addLayer(polyline);
      }
    }
  }, [routePoints]);

  const onChoosing = (coordinates: LatLng) => {
    setDirection(coordinates);
  };

  useEffect(() => {
    // trigger clear in child
    setClearChooseDirection(true);

    if (!chooseDirection || !direction) return;

    onChoosedDirection?.({ type: chooseDirection, coordinates: direction });

    // reset direction so user can choose again
    setDirection(undefined);

    // optional: turn off clear flag right away (or child can ignore after clearing)
    setClearChooseDirection(false);
  }, [direction, chooseDirection, onChoosedDirection]);

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <MapContainer
        center={[initialCenter.lat, initialCenter.lng]}
        zoom={13}
        zoomControl={false}
        style={{ height: '100%', width: '100%', cursor: `${chooseDirection ? 'pointer' : 'grab'}` }}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" attribution="&copy; OpenStreetMap contributors" />
        {/* Adds draw + edit tools, and keeps state in sync */}
        <DrawToolbar featureGroupRef={featureGroupRef} />

        {chooseDirection && (
          <ClickToDropPin icon={chooseDirection == 'origin' ? 'red' : 'blue'} clearNow={clearChooseDirection} onSelect={onChoosing} />
        )}

        {/* Drop origin pin */}
        <ClickToDropPin tooltip="Origin location" icon="red" disabled={true} value={origin} />

        {/* Drop destination pin */}
        <ClickToDropPin tooltip="Destination" icon="blue" disabled={true} value={destination} />

        {/* Drop current location pin */}
        <ClickToDropPin tooltip="Current Location" icon="circle-blue" disabled={true} value={initialCenter} />

        {/* Optional: fly to initial center */}
        <FlyToLocation position={initialCenter} />
      </MapContainer>
    </div>
  );
}

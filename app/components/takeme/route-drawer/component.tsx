'use client';

import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { InputText } from 'primereact/inputtext';
import { LatLng, Route, RouteDoc } from '@/app/types/route';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png'
});

function toLatLngArray(layer: L.Polyline): LatLng[] {
  const latlngs = layer.getLatLngs() as L.LatLng[];
  return latlngs.map((p) => ({ lat: p.lat, lng: p.lng }));
}

function DrawToolbar({
  onRouteChange,
  featureGroupRef
}: {
  onRouteChange: (pts: LatLng[]) => void;
  featureGroupRef: React.MutableRefObject<L.FeatureGroup | null>;
}) {
  const map = useMap();

  useEffect(() => {
    const fg = new L.FeatureGroup();
    featureGroupRef.current = fg;
    map.addLayer(fg);

    // @ts-ignore
    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: true
      },
      edit: {
        featureGroup: fg,
        remove: true
      }
    });

    map.addControl(drawControl);

    const onCreated = (e: any) => {
      const layer = e.layer as L.Layer;
      fg.clearLayers();
      fg.addLayer(layer);

      if (layer instanceof L.Polyline) {
        onRouteChange(toLatLngArray(layer));
      }
    };

    const onEdited = (e: any) => {
      e.layers.eachLayer((layer: any) => {
        if (layer instanceof L.Polyline) {
          onRouteChange(toLatLngArray(layer));
        }
      });
    };

    const onDeleted = () => {
      fg.clearLayers();
      onRouteChange([]);
    };

    // @ts-ignore
    map.on(L.Draw.Event.CREATED, onCreated);
    // @ts-ignore
    map.on(L.Draw.Event.EDITED, onEdited);
    // @ts-ignore
    map.on(L.Draw.Event.DELETED, onDeleted);

    return () => {
      // @ts-ignore
      map.off(L.Draw.Event.CREATED, onCreated);
      // @ts-ignore
      map.off(L.Draw.Event.EDITED, onEdited);
      // @ts-ignore
      map.off(L.Draw.Event.DELETED, onDeleted);

      map.removeControl(drawControl);
      map.removeLayer(fg);
      featureGroupRef.current = null;
    };
  }, [map, onRouteChange, featureGroupRef]);

  return null;
}

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

export function RouteDrawer({
  initialCenter = { lat: 14.5995, lng: 120.9842 },
  customRoute,
  onSave
}: {
  initialCenter?: LatLng;
  onSave: (doc: RouteDoc) => Promise<void> | void;
  customRoute?: Route;
}) {
  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
  const [saving, setSaving] = useState(false);
  const [routeName, setRouteName] = useState('Route 1');

  // Holds the editable layers for Leaflet Draw
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  // Holds the current editable polyline layer
  const editableLayerRef = useRef<L.Polyline | null>(null);

  const handleSave = useCallback(async () => {
    if (routePoints.length < 2) return alert('Draw a route first.');
    setSaving(true);
    try {
      await onSave({ points: routePoints, name: routeName });
      alert('Saved!');
    } finally {
      setSaving(false);
    }
  }, [routePoints, onSave, routeName]);

  // Load route from DB into state
  useEffect(() => {
    if (customRoute) {
      setRouteName(customRoute.name);
      if (customRoute.points && customRoute.points.length > 0) setRoutePoints(customRoute.points);
    }
  }, [customRoute]);

  // Sync React state -> Leaflet editable layer (so loaded routes become editable)
  useEffect(() => {
    const fg = featureGroupRef.current;
    if (!fg) return;

    // Remove old editable polyline if exists
    if (editableLayerRef.current) {
      fg.removeLayer(editableLayerRef.current);
      editableLayerRef.current = null;
    }

    // Add new editable polyline if we have points
    if (routePoints.length > 1) {
      const polyline = L.polyline(
        routePoints.map((p) => [p.lat, p.lng] as [number, number]),
        { color: '#2563eb', weight: 4 }
      );

      fg.addLayer(polyline);
      editableLayerRef.current = polyline;
    }
  }, [routePoints]);

  return (
    <div style={{ height: 650 }}>
      <div style={{ padding: 12, display: 'flex', gap: 8, alignItems: 'center' }}>
        <button onClick={handleSave} disabled={saving || routePoints.length < 2}>
          {saving ? 'Saving...' : 'Save Route'}
        </button>

        <InputText placeholder="Route Name" value={routeName} onChange={(e) => setRouteName(e.target.value)} />

        <div style={{ fontSize: 12, opacity: 0.75 }}>
          Points: {routePoints.length}
          {routePoints.length ? ` | Start: ${routePoints[0].lat.toFixed(5)}, ${routePoints[0].lng.toFixed(5)}` : ''}
        </div>
      </div>

      <MapContainer center={[initialCenter.lat, initialCenter.lng]} zoom={13} style={{ height: 'calc(100% - 48px)', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />

        {/* Adds draw + edit tools, and keeps state in sync */}
        <DrawToolbar onRouteChange={setRoutePoints} featureGroupRef={featureGroupRef} />

        {/* Optional: fly to initial center */}
        <FlyToLocation position={initialCenter} />
      </MapContainer>

      <pre style={{ padding: 12, margin: 0, maxHeight: 180, overflow: 'auto', background: '#fafafa' }}>{JSON.stringify(routePoints, null, 2)}</pre>
    </div>
  );
}

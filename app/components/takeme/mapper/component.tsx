"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

import React, { useEffect, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import { LatLng, Route, RouteDoc, RoutePoints } from "@/app/types/route";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
});

function FlyToLocation({ position }: { position?: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lng], 15, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [position, map]);

  return null;
}

function DrawToolbar({
  featureGroupRef,
}: {
  featureGroupRef: React.RefObject<L.FeatureGroup | null>;
}) {
  const map = useMap();

  useEffect(() => {
    const fg = new L.FeatureGroup();
    featureGroupRef.current = fg;
    map.addLayer(fg);

    const drawControl = new L.Control.Draw({
      position: "topleft",
      draw: {
        polygon: false,
        rectangle: false,
        circle: false,
        circlemarker: false,
        marker: false,
        polyline: true,
      },
    });

    map.addControl(drawControl);

    const onCreated = (e: any) => {
      const layer = e.layer as L.Layer;
      fg.clearLayers();
      fg.addLayer(layer);

    };

    map.on(L.Draw.Event.CREATED, onCreated);

    return () => {
      map.off(L.Draw.Event.CREATED, onCreated);

      map.removeControl(drawControl);
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
  clearNow = false,
  clearPrevious = true,
}: {
  disabled?: boolean;
  clearNow?: boolean;
  value?: LatLng;
  onSelect?: (coords: LatLng) => void;
  clearPrevious?: boolean;
}) {
  const markerRef = React.useRef<L.Marker | null>(null);

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

      const marker = L.marker([lat, lng]).addTo(e.target);
      markerRef.current = marker;

      onSelect?.({ lat, lng });
    },
  });

  useEffect(() => {
    if (markerRef.current && clearNow) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [clearNow]);

  return value ? <Marker position={[value.lat, value.lng]} /> : null;
}

export function RouteMapper({

  origin,
  destination,
  chooseDirection,
  onChoosedDirection,

  initialCenter = { lat: 14.5995, lng: 120.9842 },
  routes,
}: {
  chooseDirection?: boolean;
  origin?: LatLng;
  destination?: LatLng;
  initialCenter?: LatLng;
  routes?: Route[];
  onChoosedDirection?: (origin: LatLng, destination: LatLng) => void;
}) {
  const [routePoints, setRoutePoints] = useState<RoutePoints[]>([]);
  const [direction, setDirection] = useState<LatLng[]>([]);

  const [clearChooseDirection, setClearChooseDirection] = useState<boolean>();

  // Holds the editable layers for Leaflet Draw
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);

  // Load route from DB into state
  useEffect(() => {
    if (routes) {
      if (routes && routes.length > 0)
        setRoutePoints(routes.map((r: Route) => ({ color: r?.points_color ?? '#782fc2', points: r.points ?? [] })));
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
          { color: route.color ?? "#2563eb", weight: 4 }
        );

        fg.addLayer(polyline);
      }
    }
  }, [routePoints]);

  const onChoosing = (coordinates: LatLng) => {
    setDirection([...direction, coordinates]);
  }

  useEffect(() => {
    if (direction.length !== 2) {
      setClearChooseDirection(false);
      return;
    }

    onChoosedDirection?.(direction[0], direction[1]);

    // trigger clear in child
    setClearChooseDirection(true);

    // reset direction so user can choose again
    setDirection([]);

    // optional: turn off clear flag right away (or child can ignore after clearing)
    // setClearChooseDirection(false);
  }, [direction, onChoosedDirection]);

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[initialCenter.lat, initialCenter.lng]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {/* Adds draw + edit tools, and keeps state in sync */}
        <DrawToolbar featureGroupRef={featureGroupRef} />

        {
          chooseDirection &&
          <ClickToDropPin
            clearNow={clearChooseDirection}
            onSelect={onChoosing}
          />
        }

        {/* Drop origin pin */}
        <ClickToDropPin
          disabled={true}
          value={origin}
        />

        {/* Drop destination pin */}
        <ClickToDropPin
          disabled={true}
          value={destination}
        />

        {/* Optional: fly to initial center */}
        <FlyToLocation position={initialCenter} />
      </MapContainer>
    </div>
  );
}

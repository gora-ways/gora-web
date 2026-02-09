'use client';

import RouteService from '@/app/services/RouteService';
import { LatLng, Route } from '@/app/types/route';
import { getCurrentLocation } from '@/app/utils/takeme/geolocation';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import RouteList from './components/RouteList';
const RouteDrawer = dynamic(() => import('@/app/components/takeme/route-drawer/component').then((m) => m.RouteDrawer), { ssr: false });

const HomePage = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<Route | undefined>();
  const [currentLocation, setCurrentLocation] = useState<LatLng>();

  const getRoutes = useCallback(async () => {
    const { data } = await RouteService.getRoutes();
    setRoutes(data);
  }, []);

  const getGeoLocaiton = useCallback(async () => {
    const location = await getCurrentLocation();
    setCurrentLocation(location);
  }, []);

  const onRouteSelected = (route: Route | undefined) => {
    if (route && route.points && route.points.length > 0) setCurrentLocation({ lat: route?.points[0].lat, lng: route?.points[0].lng });
    setSelectedRoute(route);
  };

  useEffect(() => {
    getGeoLocaiton();
  }, [getGeoLocaiton]);

  useEffect(() => {
    getRoutes();
  }, [getRoutes]);

  return (
    <div className="grid">
      <div className="col-9">
        <RouteDrawer
          customRoute={selectedRoute}
          initialCenter={currentLocation}
          onSave={async (doc) => {
            const geojson = {
              type: 'LineString',
              coordinates: doc.points.map((p) => [p.lng, p.lat])
            };
            await fetch('http://localhost:8923/api/routes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: doc.name, geojson, points: doc.points })
            });
          }}
        />
      </div>
      <div className="col-3">
        <RouteList routes={routes} selectedRoute={onRouteSelected} />
      </div>
    </div>
  );
};

export default HomePage;

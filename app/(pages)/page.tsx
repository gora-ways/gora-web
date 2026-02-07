'use client';

import { FloatingRouteList } from '../components/takeme/explore/suggested-routes/component';
import { FloatingRouteSearch } from '../components/takeme/explore/search-bar/component';
import { LatLng } from '../types/route';
import { LoadingProgress } from '../components/loading-progress/component';
import { useExplorePage } from './(explore)/hooks/useExplorePage';
import { useHasMounted } from '../hooks/useHasMounted';
import dynamic from 'next/dynamic';
import FloatAlertDirectionChooser from '../components/float-alert-direction-chooser/component';
import InitialLoader from '../components/initial-loader/component';
import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const RouteMapper = dynamic(() => import('@/app/components/takeme/mapper/component').then((m) => m.RouteMapper), { ssr: false });

const HomePage = () => {
  const {
    chooseOnMap,
    destinationCoordinates,
    initialLocations,
    isRouteFareFetching,
    originCoordinates,
    routeFares,
    routes,
    hideSearchBar,

    chooseDirection,
    clearSearch,
    onSearchRoute,
    searchLocation,
    setOnChooseMap,
    setRoutes,
    setHideSearchBar
  } = useExplorePage();

  const [isMounted, setIsMounted] = useState(false);
  const comMounted = useHasMounted();

  useEffect(() => {
    if (comMounted) {
      const t = setTimeout(() => setIsMounted(true), 1200);
      return () => clearTimeout(t);
    }
  }, [comMounted]);

  // @NOTE: Disable for beta version
  // const { currentLocation } = useCurrentLocation();

  // @NOTE: Fix location only for LAPU LAPU area scope. ONLY FOR BETA VERSION
  const [fixLocation] = useState<LatLng>({
    lat: 10.285748,
    lng: 123.9744526
  });

  return (
    <>
      <InitialLoader visible={!isMounted} appName="GORA" tagline="Discover Lapu-Lapu, Philippines — map your trip, ride like a local." />
      <div style={{ height: '100vh', width: '100vw' }}>
        {chooseOnMap && <FloatAlertDirectionChooser type={chooseOnMap} />}

        <RouteMapper
          chooseDirection={chooseOnMap}
          destination={destinationCoordinates}
          initialCenter={fixLocation}
          onChoosedDirection={chooseDirection}
          origin={originCoordinates}
          routes={routes}
          disableInitialCenterPinning={true} // @NOTE: ONLY FOR BETA
        />

        <FloatingRouteSearch
          initialLocations={initialLocations}
          onClear={clearSearch}
          onSearchRoute={onSearchRoute}
          onSelectMap={(type) => {
            setOnChooseMap(type);
            setHideSearchBar(true);
          }}
          searchLocations={searchLocation}
          hideSearchBar={hideSearchBar}
        />

        {routeFares.length != 0 && (
          <FloatingRouteList
            locations={initialLocations}
            onRouteClick={(routeFare) => setRoutes(routeFare.route_fare.map((r) => r.route))}
            route_fares={routeFares}
          />
        )}

        {isRouteFareFetching && <LoadingProgress />}

        <p style={{ position: 'absolute', bottom: '10px', zIndex: 900, left: '10px' }}>Beta version — available only in Lapu-Lapu City, PH.</p>
      </div>
    </>
  );
};

export default HomePage;

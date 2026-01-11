'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import { FloatingRouteSearch } from '../components/takeme/explore/search-bar/component';
import { useExplorePage } from './(explore)/hooks/useExplorePage';
import { FloatingRouteList } from '../components/takeme/explore/suggested-routes/component';
import useCurrentLocation from '../hooks/useCurrentLocation';
import { LoadingProgress } from '../components/loading-progress/component';

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

    chooseDirection,
    clearSearch,
    onSearchRoute,
    searchLocation,
    setOnChooseMap,
    setRoutes,
  } = useExplorePage();

  const { currentLocation } = useCurrentLocation();


  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <RouteMapper
        chooseDirection={chooseOnMap}
        destination={destinationCoordinates}
        initialCenter={currentLocation}
        onChoosedDirection={chooseDirection}
        origin={originCoordinates}
        routes={routes}
      />

      <FloatingRouteSearch
        initialLocations={initialLocations}
        onClear={clearSearch}
        onSearchRoute={onSearchRoute}
        onSelectMap={() => setOnChooseMap(true)}
        searchLocations={searchLocation}
      />

      {
        routeFares.length != 0 &&
        <FloatingRouteList
          onRouteClick={routeFare => setRoutes(routeFare.route_fare.map(r => r.route))}
          route_fares={routeFares}
        />
      }

      {
        isRouteFareFetching &&
        <LoadingProgress />
      }
    </div>
  );
};

export default HomePage;

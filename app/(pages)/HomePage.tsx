'use client';

import { FloatingRouteList } from '../components/takeme/explore/suggested-routes/component';
import { FloatingRouteSearch } from '../components/takeme/explore/search-bar/component';
import { LoadingProgress } from '../components/loading-progress/component';
import { useExplorePage } from './(explore)/hooks/useExplorePage';
import { useHasMounted } from '../hooks/useHasMounted';
import dynamic from 'next/dynamic';
import FloatAlertDirectionChooser from '../components/float-alert-direction-chooser/component';
import InitialLoader from '../components/initial-loader/component';
import React, { useEffect, useState } from 'react';
import { Toast } from 'primereact/toast';

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
    noRoutesFound,
    zoomTo,
    fixLocation,
    toast,
    setZoomTo,
    chooseDirection,
    clearSearch,
    onSearchRoute,
    searchLocation,
    setOnChooseMap,
    setRoutes,
    setHideSearchBar,
    shareUrl
  } = useExplorePage();

  const [isMounted, setIsMounted] = useState(false);
  const comMounted = useHasMounted();

  useEffect(() => {
    if (comMounted) {
      const t = setTimeout(() => setIsMounted(true), 1200);
      return () => clearTimeout(t);
    }
  }, [comMounted]);

  return (
    <>
      <InitialLoader visible={!isMounted} appName="GORA" tagline="Discover Lapu-Lapu, Philippines — map your trip, ride like a local." />
      <div style={{ height: '100vh', width: '100vw' }}>
        {noRoutesFound && (
          <div
            style={{ position: 'absolute', zIndex: 900, width: '100%', backgroundColor: '#2BCBBA', color: 'white' }}
            className={`text-center bg-red-600`}
          >
            <p className="text-center p-1">No routes were found for the selected direction. Please try again.</p>
          </div>
        )}

        {chooseOnMap && <FloatAlertDirectionChooser type={chooseOnMap} />}

        <RouteMapper
          chooseDirection={chooseOnMap}
          destination={destinationCoordinates}
          initialCenter={fixLocation}
          onChoosedDirection={chooseDirection}
          origin={originCoordinates}
          routes={routes}
          flyTo={zoomTo}
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
            onDirectionClick={(direction) => setZoomTo(direction)}
            locations={initialLocations}
            onRouteClick={(routeFare) => setRoutes(routeFare.route_fare.map((r) => r.route))}
            onShareClick={shareUrl}
            route_fares={routeFares}
          />
        )}

        {isRouteFareFetching && <LoadingProgress />}

        <p style={{ position: 'absolute', bottom: '10px', zIndex: 900, left: '10px' }}>Beta version — available only in Lapu-Lapu City, PH.</p>

        <Toast ref={toast} />
      </div>
    </>
  );
};

export default HomePage;

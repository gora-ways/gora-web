import { LocationOption } from '@/app/components/takeme/explore/search-bar/component';
import RouteService from '@/app/services/RouteService';
import { LatLng, Route, RouteFares } from '@/app/types/route';
import { reverseGeocode, searchLocation } from '@/app/utils';
import { useEffect, useState } from 'react';

export const useExplorePage = () => {
  // Loading State
  const [isRouteFareFetching, setIsRouteFareFetching] = useState<boolean>(false);
  const [hideSearchBar, setHideSearchBar] = useState<boolean | undefined>();

  const [chooseOnMap, setOnChooseMap] = useState<'origin' | 'destination' | undefined>(undefined);

  // Initial locations
  const [originCoordinates, setOriginCoordinates] = useState<LatLng | undefined>();
  const [destinationCoordinates, setDestinationCoordinates] = useState<LatLng | undefined>();
  const [initialLocations, setInitialLocations] = useState<{ origin?: LocationOption; destination?: LocationOption } | undefined>();

  // Fares
  const [routeFares, setRouteFares] = useState<RouteFares[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);

  const searchNearestRoutes = async (origin: LatLng, destination: LatLng) => {
    // Search possible routes
    try {
      setIsRouteFareFetching(true);

      const { data } = await RouteService.getNearestRoutes({
        origin_lat: origin.lat,
        origin_lng: origin.lng,
        destination_lat: destination.lat,
        destination_lng: destination.lng,
        radius: 100
      });

      const fares: RouteFares[] = data.map((r) => ({ total_fare: r.reduce((sum, r) => sum + (r.estimate_fare ?? 0), 0), route_fare: r }));

      setRouteFares(fares);

      if (fares.length != 0) {
        // Get the first route only and set as initial
        const fare = fares[0];
        setRoutes(fare.route_fare.map((r) => r.route));
      }

      setHideSearchBar(true);
    } catch (error) {
      throw error;
    } finally {
      setIsRouteFareFetching(false);
    }
  };

  const onSearchRoute = ({ origin, destination }: { origin?: LocationOption; destination?: LocationOption }) => {
    if (!origin || !destination) return;

    const orig = { lat: Number(origin.lat), lng: Number(origin.lng) };
    const dest = { lat: Number(destination.lat), lng: Number(destination.lng) };

    searchNearestRoutes(orig, dest);
  };

  const chooseDirection = async ({ type, coordinates }: { type: 'origin' | 'destination'; coordinates: LatLng }) => {
    setHideSearchBar(false);
    if (type == 'origin') {
      setOriginCoordinates(coordinates);
      const originGeo = await reverseGeocode(coordinates.lat, coordinates.lng);
      setInitialLocations({ ...initialLocations, origin: originGeo });
    } else if (type == 'destination') {
      setDestinationCoordinates(coordinates);
      const destGeo = await reverseGeocode(coordinates.lat, coordinates.lng);
      setInitialLocations({ ...initialLocations, destination: destGeo });
    }

    setOnChooseMap(undefined);
  };

  const clearSearch = () => {
    // Clear searches and routes
    setOriginCoordinates(undefined);
    setDestinationCoordinates(undefined);
    setInitialLocations(undefined);
    setRouteFares([]);
    setRoutes([]);
    setOnChooseMap(undefined);
  };

  useEffect(() => {
    if (initialLocations && initialLocations.destination && initialLocations.origin)
      onSearchRoute({ origin: initialLocations.origin, destination: initialLocations.destination });
  }, [initialLocations]);

  return {
    chooseDirection,
    clearSearch,
    onSearchRoute,
    searchLocation,
    searchNearestRoutes,
    setDestinationCoordinates,
    setHideSearchBar,
    setOnChooseMap,
    setOriginCoordinates,
    setRouteFares,
    setRoutes,
    chooseOnMap,
    destinationCoordinates,
    hideSearchBar,
    initialLocations,
    isRouteFareFetching,
    originCoordinates,
    routeFares,
    routes
  };
};

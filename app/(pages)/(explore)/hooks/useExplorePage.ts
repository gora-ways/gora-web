import { LocationOption } from '@/app/components/takeme/explore/search-bar/component';
import useLocationParams from '@/app/hooks/useLocationParams';
import RouteService from '@/app/services/RouteService';
import { LatLng, Route, RouteFares } from '@/app/types/route';
import { copyToClipboard, reverseGeocode, searchLocation } from '@/app/utils';
import { useEffect, useRef, useState } from 'react';

export const useExplorePage = () => {
  // @NOTE: Disable for beta version
  // const { currentLocation } = useCurrentLocation();

  // @NOTE: Fix location only for LAPU LAPU area scope. ONLY FOR BETA VERSION
  const [fixLocation] = useState<LatLng>({
    lat: 10.285748,
    lng: 123.9744526
  });

  // Loading State
  const [isRouteFareFetching, setIsRouteFareFetching] = useState<boolean>(false);
  const [hideSearchBar, setHideSearchBar] = useState<boolean | undefined>();

  const [chooseOnMap, setOnChooseMap] = useState<'origin' | 'destination' | undefined>(undefined);
  const [zoomTo, setZoomTo] = useState<'origin' | 'destination' | undefined>(undefined);

  const { setCoordinateParameters, clearCoordinateParams, getCoordinateParameters, coordinateParams, getUrl } = useLocationParams();
  const cood = getCoordinateParameters();

  // Initial locations
  const [originCoordinates, setOriginCoordinates] = useState<LatLng | undefined>();
  const [destinationCoordinates, setDestinationCoordinates] = useState<LatLng | undefined>();
  const [initialLocations, setInitialLocations] = useState<{ origin?: LocationOption; destination?: LocationOption } | undefined>();

  // Fares
  const [routeFares, setRouteFares] = useState<RouteFares[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [noRoutesFound, setNoRoutesFound] = useState<boolean>(false);

  const toast = useRef(null);

  const showCopiedMessage = () => {
    if (toast?.current) {
      // @ts-ignore
      toast.current?.show({ severity: 'contrast', summary: 'GORA', detail: 'Shareable link copied.' });
    }
  };

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
        setHideSearchBar(true);
      } else if (fares.length == 0) {
        setHideSearchBar(false);
        setNoRoutesFound(true);
      }
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
    setNoRoutesFound(false);
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
    setNoRoutesFound(false);
    clearCoordinateParams();
  };

  const shareUrl = () => {
    copyToClipboard(getUrl());
    showCopiedMessage();
  };

  const initialLoadCoordinateParams = async () => {
    let loc = initialLocations;
    // Set the coordinates coming from url parameter
    if (cood.origin) {
      setOriginCoordinates(cood.origin);
      const originGeo = await reverseGeocode(cood.origin.lat, cood.origin.lng);
      loc = {
        ...loc,
        origin: originGeo
      };
    }

    if (cood.destination) {
      setDestinationCoordinates(cood.destination);
      const destGeo = await reverseGeocode(cood.destination.lat, cood.destination.lng);
      loc = {
        ...loc,
        destination: destGeo
      };
    }
    setInitialLocations({ ...initialLocations, ...loc });
  };

  useEffect(() => {
    if (initialLocations && initialLocations.destination && initialLocations.origin) {
      onSearchRoute({ origin: initialLocations.origin, destination: initialLocations.destination });
    }
  }, [initialLocations]);

  useEffect(() => {
    // Append params
    if (initialLocations) setCoordinateParameters('current', fixLocation);
  }, [initialLocations]);

  useEffect(() => {
    // Append params
    if (destinationCoordinates) setCoordinateParameters('destination', destinationCoordinates);
  }, [destinationCoordinates]);

  useEffect(() => {
    // Append params
    if (originCoordinates) setCoordinateParameters('origin', originCoordinates);
  }, [originCoordinates]);

  useEffect(() => {
    // Initialize first value from url parameters
    if (coordinateParams) initialLoadCoordinateParams();
  }, []);

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
    setZoomTo,
    shareUrl,
    fixLocation,
    toast,
    zoomTo,
    chooseOnMap,
    destinationCoordinates,
    hideSearchBar,
    initialLocations,
    isRouteFareFetching,
    originCoordinates,
    routeFares,
    routes,
    noRoutesFound
  };
};

import { LocationOption } from "@/app/components/takeme/explore/search-bar/component";
import RouteService from "@/app/services/RouteService";
import { LatLng, Route, RouteFares } from "@/app/types/route";
import { reverseGeocode, searchLocation } from "@/app/utils";
import { useState } from "react";

export const useExplorePage = () => {

  // Loading State
  const [isRouteFareFetching, setIsRouteFareFetching] = useState<boolean>(false);

  const [chooseOnMap, setOnChooseMap] = useState<boolean>(false);

  // Initial locations
  const [originCoordinates, setOriginCoordinates] = useState<LatLng | undefined>();
  const [destinationCoordinates, setDestinationCoordinates] = useState<LatLng | undefined>();
  const [initialLocations, setInitialLocations] = useState<{ origin: LocationOption; destination: LocationOption } | undefined>();

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

      const fares: RouteFares[] = data.map(r => ({ total_fare: r.reduce((sum, r) => sum + (r.estimate_fare ?? 0), 0), route_fare: r }));

      setRouteFares(fares);

      if (fares.length != 0) {
        // Get the first route only and set as initial
        const fare = fares[0];
        setRoutes(fare.route_fare.map(r => r.route));
      }
    } catch (error) {
      throw error;
    } finally {
      setIsRouteFareFetching(false);
    }
  }

  const onSearchRoute = ({ origin, destination }: any) => {
    const orig = { lat: Number(origin.lat), lng: Number(origin.lng) };
    const dest = { lat: Number(destination.lat), lng: Number(destination.lng) };
    setOriginCoordinates(orig);
    setDestinationCoordinates(dest)
    searchNearestRoutes(orig, dest);
  }

  const chooseDirection = async (origin: LatLng, destination: LatLng) => {

    // Reverse direction searching using geolocation or choose on map feature
    const originGeo = await reverseGeocode(origin.lat, origin.lng);
    const destGeo = await reverseGeocode(destination.lat, destination.lng);

    onSearchRoute({ origin: originGeo, destination: destGeo });
    setInitialLocations({ origin: originGeo, destination: destGeo });
    setOnChooseMap(false);
  }

  const clearSearch = () => {
    // Clear searches and routes
    setOriginCoordinates(undefined);
    setDestinationCoordinates(undefined);
    setInitialLocations(undefined);
    setRouteFares([]);
    setRoutes([]);
    setOnChooseMap(false);
  }

  return {
    clearSearch,
    onSearchRoute,
    searchLocation,
    searchNearestRoutes,
    setRouteFares,
    setRoutes,
    setDestinationCoordinates,
    setOriginCoordinates,
    setOnChooseMap,
    chooseDirection,
    initialLocations,
    routes,
    routeFares,
    isRouteFareFetching,
    originCoordinates,
    destinationCoordinates,
    chooseOnMap,
  };
};

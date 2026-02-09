import { env } from '@/app/config';
import { LatLng } from '@/app/types/route';
import { useState } from 'react';

interface LocationParamsInterface {
  origin?: LatLng;
  destination?: LatLng;
  current?: LatLng;
}

export const useTour = () => {
  const [tourStarted, setTourStarted] = useState<boolean>(false);
  const [tourCoordinates] = useState<LocationParamsInterface>({
    origin: env.tour.origin,
    destination: env.tour.destination,
    current: env.tour.current
  });

  return {
    tourStarted,
    tourCoordinates,
    setTourStarted
  };
};

import { env } from '@/app/config';
import { useHasMounted } from '@/app/hooks/useHasMounted';
import { LatLng } from '@/app/types/route';
import { useLocalStorage } from 'primereact/hooks';
import { useEffect, useState } from 'react';

interface LocationParamsInterface {
  origin?: LatLng;
  destination?: LatLng;
  current?: LatLng;
}

export const useTour = () => {
  const [firstTour, setFirstTour] = useLocalStorage('Nan', 'first-tour');
  const [tourStarted, setTourStarted] = useState<boolean>(false);
  const [autoStartTour, setAutoStartTour] = useState<boolean>(false);

  const mounted = useHasMounted();

  const [tourCoordinates] = useState<LocationParamsInterface>({
    origin: env.tour.origin,
    destination: env.tour.destination,
    current: env.tour.current
  });

  const initFirstTour = () => {
    setFirstTour('1');
  };

  const completeFirstTour = () => {
    setFirstTour('0');
  };

  useEffect(() => {
    if (!mounted) return; // Wait for the component to load

    if (firstTour == 'Nan') initFirstTour();
    if (firstTour == '1') setAutoStartTour(true);
    if (firstTour == '0') setAutoStartTour(false);
  }, [firstTour, mounted]);

  return {
    autoStartTour,
    tourStarted,
    tourCoordinates,
    completeFirstTour,
    setTourStarted
  };
};

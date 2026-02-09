import { useMemo } from 'react';
import { LatLng } from '../types/route';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const paramKeys = {
  origin: 'r',
  destination: 'd',
  current: 'c'
};
const coordinateKeys = {
  lat: 'l',
  lng: 'ln'
};

interface LocationParamsInterface {
  origin?: LatLng;
  destination?: LatLng;
  current?: LatLng;
}

export default function useLocationParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const search = searchParams.toString();

  const coordinateParams = useMemo(() => {
    return new URLSearchParams(search);
  }, [search]);

  const locationParameters = useMemo<LocationParamsInterface | undefined>(() => {
    const res: LocationParamsInterface = {};

    const cood = {
      origin: {
        lat: coordinateParams.get('rl'),
        lng: coordinateParams.get('rln')
      },
      destination: {
        lat: coordinateParams.get('dl'),
        lng: coordinateParams.get('dln')
      },
      current: {
        lat: coordinateParams.get('cl'),
        lng: coordinateParams.get('cln')
      }
    };

    if (cood.current.lat && cood.current.lng) res.current = { lat: +cood.current.lat, lng: +cood.current.lng };

    if (cood.origin.lat && cood.origin.lng) res.origin = { lat: +cood.origin.lat, lng: +cood.origin.lng };

    if (cood.destination.lat && cood.destination.lng) res.destination = { lat: +cood.destination.lat, lng: +cood.destination.lng };

    return Object.keys(res).length ? res : undefined;
  }, [coordinateParams]);

  const setCoordinateParameters = (type: 'origin' | 'destination' | 'current', coordinates: LatLng) => {
    coordinateParams.set(`${paramKeys[type]}${coordinateKeys.lng}`, coordinates.lng.toString());
    coordinateParams.set(`${paramKeys[type]}${coordinateKeys.lat}`, coordinates.lat.toString());
    router.push(`${pathname}?${coordinateParams.toString()}`);
  };

  const clearCoordinateParams = () => {
    const params = new URLSearchParams(searchParams.toString());

    // origin
    params.delete(`${paramKeys['origin']}${coordinateKeys.lng}`);
    params.delete(`${paramKeys['origin']}${coordinateKeys.lat}`);

    // destination
    params.delete(`${paramKeys['destination']}${coordinateKeys.lng}`);
    params.delete(`${paramKeys['destination']}${coordinateKeys.lat}`);

    // current
    params.delete(`${paramKeys['current']}${coordinateKeys.lng}`);
    params.delete(`${paramKeys['current']}${coordinateKeys.lat}`);

    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    router.replace(url);
  };

  const getUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}?${searchParams.toString()}`;
  };

  return {
    locationParameters,
    getUrl,
    setCoordinateParameters,
    clearCoordinateParams
  };
}

import { useEffect, useState } from 'react';
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

const encodeKey = 'dq';

interface LocationParamsInterface {
  origin?: LatLng;
  destination?: LatLng;
  current?: LatLng;
}

export default function useLocationParams() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const coordinateParams = new URLSearchParams(searchParams.toString());

  const setCoordinateParameters = (type: 'origin' | 'destination' | 'current', coordinates: LatLng) => {
    coordinateParams.set(`${paramKeys[type]}${coordinateKeys.lng}`, coordinates.lng.toString());
    coordinateParams.set(`${paramKeys[type]}${coordinateKeys.lat}`, coordinates.lat.toString());
    router.push(`${pathname}?${coordinateParams.toString()}`);
  };

  const clearCoordinateParams = () => {
    router.push(`${pathname}`);
  };

  const getCoordinateParameters = (): LocationParamsInterface => {
    const res: LocationParamsInterface = {};
    const cood = {
      origin: {
        lat: coordinateParams.get(`${paramKeys.origin}${coordinateKeys.lat}`),
        lng: coordinateParams.get(`${paramKeys.origin}${coordinateKeys.lng}`)
      },
      destination: {
        lat: coordinateParams.get(`${paramKeys.destination}${coordinateKeys.lat}`),
        lng: coordinateParams.get(`${paramKeys.destination}${coordinateKeys.lng}`)
      },
      current: {
        lat: coordinateParams.get(`${paramKeys.current}${coordinateKeys.lat}`),
        lng: coordinateParams.get(`${paramKeys.current}${coordinateKeys.lng}`)
      }
    };

    // Get Origin
    if (cood.current.lat && cood.current.lng) res.current = { lat: Number(cood.current.lat), lng: Number(cood.current.lng) };
    if (cood.origin.lat && cood.origin.lng) res.origin = { lat: Number(cood.origin.lat), lng: Number(cood.origin.lng) };
    if (cood.destination.lat && cood.destination.lng) res.destination = { lat: Number(cood.destination.lat), lng: Number(cood.destination.lng) };

    return res;
  };

  const getUrl = () => {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}?${searchParams.toString()}`;
  };

  return {
    coordinateParams,
    getUrl,
    setCoordinateParameters,
    clearCoordinateParams,
    getCoordinateParameters
  };
}

'use client';

import React, { Suspense } from 'react';
import HomePage from './HomePage';
import { useTour } from './(explore)/hooks/useTour';
import { GORA_TOURS } from '../constants/tour';
import { NextStep } from 'nextstepjs';

const Page = () => {
  const { completeFirstTour } = useTour();
  return (
    <Suspense fallback={null}>
      <NextStep steps={GORA_TOURS} overlayZIndex={6000} onSkip={() => completeFirstTour()} onComplete={() => completeFirstTour()}>
        <HomePage />
      </NextStep>
    </Suspense>
  );
};

export default Page;

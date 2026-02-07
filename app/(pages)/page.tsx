import React, { Suspense } from 'react';
import HomePage from './HomePage';

const Page = () => {
  return (
    <Suspense fallback={null}>
      <HomePage />
    </Suspense>
  );
};

export default Page;

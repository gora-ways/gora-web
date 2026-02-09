import { GORA_TOUR_NAME } from '@/app/constants/tour';
import { useNextStep } from 'nextstepjs';
import { Button } from 'primereact/button';
import { useCallback, useEffect } from 'react';

import './component.scss';

interface TourControllerProps {
  start?: boolean;
  onStartClick?: () => void;
  onStopClick?: () => void;
}

export function TourController({ onStartClick, start }: TourControllerProps) {
  const { startNextStep, currentTour } = useNextStep();

  const handleStartTour = () => {
    startNextStep(GORA_TOUR_NAME);
    onStartClick?.();
  };

  useEffect(() => {
    if (start) handleStartTour();
  }, [start]);

  return (
    <div className="tour-controller">
      {!currentTour && (
        <Button
          icon="pi pi-question"
          rounded
          severity="danger"
          iconPos="right"
          label="Usage"
          size="small"
          tooltip="Start GORA Tour how to use the app."
          tooltipOptions={{ position: 'left' }}
          onClick={handleStartTour}
        />
      )}
    </div>
  );
}

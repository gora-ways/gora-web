import React, { useMemo, useState } from 'react';
import { Card } from 'primereact/card';
import { RouteFares } from '@/app/types/route';
import { Accordion, AccordionTab, AccordionTabChangeEvent } from 'primereact/accordion';
import './component.scss';

type Props = {
  route_fares: RouteFares[];
  top?: number;
  right?: number;
  width?: number | string;
  onRouteClick?: (route_fare: RouteFares) => void;
};

export function FloatingRouteList({ route_fares, onRouteClick, top = 16, right = 16, width = 360 }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      top,
      right,
      width,
      zIndex: 1000
    }),
    [top, right, width]
  );

  const onTabChange = (event: AccordionTabChangeEvent) => {
    const routeFare = route_fares[Number(event.index)];
    setActiveIndex(Number(event.index));
    if (onRouteClick) onRouteClick(routeFare);
  };

  return (
    <div className="suggested-routes" style={containerStyle}>
      <div className="suggestion-box">
        <Accordion activeIndex={activeIndex} onTabChange={onTabChange}>
          {route_fares.map((r, i) => (
            <AccordionTab
              key={`route-${i}`}
              headerTemplate={
                <div className="flex align-items-center gap-2">
                  <span className="pi pi-directions"></span>
                  <span>{`Route ${i + 1} - ₱${r.total_fare}`}</span>
                </div>
              }
            >
              <p>
                <strong>Estimate Total Fare:</strong> ₱{r.total_fare}
              </p>
              <p>
                <strong>Route Breakdown</strong>
              </p>
              {r.route_fare.map((rf, j) => (
                <div className="route-leg" key={`r${j}`}>
                  <div className="route-dot" style={{ backgroundColor: rf.route.points_color ?? 'black' }}>
                    &nbsp;
                  </div>
                  <div className="route-name"> {rf.route.name}</div>
                  <span className="fare-pill">₱{rf.estimate_fare}</span>
                </div>
              ))}
            </AccordionTab>
          ))}
        </Accordion>
      </div>
      <small>
        Disclaimer: The fare information provided is for estimation purposes only and does not represent final or guaranteed pricing. Actual fares may
        vary due to traffic conditions, route adjustments, availability of transport, and local fare regulations.
      </small>
    </div>
  );
}

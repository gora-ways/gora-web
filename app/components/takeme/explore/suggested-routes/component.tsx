import React, { useMemo, useState } from 'react';
import { RouteFares } from '@/app/types/route';
import { Accordion, AccordionTab, AccordionTabChangeEvent } from 'primereact/accordion';
import './component.scss';
import { useMediaQuery } from '@/app/hooks/useMediaQuery';
import { LocationOption } from '../search-bar/component';
import { Button } from 'primereact/button';

type Props = {
  route_fares: RouteFares[];
  locations?: { origin?: LocationOption; destination?: LocationOption };
  onRouteClick?: (route_fare: RouteFares) => void;
  onDirectionClick?: (direction: 'destination' | 'origin') => void;
};

export function FloatingRouteList({ route_fares, onRouteClick, onDirectionClick, locations }: Props) {
  const isMobile = useMediaQuery();

  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const onTabChange = (event: AccordionTabChangeEvent) => {
    if (event.index != null) {
      const routeFare = route_fares[Number(event.index)];
      setActiveIndex(Number(event.index));
      if (onRouteClick) onRouteClick(routeFare);
    } else {
      setActiveIndex(null);
    }
  };

  return (
    <div className={`suggested-routes ${isMobile ? 'mobile' : ''}`}>
      <div className={`suggestion-box`}>
        <p className="m-0">
          <i className="pi pi pi-directions text-blue-600"></i> <small> Direction:</small>
        </p>
        {locations && (
          <div className="w-full mb-3">
            <div className="flex gap-2 m-2">
              <Button
                label={locations.origin?.label}
                title={locations.origin?.label}
                outlined
                rounded
                severity="danger"
                className="btn-direction"
                icon="pi pi-directions"
                onClick={() => onDirectionClick && onDirectionClick('origin')}
              />
              <Button
                label={locations.destination?.label}
                title={locations.destination?.label}
                outlined
                rounded
                className="btn-primary btn-direction"
                icon="pi pi-directions-alt"
                onClick={() => onDirectionClick && onDirectionClick('destination')}
              />
            </div>
          </div>
        )}

        <p className="m-0 mb-2">
          <i className="pi pi-star-fill text-yellow-600"></i> <small>Suggested Routes:</small>
        </p>

        <Accordion activeIndex={activeIndex} onTabChange={onTabChange}>
          {route_fares.map((r, i) => (
            <AccordionTab
              key={`route-${i}`}
              headerTemplate={
                <div className="flex justify-content-center align-items-center gap-2 m-2">
                  <span className="pi pi-directions"></span>
                  <span>{`Route ${i + 1} - ₱${r.total_fare}`}</span>
                </div>
              }
            >
              <p>
                <strong className="text-red-600">
                  <i className="pi pi-directions"></i>&nbsp;From:
                </strong>{' '}
                <small>{locations?.origin?.label}</small>
              </p>
              <p>
                <strong className="text-blue-600">
                  <i className="pi pi-map-marker"></i>&nbsp;To:
                </strong>{' '}
                <small>{locations?.destination?.label}</small>
              </p>
              <p>
                <strong>
                  <i className="pi pi-money-bill"></i>&nbsp;Estimate Total Fare:
                </strong>{' '}
                ₱{r.total_fare}
                <br />
                <strong>
                  <i className="pi pi-car"></i>&nbsp;No. of Vehicles:
                </strong>{' '}
                {r.route_fare.length}
              </p>
              <hr />
              <p>
                <strong>
                  <i className="pi pi-bars"></i>&nbsp;Route Breakdown
                </strong>
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
      {!isMobile && (
        <small className="p-3" style={{ position: 'fixed', bottom: 0 }}>
          Disclaimer: The fare information provided is for estimation purposes only and does not represent final or guaranteed pricing. Actual fares
          may vary due to traffic conditions, route adjustments, availability of transport, and local fare regulations.
        </small>
      )}
    </div>
  );
}

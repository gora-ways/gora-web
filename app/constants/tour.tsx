import { Tour } from 'nextstepjs';
export const GORA_TOUR_NAME = 'gora-first-usage';

export const GORA_TOUR_STEP_SELECTOR = {
  FIRST: 'gr-tour-f1',
  SECOND: 'gr-tour-f2',
  THIRD: 'gr-tour-f3',
  FOURTH: 'gr-tour-f4',
  FIFTH: 'gr-tour-f5',
  SIXTH: 'gr-tour-f6',
  SEVENTH: 'gr-tour-f7',
  EIGHT: 'gr-tour-f8',
  NINTH: 'gr-tour-f9',
  TENTH: 'gr-tour-f10'
};

export const GORA_TOURS: Tour[] = [
  {
    tour: GORA_TOUR_NAME,
    steps: [
      {
        icon: <>👋</>,
        title: `Welcome to GORA! Let's plan your route.`,
        content: (
          <>
            Click the <strong>&quot;Guide Me&quot;</strong> button to begin planning your route.
          </>
        ),
        selector: `#${GORA_TOUR_STEP_SELECTOR.FIRST}`,
        side: 'top',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      },
      {
        icon: <>📍</>,
        title: 'Set Your Origin',
        content: (
          <>
            <strong>Search for your origin</strong> or <strong>simply pin / click a location on the map</strong> to mark where you&apos;re starting
            from.
          </>
        ),
        selector: `#${GORA_TOUR_STEP_SELECTOR.SECOND}`,
        side: 'top',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      },
      {
        icon: <>📍</>,
        title: 'Set Your Destination',
        content: <>Search for your destination or pin / click on the map to choose where you&apos;re going.</>,
        selector: `#${GORA_TOUR_STEP_SELECTOR.THIRD}`,
        side: 'top',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      },
      {
        icon: <>👉</>,
        title: 'Click GORA Button',
        content: <>Ready to go? Hit the GORA button and let&apos;s roll</>,
        selector: `#${GORA_TOUR_STEP_SELECTOR.FOURTH}`,
        side: 'top',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      },
      {
        icon: <>🗺️</>,
        title: 'View Available Routes',
        content: <>GORA will draw the route on the map and show all available route options, so you can compare and choose the best one.</>,
        selector: `#${GORA_TOUR_STEP_SELECTOR.FIFTH}`,
        side: 'bottom',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      },

      {
        icon: <>💸</>,
        title: 'Check the Estimated Fare',
        content: <>See the estimated fare based on your selected route—no surprises.</>,
        selector: `#${GORA_TOUR_STEP_SELECTOR.SIXTH}`,
        side: 'top',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      },

      {
        icon: <>📌</>,
        title: 'Tip: Locate Your Origin',
        content: <>Tap the Origin button to quickly highlight where your starting point is on the map.</>,
        selector: `#${GORA_TOUR_STEP_SELECTOR.SEVENTH}`,
        side: 'top-right',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      },

      {
        icon: <>📌</>,
        title: 'Tip: Locate Your Destination',
        content: <>Tap the Destination button to instantly show where your destination is on the map.</>,
        selector: `#${GORA_TOUR_STEP_SELECTOR.EIGHT}`,
        side: 'top-right',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      },

      {
        icon: <>🤝</>,
        title: 'Tip: Share Your Route',
        content: <>You can share your route on Facebook or copy the link to send it anywhere.</>,
        selector: `#${GORA_TOUR_STEP_SELECTOR.NINTH}`,
        side: 'top-right',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      },
      {
        icon: <>🎉</>,
        title: 'Enjoy the Ride',
        content: <>That&apos;s it—enjoy using GORA and have a smooth journey!</>,
        selector: `#${GORA_TOUR_STEP_SELECTOR.TENTH}`,
        side: 'top-right',
        showControls: true,
        showSkip: true,
        pointerPadding: 10,
        pointerRadius: 10
      }
    ]
  }
];

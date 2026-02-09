export const env = {
  tour: {
    current: {
      lat: 10.285748,
      lng: 123.9744526
    },
    origin: {
      lat: 10.289753107187988,
      lng: 123.9450426101248
    },
    destination: {
      lat: 10.31531024600743,
      lng: 124.00065535496918
    }
  },
  routes: {
    radius: process.env.NEXT_PUBLIC_ROUTE_RADIUS!
  },
  api: {
    url: process.env.NEXT_PUBLIC_API_URL
  },
  url: process.env.NEXT_PUBLIC_URL
};

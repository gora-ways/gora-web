export interface Route {
  name: string;
  id: string;
  points?: LatLng[];
  points_color?: string;
  base_fare?: number;
}

export interface RouteFare {
  estimate_distance?: number;
  estimate_fare?: number;
  route: Route;
  points?: LatLng[];
}

export interface RouteFares {
  total_fare: number;
  route_fare: RouteFare[];
}
export type LatLng = { lat: number; lng: number };
export type RouteDoc = { points: LatLng[]; name: string };
export type RoutePoints = { color: string; points: LatLng[] };

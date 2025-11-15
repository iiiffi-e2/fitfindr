"use client";

import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues with Leaflet
const LocationMap = dynamic(
  () => import("@/components/maps/location-map").then((mod) => mod.LocationMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full animate-pulse rounded-2xl border border-slate-100 bg-slate-100" />
    ),
  },
);

type LocationMapWrapperProps = {
  latitude: number;
  longitude: number;
  locationName: string;
  address?: string;
};

export function LocationMapWrapper(props: LocationMapWrapperProps) {
  return <LocationMap {...props} />;
}


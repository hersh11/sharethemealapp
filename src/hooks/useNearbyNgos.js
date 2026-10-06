import { useMemo } from "react";
import { useNgos, useUserLocation } from "../context/contexts";
import { sortByDistance } from "../lib/geo";

// The NGO list, nearest first once the visitor has shared their location.
export const useNearbyNgos = () => {
  const { ngos } = useNgos();
  const location = useUserLocation();
  const sorted = useMemo(() => sortByDistance(ngos, location.coords), [ngos, location.coords]);
  return { ngos: sorted, location };
};

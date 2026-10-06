const EARTH_RADIUS_KM = 6371;

const toRadians = (degrees) => (degrees * Math.PI) / 180;

// Straight-line (great-circle) distance between two { lat, lng } points.
export const distanceKm = (from, to) => {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(a));
};

export const formatDistance = (km) => {
  if (km < 1) {
    return `${Math.max(Math.round(km * 1000 / 50) * 50, 50)} m`;
  }

  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km).toLocaleString("en-IN")} km`;
};

// Adds distanceKm to each NGO that has coordinates and puts the nearest first.
// NGOs without coordinates keep their order at the end.
export const sortByDistance = (ngos, origin) => {
  if (!origin) {
    return ngos;
  }

  return ngos
    .map((ngo) => ({
      ...ngo,
      distanceKm: Number.isFinite(ngo.lat) && Number.isFinite(ngo.lng) ? distanceKm(origin, ngo) : null,
    }))
    .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity));
};

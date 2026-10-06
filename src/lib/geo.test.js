import { describe, expect, it } from "vitest";
import { distanceKm, formatDistance, sortByDistance } from "./geo";

const kothrud = { lat: 18.5074, lng: 73.8077 };
const vimanNagar = { lat: 18.5679, lng: 73.9143 };

describe("distanceKm", () => {
  it("measures the straight-line distance between two points", () => {
    expect(distanceKm(kothrud, kothrud)).toBe(0);
    expect(distanceKm(kothrud, vimanNagar)).toBeCloseTo(13.1, 0);
    // Pune to Delhi is about 1,170 km in a straight line.
    expect(distanceKm(kothrud, { lat: 28.6139, lng: 77.209 })).toBeGreaterThan(1100);
  });
});

describe("formatDistance", () => {
  it("uses metres up close and rounds sensibly further away", () => {
    expect(formatDistance(0.01)).toBe("50 m");
    expect(formatDistance(0.42)).toBe("400 m");
    expect(formatDistance(3.456)).toBe("3.5 km");
    expect(formatDistance(1172.4)).toBe("1,172 km");
  });
});

describe("sortByDistance", () => {
  const ngos = [
    { id: "far", ...vimanNagar },
    { id: "no-location", lat: null, lng: null },
    { id: "near", ...kothrud },
  ];

  it("puts the nearest first and NGOs without coordinates last", () => {
    expect(sortByDistance(ngos, kothrud).map((ngo) => ngo.id)).toEqual(["near", "far", "no-location"]);
  });

  it("leaves the list alone until there's a location", () => {
    expect(sortByDistance(ngos, null)).toBe(ngos);
  });
});

import { describe, expect, it } from "vitest";
import { normalizeNgo } from "./api";

describe("normalizeNgo", () => {
  it("maps the field names used by the original backend", () => {
    expect(
      normalizeNgo({
        _id: 7,
        NGOName: "Legacy NGO",
        mealsRequired: "40",
        time: "Tonight",
        reviews: "4.5",
        totalFeeds: 1000,
        totalCampaigns: 3,
        totalVolunteers: 12,
        about: "Old shape",
      }),
    ).toEqual({
      id: "7",
      name: "Legacy NGO",
      area: "",
      mealsNeeded: 40,
      neededBy: "Tonight",
      rating: 4.5,
      mealsServed: 1000,
      campaigns: 3,
      volunteers: 12,
      accepts: [],
      about: "Old shape",
    });
  });
});

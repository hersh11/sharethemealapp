import { describe, expect, it } from "vitest";
import { emptyDraft } from "../data/donation";
import { buildDonation, getBlockingStepPath, latestPickupTime, validateContactDetails } from "./donationFlow";

// Fixed "now": Monday 5 October 2026, 18:30 local time.
const now = new Date(2026, 9, 5, 18, 30);

const completeDraft = {
  ...emptyDraft,
  recipient: { type: "ngo", id: "roti-relay", name: "Roti Relay" },
  // Raw food, so these cases test the general date rules; cooked food has its own below.
  category: "Raw Food",
  meals: ["Dinner"],
  servings: 20,
  address: "12 MG Road, Camp, Pune",
  phone: "+91 98765 43210",
  date: "2026-10-06",
  time: "09:00",
  acceptedGuidelines: true,
};

describe("validateContactDetails", () => {
  it("accepts a complete set of details", () => {
    expect(validateContactDetails(completeDraft, now)).toEqual({});
  });

  it("reports every missing field", () => {
    expect(Object.keys(validateContactDetails(emptyDraft, now))).toEqual([
      "address",
      "phone",
      "date",
      "time",
      "acceptedGuidelines",
    ]);
  });

  it("rejects malformed phone numbers", () => {
    for (const phone of ["12345", "call me", "+91 98765 43210 12345"]) {
      expect(validateContactDetails({ ...completeDraft, phone }, now).phone).toBeDefined();
    }
  });

  it("rejects past dates and dates too far ahead", () => {
    expect(validateContactDetails({ ...completeDraft, date: "2026-10-04" }, now).date).toMatch(/past/);
    expect(validateContactDetails({ ...completeDraft, date: "2026-11-30" }, now).date).toMatch(/within/);
  });

  it("rejects a time that has already passed today", () => {
    const draft = { ...completeDraft, date: "2026-10-05", time: "17:00" };
    expect(validateContactDetails(draft, now).time).toMatch(/passed/);
    expect(validateContactDetails({ ...draft, time: "19:00" }, now).time).toBeUndefined();
  });
});

describe("pickup window by food type", () => {
  const cooked = { ...completeDraft, category: "Cooked Food", preparedHoursAgo: 1 };

  it("only lets cooked food be picked up before it has been out for six hours", () => {
    // Cooked an hour before 18:30, so it has to go by 23:30 the same day.
    expect(latestPickupTime(cooked, now)).toEqual(new Date(2026, 9, 5, 23, 30));
    expect(validateContactDetails({ ...cooked, date: "2026-10-05", time: "21:00" }, now)).toEqual({});

    const tooLate = validateContactDetails({ ...cooked, date: "2026-10-05", time: "23:45" }, now);
    expect(tooLate.time).toBe("Cooked food has to be picked up by 11:30 pm today.");

    const twoWeeksOut = validateContactDetails({ ...cooked, date: "2026-10-19", time: "09:00" }, now);
    expect(twoWeeksOut.date).toMatch(/^Cooked food has to be picked up by/);
  });

  it("still gives food that's near its limit an hour", () => {
    const old = { ...cooked, preparedHoursAgo: 8 };
    expect(latestPickupTime(old, now)).toEqual(new Date(2026, 9, 5, 19, 30));
  });

  it("lets raw and packed food be picked up days later", () => {
    for (const category of ["Raw Food", "Packed Food"]) {
      expect(latestPickupTime({ ...completeDraft, category }, now)).toBeNull();
      expect(validateContactDetails({ ...completeDraft, category, date: "2026-10-15" }, now)).toEqual({});
    }
  });
});

describe("getBlockingStepPath", () => {
  it("sends an empty draft back to the start", () => {
    expect(getBlockingStepPath(emptyDraft, "recipient")).toBeNull();
    expect(getBlockingStepPath(emptyDraft, "food")).toBe("/donate");
  });

  it("points at the first unfinished step", () => {
    const draft = { ...completeDraft, meals: [] };
    expect(getBlockingStepPath(draft, "food")).toBeNull();
    expect(getBlockingStepPath(draft, "delivery")).toBe("/donate/food");
  });
});

describe("buildDonation", () => {
  it("records the delivery status and drops cooking time for non-cooked food", () => {
    const donation = buildDonation(
      { ...completeDraft, category: "Packed Food", deliveryMode: "Self Delivery" },
      now,
    );

    expect(donation).toMatchObject({
      status: "Drop-off scheduled",
      category: "Packed Food",
      preparedHoursAgo: null,
      createdAt: now.toISOString(),
    });
    expect(donation.id).toEqual(expect.any(String));
  });
});

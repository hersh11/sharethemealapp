import { appImages } from "./assets";

export const mockUser = {
  id: "local-user",
  name: "Local Donor",
  email: "donor@sharethemeal.local",
  profilePic: appImages.logo,
};

export const mockNgos = [
  {
    id: 1,
    NGOName: "Robin Hood Army",
    image: appImages.ngo,
    mealsRequired: 120,
    time: "Today, before 8 PM",
    reviews: "4.8",
    totalFeeds: 12500,
    totalCampaigns: 86,
    totalVolunteers: 430,
    about:
      "Robin Hood Army coordinates surplus food pickups from homes and restaurants and redistributes them to nearby communities the same day.",
  },
  {
    id: 2,
    NGOName: "No Food Waste",
    image: appImages.hunger,
    mealsRequired: 75,
    time: "Within 4 hours",
    reviews: "4.7",
    totalFeeds: 20100,
    totalCampaigns: 122,
    totalVolunteers: 520,
    about:
      "No Food Waste focuses on quick food recovery for shelters and hunger spots, with volunteers handling late-evening pickups across the city.",
  },
  {
    id: 3,
    NGOName: "Feeding India",
    image: appImages.cookedFood,
    mealsRequired: 95,
    time: "Today, before 10 PM",
    reviews: "4.9",
    totalFeeds: 34800,
    totalCampaigns: 210,
    totalVolunteers: 860,
    about:
      "Feeding India partners with donors and volunteers to route fresh cooked meals to community kitchens, schools, and local distribution points.",
  },
  {
    id: 4,
    NGOName: "Helping Hands Kitchen",
    image: appImages.packedFood,
    mealsRequired: 45,
    time: "Tomorrow morning",
    reviews: "4.6",
    totalFeeds: 6800,
    totalCampaigns: 39,
    totalVolunteers: 175,
    about:
      "Helping Hands Kitchen accepts packed and raw food donations and prioritizes family shelters that need consistent next-day meal support.",
  },
];

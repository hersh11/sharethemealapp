// Demo data. The organisations below are fictional and exist only so the app
// has something to show when it runs without a backend.

export const demoUser = {
  id: "demo-user",
  name: "Guest Donor",
  email: "guest@sharethemeal.demo",
};

export const demoNgos = [
  {
    id: "second-helping",
    name: "Second Helping Collective",
    area: "Kothrud, Pune",
    lat: 18.5074,
    lng: 73.8077,
    avatar: { icon: "utensils", colors: ["#7c3aed", "#c026d3"] },
    mealsNeeded: 120,
    neededBy: "Today, before 8 PM",
    rating: 4.8,
    mealsServed: 12500,
    campaigns: 86,
    volunteers: 430,
    accepts: ["Cooked Food", "Packed Food"],
    about:
      "Second Helping Collective picks up surplus food from homes and restaurants and shares it with nearby communities the same evening.",
  },
  {
    id: "roti-relay",
    name: "Roti Relay",
    area: "Shivajinagar, Pune",
    lat: 18.5308,
    lng: 73.8475,
    avatar: { icon: "scooter", colors: ["#ea580c", "#f59e0b"] },
    mealsNeeded: 75,
    neededBy: "Within 4 hours",
    rating: 4.7,
    mealsServed: 20100,
    campaigns: 122,
    volunteers: 520,
    accepts: ["Cooked Food"],
    about:
      "Roti Relay runs quick late-evening pickups for shelters and hunger spots, with volunteers on scooters covering the city centre.",
  },
  {
    id: "full-plate",
    name: "Full Plate Foundation",
    area: "Hadapsar, Pune",
    lat: 18.5089,
    lng: 73.926,
    avatar: { icon: "meal", colors: ["#0d9488", "#22c55e"] },
    mealsNeeded: 95,
    neededBy: "Today, before 10 PM",
    rating: 4.9,
    mealsServed: 34800,
    campaigns: 210,
    volunteers: 860,
    accepts: ["Cooked Food", "Raw Food", "Packed Food"],
    about:
      "Full Plate Foundation routes fresh meals to community kitchens, schools and local distribution points across the eastern suburbs.",
  },
  {
    id: "kindred-kitchen",
    name: "Kindred Kitchen",
    area: "Aundh, Pune",
    lat: 18.559,
    lng: 73.8078,
    avatar: { icon: "chef", colors: ["#db2777", "#f97316"] },
    mealsNeeded: 45,
    neededBy: "Tomorrow morning",
    rating: 4.6,
    mealsServed: 6800,
    campaigns: 39,
    volunteers: 175,
    accepts: ["Raw Food", "Packed Food"],
    about:
      "Kindred Kitchen cooks with donated raw and packed food and prioritises family shelters that need steady next-day meals.",
  },
  {
    id: "harvest-bridge",
    name: "Harvest Bridge",
    area: "Viman Nagar, Pune",
    lat: 18.5679,
    lng: 73.9143,
    avatar: { icon: "wheat", colors: ["#ca8a04", "#65a30d"] },
    mealsNeeded: 60,
    neededBy: "Tomorrow, before noon",
    rating: 4.7,
    mealsServed: 9400,
    campaigns: 58,
    volunteers: 240,
    accepts: ["Raw Food", "Packed Food"],
    about:
      "Harvest Bridge collects unsold produce and dry rations and turns them into weekly ration kits for daily-wage families.",
  },
];

export const demoCampaigns = [
  { id: "community-breakfast", title: "Community breakfast drive", ngoId: "second-helping", daysFromNow: 3 },
  { id: "school-lunch", title: "School lunch top-up", ngoId: "full-plate", daysFromNow: 6 },
  { id: "ration-kits", title: "Monthly ration kits", ngoId: "harvest-bridge", daysFromNow: 10 },
  { id: "shelter-dinners", title: "Night shelter dinners", ngoId: "roti-relay", daysFromNow: 14 },
];

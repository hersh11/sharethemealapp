import { images } from "./images";

export const HUNGER_SPOT_RECIPIENT = {
  type: "hunger-spot",
  id: null,
  name: "Nearest hunger spot",
};

export const recipientOptions = [
  {
    id: "ngo",
    label: "Donate to an NGO",
    description: "Pick a verified NGO that needs meals today.",
    image: images.ngoBanner,
  },
  {
    id: "hunger-spot",
    label: "Feed a hunger spot",
    description: "We route your food to the closest hunger spot.",
    image: images.hungerSpotBanner,
  },
];

export const categoryOptions = [
  {
    value: "Cooked Food",
    description: "Home or restaurant meals, ready to eat.",
    image: images.cookedFood,
  },
  {
    value: "Raw Food",
    description: "Vegetables, fruit, grains and other produce.",
    image: images.rawFood,
  },
  {
    value: "Packed Food",
    description: "Sealed, in-date packets and tins.",
    image: images.packedFood,
  },
];

export const foodTypes = ["Veg", "Non-veg"];

export const mealOptions = [
  { value: "Breakfast", image: images.breakfast },
  { value: "Lunch", image: images.lunch },
  { value: "Dinner", image: images.dinner },
];

export const deliveryModes = [
  {
    value: "Pickup",
    title: "Request a pickup",
    description: "A volunteer collects the food from your address.",
    status: "Pickup requested",
  },
  {
    value: "Self Delivery",
    title: "I'll drop it off",
    description: "You take the food to the recipient yourself.",
    status: "Drop-off scheduled",
  },
];

export const foodGuidelines = [
  "Cooked food should be less than 6 hours old and stored covered.",
  "Packed food must be sealed and within its expiry date.",
  "Keep veg and non-veg food in separate containers.",
  "Do not donate leftovers from plates that have been served.",
];

export const MAX_SERVINGS = 100;
export const MAX_PREPARED_HOURS = 12;
export const SAFE_PREPARED_HOURS = 6;

export const emptyDraft = {
  recipient: null,
  category: null,
  foodType: "Veg",
  meals: [],
  servings: 10,
  preparedHoursAgo: 1,
  address: "",
  phone: "",
  date: "",
  time: "",
  acceptedGuidelines: false,
  deliveryMode: "Pickup",
};

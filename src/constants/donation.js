import { appImages } from "./assets";

export const mealOptions = [
  { label: "Breakfast", value: "Breakfast", image: appImages.breakfast },
  { label: "Lunch", value: "Lunch", image: appImages.lunch },
  { label: "Dinner", value: "Dinner", image: appImages.dinner },
];

export const categoryOptions = [
  { label: "Cooked Food", image: appImages.cookedFood, to: "/foodDetails" },
  { label: "Raw Food", image: appImages.rawFood, to: "/foodDetails" },
  { label: "Packed Food", image: appImages.packedFood, to: "/foodDetails" },
];

export const donationOptions = [
  { label: "Donate to NGOs", image: appImages.ngo, to: "/category" },
  { label: "Feed Hunger Spots", image: appImages.hunger, to: "/category" },
];

export const roleOptions = [
  {
    title: "Donor",
    description: "Somebody is waiting for your food.",
    image: appImages.illustration,
    isActive: true,
  },
  {
    title: "Volunteer",
    description: "Fill the gap between donor and recipient.",
    image: appImages.illustration,
    isActive: false,
  },
];

export const initialFoodDonationForm = {
  type: "Veg",
  meals: [],
  quantity: 10,
  preparedHours: 0,
};

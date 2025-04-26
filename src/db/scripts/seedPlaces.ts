import { insert } from "@orama/orama";
import { placesDb } from "../places";
import { persistAllDb } from "@/db";

export const places = [
  {
    id: "1",
    name: "The Pink Door",
    imageUrl: "/images/pinkdoor.jpg",
    description:
      "Italian restaurant with cabaret shows and Elliott Bay terrace views.",
    address: {
      formatted: "1919 Post Alley, Seattle, WA 98101, United States",
      street: "1919 Post Alley",
      city: "Seattle",
      state: "WA",
      postalCode: "98101",
      country: "United States",
    },
    location: {
      lat: 47.6101,
      lng: -122.3421,
    },
    contact: {
      phone: "+1 206-443-3241",
      website: "http://thepinkdoor.net/",
      email: "",
    },
    business: {
      hours: "Lunch and Dinner, Closed Mondays",
      categories: ["Italian", "Cabaret", "Fine Dining"],
      priceLevel: "expensive",
      rating: 4.6,
      reviewCount: 3200,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Caffè Zingaro",
    imageUrl: "/images/zingaro.jpg",
    description:
      "Cozy coffee shop with great desserts and tea selection near Seattle Center.",
    address: {
      formatted: "127 Mercer St, Seattle, WA 98109, United States",
      street: "127 Mercer St",
      city: "Seattle",
      state: "WA",
      postalCode: "98109",
      country: "United States",
    },
    location: {
      lat: 47.6235,
      lng: -122.3516,
    },
    contact: {
      phone: "",
      website: "",
      email: "",
    },
    business: {
      hours: "Breakfast and Lunch",
      categories: ["Coffee", "Cafe", "Bakery"],
      priceLevel: "cheap",
      rating: 4.7,
      reviewCount: 850,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const seedPlaces = async () => {
  for (const place of places) {
    await insert(placesDb, place);
  }
  await persistAllDb();
  console.log("✅ Places seeding completed!");
};

seedPlaces();

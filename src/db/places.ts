import { create } from "@orama/orama";

// Type definition for Place
export type Place = {
  id: string;
  name: string;
  description?: string;
  address?: {
    formatted: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  location?: {
    lat: number;
    lng: number;
  };
  contact?: {
    phone?: string;
    website?: string;
    email?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

// Database schema for Orama using proper schema types
export const placesDb = create({
  schema: {
    id: "string",
    name: "string",
    description: "string",
    address: {
      formatted: "string",
      street: "string",
      city: "string",
      state: "string",
      postalCode: "string",
      country: "string",
    },
    location: {
      lat: "number",
      lng: "number",
    },
    contact: {
      phone: "string",
      website: "string",
      email: "string",
    },
    business: {
      hours: "string",
      categories: "string[]",
      priceLevel: "string",
      rating: "number",
      reviewCount: "number",
    },
    createdAt: "string",
    updatedAt: "string",
  },
});

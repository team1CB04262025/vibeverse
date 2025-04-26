import { create } from "@orama/orama";

// Type definition for Review
export type Review = {
  id: string;
  placeId: string;
  userId: string;
  comment?: string;
  overallRating?: number;
  foodRating?: number;
  serviceRating?: number;
  atmosphereRating?: number;
  costPerPerson?: string;
  cleanlinessRating?: number;
  petFriendlinessRating?: number;
  wifiRating?: number;
  accessibilityRating?: number;
  parkingRating?: number;
  noiseLevel?: boolean;
  outdoorSeating?: boolean;
  petMenuAvailable?: boolean;
  creditCardAccepted?: boolean;
  alcoholServed?: boolean;
  reservationRequired?: boolean;
  kidsFriendly?: number;
  smokingAllowed?: boolean;
  veganOptions?: boolean;
  openingHoursAccuracy?: number;
  viewQuality?: number;
  staffFriendliness?: number;
  strollerAccessible?: boolean;
  waitTimeRating?: number;
  createdAt?: string;
  updatedAt?: string;
};

// Database schema for Orama using proper schema types
export const reviewsDb = create({
  schema: {
    id: "string",
    placeId: "string",
    userId: "string",
    comment: "string",
    overallRating: "number",
    foodRating: "number",
    serviceRating: "number",
    atmosphereRating: "number",
    costPerPerson: "string",
    cleanlinessRating: "number",
    petFriendlinessRating: "number",
    wifiRating: "number",
    accessibilityRating: "number",
    parkingRating: "number",
    noiseLevel: "boolean",
    outdoorSeating: "boolean",
    petMenuAvailable: "boolean",
    creditCardAccepted: "boolean",
    alcoholServed: "boolean",
    reservationRequired: "boolean",
    kidsFriendly: "number",
    smokingAllowed: "boolean",
    veganOptions: "boolean",
    openingHoursAccuracy: "number",
    viewQuality: "number",
    staffFriendliness: "number",
    strollerAccessible: "boolean",
    waitTimeRating: "number",
    createdAt: "string",
    updatedAt: "string",
  },
});

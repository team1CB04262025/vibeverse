import { insert } from "@orama/orama";
import { reviewsDb, Review } from "../reviews";

// 실제 places의 id를 사용 (seedPlaces.ts 참고)
const placeIds = ["1", "2"];
const userIds = ["user-1", "user-2", "user-3"];

const fakeReviews: Review[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `review-${i + 1}`,
  placeId: placeIds[i % placeIds.length],
  userId: userIds[i % userIds.length],
  comment: `This is a fake review #${i + 1} for place ${placeIds[i % placeIds.length]}.`,
  overallRating: Math.floor(Math.random() * 5) + 1,
  foodRating: Math.floor(Math.random() * 5) + 1,
  serviceRating: Math.floor(Math.random() * 5) + 1,
  atmosphereRating: Math.floor(Math.random() * 5) + 1,
  costPerPerson: "10-20",
  cleanlinessRating: Math.floor(Math.random() * 5) + 1,
  petFriendlinessRating: Math.floor(Math.random() * 5) + 1,
  wifiRating: Math.floor(Math.random() * 5) + 1,
  accessibilityRating: Math.floor(Math.random() * 5) + 1,
  parkingRating: Math.floor(Math.random() * 5) + 1,
  noiseLevel: Math.random() > 0.5,
  outdoorSeating: Math.random() > 0.5,
  petMenuAvailable: Math.random() > 0.5,
  creditCardAccepted: Math.random() > 0.5,
  alcoholServed: Math.random() > 0.5,
  reservationRequired: Math.random() > 0.5,
  kidsFriendly: Math.floor(Math.random() * 5) + 1,
  smokingAllowed: Math.random() > 0.5,
  veganOptions: Math.random() > 0.5,
  openingHoursAccuracy: Math.floor(Math.random() * 5) + 1,
  viewQuality: Math.floor(Math.random() * 5) + 1,
  staffFriendliness: Math.floor(Math.random() * 5) + 1,
  strollerAccessible: Math.random() > 0.5,
  waitTimeRating: Math.floor(Math.random() * 5) + 1,
  createdAt: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
  updatedAt: new Date().toISOString(),
}));

const seedReviews = async () => {
  for (const review of fakeReviews) {
    await insert(await reviewsDb, review);
  }
  console.log("✅ Reviews seeding completed!");
};

seedReviews();

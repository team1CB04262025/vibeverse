import {
  persistToFile,
  restoreFromFile,
} from "@orama/plugin-data-persistence/server";
import { placesDb as placesDbOriginal } from "./places";
import { reviewsDb as reviewsDbOriginal } from "./reviews";
import { existsSync } from "fs";

export const persistAllDb = async () => {
  await persistToFile(placesDbOriginal, "binary", "./places.msp");
  await persistToFile(reviewsDbOriginal, "binary", "./reviews.msp");
};

let restoredPlacesDb = placesDbOriginal;
let restoredReviewsDb = reviewsDbOriginal;

// Only attempt to restore if the files exist
if (existsSync("./places.msp")) {
  restoredPlacesDb = await restoreFromFile("binary", "./places.msp");
}

if (existsSync("./reviews.msp")) {
  restoredReviewsDb = await restoreFromFile("binary", "./reviews.msp");
}

export const placesDb = restoredPlacesDb;
export const reviewsDb = restoredReviewsDb;

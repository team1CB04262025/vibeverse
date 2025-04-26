import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { search, insert } from "@orama/orama";
import { placesDb, reviewsDb, persistAllDb } from "@/db";

const model = google("gemini-2.0-flash-001");

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const placesSearchResult = search(placesDb, {
    term: "Starbucks",
  });

  console.log(placesSearchResult);

  const reviewsSearchResult = search(reviewsDb, {
    term: "Starbucks",
  });

  console.log(reviewsSearchResult);

  const newPlaceId = insert(placesDb, {
    id: `place_${Math.random().toString(36).substring(2, 15)}`,
    name: `Starbucks ${Math.random().toString(36).substring(2, 15)}`,
    rating: 4.5,
    reviewCount: 100,
  }) as string;

  const newReview = insert(reviewsDb, {
    placeId: newPlaceId,
    userId: "456",
    rating: 5,
    comment: "This is a test review",
  });

  persistAllDb();

  console.log("newPlaceId", newPlaceId);
  console.log(newReview);

  // messages is an array of user input and assistant response

  // when we get another user input,
  // we want to search our database for most relevant reviews
  // const reviews = await db.search("reviews", userInput)

  // we want to include the reviews in the next prompt
  // const prompt = `
  //   You are a helpful assistant that can answer questions and help with tasks.
  //   Here are some reviews: ${reviews}
  //   Here is the new user input: ${userInput}
  // `
  // then pass in the prompt to the model

  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}

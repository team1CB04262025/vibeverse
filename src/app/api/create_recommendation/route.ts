import { search } from "@orama/orama";
import { reviewsDb } from "@/db";
import { getRecommandations } from "@/lib/llm/reviewsAgent";
import { Review } from "@/db/reviews";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// Define an interface for search result hits
interface SearchHit {
  id: string;
  score: number;
  document: Review;
}

export async function POST(req: Request) {
  const { userInput, limit = 10 } = await req.json();

  if (!userInput) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "User input is required",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Perform vector search using Orama to find relevant reviews
    console.log({ userInput });
    const searchResults = await search(reviewsDb, {
      term: userInput,
      properties: ["comment"],
      limit: limit,
    });
    console.log({ searchResults });

    // Extract the review documents from search results
    const relevantReviews = searchResults.hits.map(
      (hit: SearchHit) => hit.document
    );
    console.log({ relevantReviews });

    // Get recommendations based on user input and relevant reviews
    const { recommendations } = await getRecommandations(
      userInput,
      relevantReviews
    );

    return new Response(
      JSON.stringify({
        success: true,
        recommendations,
        relevantReviews,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to generate recommendations",
        error: String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

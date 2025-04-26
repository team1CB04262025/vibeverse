import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import {
  extractReviewFromUserInput,
  getFollowUpQuestions,
} from "@/lib/llm/reviewsAgent";
import { Review } from "@/db/reviews";

const model = google("gemini-2.0-flash-001");

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, reviewState } = await req.json();
  const extractReview = true;

  // Test the review extraction functionality if requested
  if (extractReview) {
    // Get the last user message
    const lastUserMessage =
      messages.findLast(
        (msg: { role: string; content: string }) => msg.role === "user"
      )?.content || "";

    try {
      // Use the extractReviewFromUserInput function to analyze the user's message
      // If we have previous review state, use it as the starting point
      const previousReview = {
        id: null,
        placeId: null,
        userId: null,
        comment: null,
        overallRating: null,
        foodRating: null,
        serviceRating: null,
        atmosphereRating: null,
        costPerPerson: null,
        cleanlinessRating: null,
        petFriendlinessRating: null,
        wifiRating: null,
        accessibilityRating: null,
        parkingRating: null,
        noiseLevel: null,
        outdoorSeating: null,
        petMenuAvailable: null,
        creditCardAccepted: null,
        alcoholServed: null,
        reservationRequired: null,
        kidsFriendly: null,
        smokingAllowed: null,
        veganOptions: null,
        openingHoursAccuracy: null,
        viewQuality: null,
        staffFriendliness: null,
        strollerAccessible: null,
        waitTimeRating: null,
        createdAt: null,
        updatedAt: null,
        ...reviewState,
      };

      const newReviewData = await extractReviewFromUserInput(
        lastUserMessage,
        "test_place_id",
        "test_user_id",
        previousReview // Use the existing review data as a starting point
      );

      const newReviewDataFiltered = Object.fromEntries(
        Object.entries(newReviewData).filter(([, value]) => value !== null)
      );
      const reviewData = { ...previousReview, ...newReviewDataFiltered };

      // Check if review is complete (more non-null values than null values)
      const totalFields = Object.keys(reviewData).length;
      const nonNullFields = Object.values(reviewData).filter(
        (value) => value !== null
      ).length;
      const isReviewComplete = nonNullFields > totalFields / 2.5;

      let followUpQuestion;

      if (isReviewComplete) {
        // If review is complete, set a thank you message instead of follow-up questions
        followUpQuestion =
          "Thank you for sharing! Your review has been saved now.";
      } else {
        // Generate follow-up questions for missing information
        followUpQuestion = await getFollowUpQuestions(
          lastUserMessage,
          reviewData as unknown as Review
        );
      }

      // Ensure followUpQuestion is a string or has a text property
      const processedQuestion =
        typeof followUpQuestion === "object" && followUpQuestion
          ? followUpQuestion
          : String(followUpQuestion);

      // Return the extracted review data and follow-up question without saving to database
      return new Response(
        JSON.stringify({
          success: true,
          message: "Review successfully extracted",
          review: reviewData,
          followUpQuestion: processedQuestion,
          isReviewComplete: isReviewComplete,
        }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error extracting review:", error);
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to extract review",
          error: String(error),
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  }

  // Default chat behavior
  const result = streamText({
    model,
    messages,
  });

  return result.toDataStreamResponse();
}

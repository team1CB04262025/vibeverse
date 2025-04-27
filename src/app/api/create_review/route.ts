import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import {
  extractReviewFromUserInput,
  getFollowUpQuestions,
  getReviewSummary,
} from "@/lib/llm/reviewsAgent";
import { Review } from "@/db/reviews";
import { insert } from "@orama/orama";
import { persistAllDb, reviewsDb } from "@/db";
import { v4 as uuidv4 } from "uuid";

const model = google("gemini-2.0-flash-001");

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, reviewState } = await req.json();
  const extractReview = true;

  // Test the review extraction functionality if requested
  if (extractReview) {
    // Get the last user message and the previous AI follow-up question
    const lastUserMessage =
      messages.findLast(
        (msg: { role: string; content: string }) => msg.role === "user"
      )?.content || "";

    // Find the previous AI follow-up question (which would be the message before the last user message)
    const lastUserIndex = messages.findLastIndex(
      (msg: { role: string; content: string }) => msg.role === "user"
    );

    const previousFollowUpQuestion =
      lastUserIndex > 0 ? messages[lastUserIndex - 1]?.content || "" : "";

    // Concatenate the previous follow-up question and the user's response
    const contextualUserInput = [previousFollowUpQuestion, lastUserMessage]
      .filter(Boolean)
      .join(" ");

    const PLACE_ID = "1";

    try {
      // Use the extractReviewFromUserInput function to analyze the user's message
      // If we have previous review state, use it as the starting point
      const previousReview = {
        id: null,
        placeId: PLACE_ID,
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
        contextualUserInput,
        "test_place_id",
        "test_user_id",
        previousReview // Use the existing review data as a starting point
      );

      const newReviewDataFiltered = Object.fromEntries(
        Object.entries(newReviewData).filter(([, value]) => value !== null)
      );
      let reviewData = { ...previousReview, ...newReviewDataFiltered };
      // Check if review is complete (more non-null values than null values)
      const totalFields = Object.keys(reviewData).length;
      const nonNullFields = Object.values(reviewData).filter(
        (value) => value !== null
      ).length;
      const isReviewComplete = nonNullFields > totalFields / 3;

      let followUpQuestion;

      if (isReviewComplete) {
        const summary = await getReviewSummary(reviewData as unknown as Review);
        reviewData.comment = summary;

        // Remove null fields and ensure required fields are set
        reviewData = Object.fromEntries(
          Object.entries(reviewData).filter(([, value]) => value !== null)
        );
        reviewData.id = reviewData.id || uuidv4();
        reviewData.createdAt = reviewData.createdAt || new Date().toISOString();
        reviewData.updatedAt = new Date().toISOString();

        try {
          // Insert the review into the database
          await insert(reviewsDb, reviewData as unknown as Review);
          console.log("Review inserted into database:", reviewData.id);
          console.log("Review placeId:", reviewData.placeId);
          // TODO: Uncomment for demo purposes
          persistAllDb();
        } catch (error) {
          console.error("Error inserting review into database:", error);
        }

        // Set a thank you message instead of follow-up questions
        followUpQuestion =
          "Thank you for sharing! Your review has been saved now.";
      } else {
        // Generate follow-up questions for missing information
        followUpQuestion = await getFollowUpQuestions(
          contextualUserInput,
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

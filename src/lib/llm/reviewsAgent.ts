import { google } from "@ai-sdk/google";
import { generateObject, generateText } from "ai";
import { z } from "zod";
import { Review } from "../../db/reviews";

const model = google("gemini-2.5-flash-preview-04-17");
// const model = google("gemini-2.0-flash");

const reviewSchema = z.object({
  overallRating: z.number().min(1).max(5).nullable(),
  foodRating: z.number().min(1).max(5).nullable(),
  serviceRating: z.number().min(1).max(5).nullable(),
  atmosphereRating: z.number().min(1).max(5).nullable(),
  costPerPerson: z.string().nullable(),
  cleanlinessRating: z.number().min(1).max(5).nullable(),
  petFriendlinessRating: z.number().min(1).max(5).nullable(),
  wifiRating: z.number().min(1).max(5).nullable(),
  accessibilityRating: z.number().min(1).max(5).nullable(),
  parkingRating: z.number().min(1).max(5).nullable(),
  noiseLevel: z.boolean().nullable(),
  outdoorSeating: z.boolean().nullable(),
  petMenuAvailable: z.boolean().nullable(),
  creditCardAccepted: z.boolean().nullable(),
  alcoholServed: z.boolean().nullable(),
  reservationRequired: z.boolean().nullable(),
  kidsFriendly: z.number().min(1).max(5).nullable(),
  smokingAllowed: z.boolean().nullable(),
  veganOptions: z.boolean().nullable(),
  openingHoursAccuracy: z.number().min(1).max(5).nullable(),
  viewQuality: z.number().min(1).max(5).nullable(),
  staffFriendliness: z.number().min(1).max(5).nullable(),
  strollerAccessible: z.boolean().nullable(),
  waitTimeRating: z.number().min(1).max(5).nullable(),
});

/**
 * Extracts review information from user input using LLM
 * @param userInput - The text input from user describing their experience
 * @param placeId - The ID of the place being reviewed
 * @param userId - The ID of the user creating the review
 * @param startingReview - Optional existing Review object to use as a base
 * @returns The extracted Review object
 */
export async function extractReviewFromUserInput(
  userInput: string,
  placeId: string,
  userId: string,
  startingReview: Partial<Review> = {}
) {
  const prompt = `
    You are a specialist at extracting structured review information from user comments about a place.
    
    For ratings (1-5 scale):
    - 5 = Excellent, amazing, perfect, loved it, best ever
    - 4 = Very good, great, really liked it
    - 3 = Average, okay, decent, satisfactory
    - 2 = Below average, disappointing, not good
    - 1 = Terrible, awful, very poor, hated it
    
    For boolean fields (true/false):
    - Only mark as "true" if explicitly confirmed (e.g., "they have outdoor seating")
    - Only mark as "false" if explicitly denied (e.g., "no wifi available")
    - Set to null if not mentioned at all
    
    FIELD DESCRIPTIONS - Extract these specific details:
    
    - overallRating: Overall impression of the place (1-5). Always include this field.
    - foodRating: Quality of food/drinks (1-5)
    - serviceRating: Quality of service provided by staff (1-5)
    - atmosphereRating: Ambiance, decor, and overall feel of the place (1-5)
    - costPerPerson: Approximate cost per person (as a string like "$20" or "€30-40")
    - cleanlinessRating: How clean the establishment was (1-5)
    - petFriendlinessRating: How accommodating the place is for pets (1-5)
    - wifiRating: Quality and reliability of WiFi (1-5)
    - accessibilityRating: How accessible for people with disabilities (1-5)
    - parkingRating: Availability and convenience of parking (1-5)
    - noiseLevel: Whether the place was noisy (true) or quiet (false)
    - outdoorSeating: Whether outdoor seating is available (true/false)
    - petMenuAvailable: Whether there's a specific menu for pets (true/false)
    - creditCardAccepted: Whether credit cards are accepted (true/false)
    - alcoholServed: Whether alcohol is served (true/false)
    - reservationRequired: Whether reservations are needed (true/false)
    - kidsFriendly: How suitable the place is for children (1-5)
    - smokingAllowed: Whether smoking is permitted (true/false)
    - veganOptions: Whether vegan food options are available (true/false)
    - openingHoursAccuracy: How accurate the listed opening hours were (1-5)
    - viewQuality: Quality of the view from the establishment (1-5)
    - staffFriendliness: How friendly and welcoming the staff was (1-5)
    - strollerAccessible: Whether the place accommodates strollers (true/false)
    - waitTimeRating: Rating of the wait time for service (1-5)
    
    Examples:
    - "The food was excellent" → foodRating: 5
    - "It costs about $20 per person" → costPerPerson: "$20"
    - "WiFi was a bit spotty but worked" → wifiRating: 3
    - "I think they might have outdoor seating" → outdoorSeating: null (ambiguous)
    - "No mention of parking" → parkingRating: null
    - "Staff were rude at first but very helpful later" → staffFriendliness: null (contradictory)
    - "The place was very noisy" → noiseLevel: true
    - "They definitely don't allow smoking" → smokingAllowed: false

    Extract structured review information from the following user comment about a place:
      
    "${userInput}"
  `;

  const { object } = await generateObject({
    model,
    schema: reviewSchema,
    prompt,
  });

  // Add the required fields and current timestamp
  const timestamp = new Date().toISOString();

  // Merge with startingReview if provided, giving priority to newly extracted values
  const mergedReview = {
    ...(startingReview || {}),
    ...object,
    id: startingReview?.id || crypto.randomUUID(),
    placeId,
    userId,
    createdAt: startingReview?.createdAt || timestamp,
    updatedAt: timestamp,
  };

  return mergedReview;
}

export async function getFollowUpQuestions(userInput: string, review: Review) {
  const prompt = `
    You are a helpful AI assistant gathering detailed reviews about places. The user has already provided some information, but there are gaps in their review.

    Based on the user's current review and the missing information, generate ONE follow-up question that would be most valuable to ask next. Focus on the most important or relevant missing detail.
    Prefer the follow-up question to be one that asks for a specific detail, rather than the general experience.

    Current review information:
    ${Object.entries(review)
      .filter(
        ([key, value]) =>
          // Filter out system fields and non-null values
          !["id", "placeId", "userId", "createdAt", "updatedAt"].includes(
            key
          ) && value === null
      )
      .map(([key]) => `- ${key}: missing`)
      .join("\n")}

    User's original input: "${userInput}"

    Return just ONE natural-sounding follow-up question that addresses the most important missing information. Make it conversational and friendly, as if continuing a natural conversation.
  `;

  const response = await generateText({
    model,
    prompt,
  });

  // Ensure we always return a string
  return typeof response === "object" && response.text
    ? response.text
    : String(response);
}

export async function getReviewSummary(review: Review) {
  const prompt = `
    You are a helpful AI assistant summarizing reviews about places.

    You will be given a conversation between a user and an AI assistant.
    The user is describing their experience at a place.
    The AI assistant is asking follow-up questions to gather more information.

    Rewrite the conversation as a user generated review.
    Try to include all the details that the user has shared.
    Do not include any other text than the review.

    Conversation:
    ${review.comment}
  `;

  const response = await generateText({
    model,
    prompt,
  });

  return response.text;
}

export async function getRecommandations(
  userInput: string,
  reviews: Review[] = []
) {
  const recommendationSchema = z.object({
    recommendations: z.array(
      z.object({
        placeName: z.string(),
        placeId: z.string(),
        reason: z.string(),
      })
    ),
  });

  const prompt = `
    You are a helpful AI assistant recommending places based on the user's input and reviews written by other users.

    You will be given a user's input and a list of reviews about places.
    Your task is to recommend places that match the user's input.

    User's input: "${userInput}"

    Reviews:
    ${JSON.stringify(reviews)}

    Return a structured list of recommended places with:
    - placeName: The name of the recommended place
    - placeId: The unique identifier for the place
    - reason: Contextual information about why this place is recommended
    `;

  const { object } = await generateObject({
    model,
    schema: recommendationSchema,
    prompt,
  });

  console.log("object", object);

  return object;
}

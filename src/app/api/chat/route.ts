import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message } = body;

    // 임시로 하드코딩된 응답을 반환
    const responses = [
      "That's a great choice! I know several nice restaurants in the area. What type of cuisine are you in the mood for?",
      "I'd recommend checking out Cafe Vibes on Main Street. They have amazing coffee and a cozy atmosphere!",
      "How about trying The Garden Restaurant? They have a beautiful outdoor seating area and serve fresh, seasonal dishes.",
      "I understand. Let me help you find the perfect spot. What's your preferred price range?",
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return NextResponse.json({
      message: randomResponse,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
} 
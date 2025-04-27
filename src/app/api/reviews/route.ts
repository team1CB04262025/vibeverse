import { reviewsDb } from "@/db";
import { search } from "@orama/orama";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const term = searchParams.get("term");

  if (!term) {
    return new Response("term is required", { status: 400 });
  }

  const searchResults = await search(reviewsDb, {
    term,
    properties: ["comment"],
  });

  return new Response(JSON.stringify(searchResults), { status: 200 });
}

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "nature";

  const apiKey = process.env.PIXABAY_API_KEY;
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(
    query
  )}&image_type=photo&per_page=20`;

  try {
    const response = await fetch(url, {
      // Use Next.js persistent data cache for 1 hour to reduce API hits
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error("Pixabay API failed");

    const data = await response.json();
    return NextResponse.json(data.hits);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Destination } from "@/types";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const destinations: Destination[] = JSON.parse(fileContents);
    const cookieStore = await cookies();

    const gameIdFromCookie = cookieStore.get("gameId");

    const randomIndex = Math.floor(Math.random() * destinations.length);
    const destination = destinations[randomIndex];

    const incorrectOptions = destinations
      .filter((d) => d.city !== destination.city)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((d) => `${d.city}, ${d.country}`);

    const options = [
      ...incorrectOptions,
      `${destination.city}, ${destination.country}`,
    ].sort(() => 0.5 - Math.random());

    const numClues = Math.floor(Math.random() * 2) + 1;
    const selectedClues = destination.clues
      .sort(() => 0.5 - Math.random())
      .slice(0, numClues);

    let gameId;

    if (!gameIdFromCookie) {
      gameId = Math.floor(Math.random() * 1000000)?.toString();
      cookieStore.set("gameId", gameId, { secure: true });
    }

    return NextResponse.json({
      destination: {
        city: destination.city,
        country: destination.country,
        clues: selectedClues,
        fun_fact: destination.fun_fact,
        trivia: destination.trivia,
      },
      gameId: gameIdFromCookie || gameId,
      options,
    });
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return NextResponse.json(
      { error: "Failed to fetch destinations" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Destination } from "@/types";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const difficulty = url.searchParams.get("difficulty") || "medium";

    const filePath = path.join(process.cwd(), "data.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const destinations: Destination[] = JSON.parse(fileContents);

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

    // Adjust number of clues based on difficulty
    let numClues;
    switch (difficulty) {
      case "easy":
        numClues = 2; // Show all clues in easy mode
        break;
      case "medium":
        numClues = Math.min(destination.clues.length, 1); // Show 1 clue in medium mode
        break;
      case "hard":
        numClues = Math.min(destination.clues.length, 1); // Show 1 clue in hard mode, but make it more vague
        break;
      default:
        numClues = 1;
    }

    const selectedClues = destination.clues
      .sort(() => 0.5 - Math.random())
      .slice(0, numClues);

    return NextResponse.json({
      destination: {
        city: destination.city,
        country: destination.country,
        clues: selectedClues,
        fun_fact: destination.fun_fact,
        trivia: destination.trivia,
      },
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

import { NextResponse } from "next/server";
import clientPromise from "@/utils/mongodb";

export async function POST(request: Request) {
  try {
    const { username, isCorrect } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("globetrotter");
    const usersCollection = db.collection("users");

    const updateField = isCorrect
      ? { "score.correct": 1 }
      : { "score.incorrect": 1 };

    const result = await usersCollection.findOneAndUpdate(
      { username },
      { $inc: updateField },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { error: "Failed to update score" },
      { status: 500 }
    );
  }
}

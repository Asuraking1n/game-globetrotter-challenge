import { NextResponse } from "next/server";
import { User } from "@/types";
import clientPromise from "@/utils/mongodb";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("globetrotter");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({ username });

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    const randomId = Math.floor(Math.random() * 1000000);

    const newUser: User = {
      username,
      score: {
        correct: 0,
        incorrect: 0,
      },
      gameSession: randomId?.toString(),
    };

    await usersCollection.insertOne(newUser);
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const username = url.searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("globetrotter");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ username });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

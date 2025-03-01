import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { User } from "@/types";

// TODO:  In a real app, we can database instead of a JSON file
const usersFilePath = path.join(process.cwd(), "users.json");

if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const fileContents = fs.readFileSync(usersFilePath, "utf8");
    const users: User[] = JSON.parse(fileContents);

    const existingUser = users.find((user) => user.username === username);

    if (existingUser) {
      return NextResponse.json(existingUser);
    }

    const newUser: User = {
      username,
      score: {
        correct: 0,
        incorrect: 0,
      },
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

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

    const fileContents = fs.readFileSync(usersFilePath, "utf8");
    const users: User[] = JSON.parse(fileContents);

    const user = users.find((user) => user.username === username);

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

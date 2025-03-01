import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { User } from "@/types";

const usersFilePath = path.join(process.cwd(), "users.json");

export async function POST(request: Request) {
  try {
    const { username, isCorrect } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const fileContents = fs.readFileSync(usersFilePath, "utf8");
    const users: User[] = JSON.parse(fileContents);

    const userIndex = users.findIndex((user) => user.username === username);

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (isCorrect) {
      users[userIndex].score.correct += 1;
    } else {
      users[userIndex].score.incorrect += 1;
    }

    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json(users[userIndex]);
  } catch (error) {
    console.error("Error updating score:", error);
    return NextResponse.json(
      { error: "Failed to update score" },
      { status: 500 }
    );
  }
}

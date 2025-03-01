import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GameBoard from "../GameBoard";
import "@testing-library/jest-dom";
import { User } from "@/types";

jest.mock("react-confetti", () => {
  return function MockConfetti() {
    return <div data-testid="confetti-mock">Confetti Effect</div>;
  };
});

global.fetch = jest.fn().mockImplementation(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    headers: new Headers(),
    redirected: false,
    statusText: "OK",
    type: "basic",
    url: "",
    json: () =>
      Promise.resolve({
        destination: {
          city: "Paris",
          country: "France",
          clues: [
            "This city is home to a famous tower that sparkles every night.",
          ],
          fun_fact: [
            "The Eiffel Tower was originally intended as a temporary structure.",
          ],
        },
        options: [
          "Paris, France",
          "Tokyo, Japan",
          "New York, USA",
          "Rome, Italy",
        ],
      }),
  })
);

describe("GameBoard", () => {
  const mockUser: User = {
    username: "testuser",
    score: { correct: 0, incorrect: 0 },
  };

  const mockUpdateUser = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state initially", () => {
    render(<GameBoard user={mockUser} onUpdateUser={mockUpdateUser} />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders the game board with clues and options", async () => {
    render(<GameBoard user={mockUser} onUpdateUser={mockUpdateUser} />);

    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByText("Where am I?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This city is home to a famous tower that sparkles every night."
      )
    ).toBeInTheDocument();

    // Check if all options are rendered
    const options = [
      "Paris, France",
      "Tokyo, Japan",
      "New York, USA",
      "Rome, Italy",
    ];
    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it("shows correct feedback when selecting the right answer", async () => {
    render(<GameBoard user={mockUser} onUpdateUser={mockUpdateUser} />);

    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    fireEvent.click(screen.getByText("Paris, France"));

    await waitFor(() => {
      expect(screen.getByText("🎉 Correct!")).toBeInTheDocument();
    });
  });
});

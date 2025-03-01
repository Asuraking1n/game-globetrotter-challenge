import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserRegistration from "../UserRegistration";
import "@testing-library/jest-dom";


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
        username: "testuser",
        score: { correct: 0, incorrect: 0 },
      }),
  })
);

describe("UserRegistration", () => {
  const mockOnRegister = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the registration form", () => {
    render(<UserRegistration onRegister={mockOnRegister} />);

    expect(screen.getByText("Welcome to Globetrotter!")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter your username")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Start Playing" })
    ).toBeInTheDocument();
  });

  it("shows error when submitting empty username", () => {
    render(<UserRegistration onRegister={mockOnRegister} />);

    fireEvent.click(screen.getByRole("button", { name: "Start Playing" }));

    expect(screen.getByText("Please enter a username")).toBeInTheDocument();
    expect(mockOnRegister).not.toHaveBeenCalled();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("submits the form with valid username", async () => {
    render(<UserRegistration onRegister={mockOnRegister} />);

    fireEvent.change(screen.getByPlaceholderText("Enter your username"), {
      target: { value: "testuser" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Start Playing" }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: "testuser" }),
      });
    });
  });
});

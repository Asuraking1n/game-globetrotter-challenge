import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShareButton from "../ShareButton";
import { User } from "@/types";
import "@testing-library/jest-dom";
import { generateShareImage } from "@/utils/imageGenerator";

jest.mock("@/utils/imageGenerator", () => ({
  generateShareImage: jest.fn().mockResolvedValue("data:image/png;base64,fake"),
}));

// Mock window.alert
window.alert = jest.fn();

describe("ShareButton", () => {
  const mockUser: User = {
    username: "testuser",
    score: { correct: 5, incorrect: 2 },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the share button", () => {
    render(<ShareButton user={mockUser} />);
    expect(screen.getByText("Challenge a Friend")).toBeInTheDocument();
  });

  it("opens the share popup when clicked", async () => {
    render(<ShareButton user={mockUser} />);

    fireEvent.click(screen.getByText("Challenge a Friend"));

    await waitFor(() => {
      expect(screen.getByText("Share with friends")).toBeInTheDocument();
      expect(
        screen.getByText(/Your score: 5 correct, 2 incorrect/)
      ).toBeInTheDocument();
    });
  });

  it("shows loading state while generating image", async () => {
    // Mock delay in image generation
    (generateShareImage as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve("data:image/png;base64,fake"), 100);
        })
    );

    render(<ShareButton user={mockUser} />);

    fireEvent.click(screen.getByText("Challenge a Friend"));

    expect(screen.getByText("Generating image...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Generating image...")).not.toBeInTheDocument();
    });
  });

  it("closes the modal when clicking the close button", () => {
    render(<ShareButton user={mockUser} />);

    fireEvent.click(screen.getByText("Challenge a Friend"));
    expect(screen.getByText("Share with friends")).toBeInTheDocument();

    fireEvent.click(screen.getByText("✕"));

    expect(screen.queryByText("Share with friends")).not.toBeInTheDocument();
  });

  it("copies link to clipboard when clicking Copy Link button", async () => {
    render(<ShareButton user={mockUser} />);

    fireEvent.click(screen.getByText("Challenge a Friend"));

    fireEvent.click(screen.getByText("Copy Link"));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining("http://localhost")
      );
    });

    expect(window.alert).toHaveBeenCalledWith("Link copied to clipboard!");
  });

  it("generates share image when modal is opened", async () => {
    render(<ShareButton user={mockUser} />);

    fireEvent.click(screen.getByText("Challenge a Friend"));

    await waitFor(() => {
      expect(generateShareImage).toHaveBeenCalledWith("testuser", {
        correct: 5,
        incorrect: 2,
      });
    });
  });
});

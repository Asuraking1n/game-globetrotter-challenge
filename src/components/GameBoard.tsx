"use client";

import { useState, useEffect, useRef } from "react";
import { Destination, User } from "@/types";
import Confetti from "./Confetti";
import ShareButton from "./ShareButton";
import DifficultySelector, { Difficulty } from "./DifficultySelector";

interface GameBoardProps {
  user: User;
  onUpdateUser: (user: User) => void;
  invitedBy?: string;
}

interface GameState {
  destination: Destination | null;
  options: string[];
  selectedOption: string | null;
  isCorrect: boolean | null;
  isLoading: boolean;
  error: string | null;
  showFeedback: boolean;
  timeRemaining: number;
}

// Timer durations for each difficulty level (in seconds)
const TIMER_DURATIONS = {
  easy: 60,
  medium: 30,
  hard: 15,
};

const GameBoard = ({ user, onUpdateUser, invitedBy }: GameBoardProps) => {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameState, setGameState] = useState<GameState>({
    destination: null,
    options: [],
    selectedOption: null,
    isCorrect: null,
    isLoading: true,
    error: null,
    showFeedback: false,
    timeRemaining: TIMER_DURATIONS[difficulty],
  });

  const [inviterScore, setInviterScore] = useState<{
    correct: number;
    incorrect: number;
  } | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchDestination();

    if (invitedBy) {
      fetchInviterScore();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [invitedBy]);

  // Reset timer when difficulty changes
  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      timeRemaining: TIMER_DURATIONS[difficulty]
    }));
    
    if (!gameState.isLoading && gameState.destination && !gameState.selectedOption) {
      startTimer();
    }
  }, [difficulty]);

  // Start timer when a new question is loaded
  useEffect(() => {
    if (!gameState.isLoading && gameState.destination && !gameState.selectedOption) {
      startTimer();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isLoading, gameState.destination, gameState.selectedOption]);

  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Reset timer
    setGameState(prev => ({ ...prev, timeRemaining: TIMER_DURATIONS[difficulty] }));

    // Start new timer
    timerRef.current = setInterval(() => {
      setGameState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        // If time is up and no option is selected
        if (newTimeRemaining <= 0 && !prev.selectedOption) {
          clearInterval(timerRef.current!);
          // Handle timeout - mark as incorrect
          handleTimeout();
          return { ...prev, timeRemaining: 0 };
        }
        
        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);
  };

  const handleTimeout = async () => {
    if (!gameState.destination) return;

    setGameState(prev => ({
      ...prev,
      selectedOption: "timeout",
      isCorrect: false,
      showFeedback: true,
    }));

    try {
      const response = await fetch("/api/users/update-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          isCorrect: false,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onUpdateUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const fetchInviterScore = async () => {
    try {
      if (!invitedBy) return;

      const response = await fetch(
        `/api/users?username=${encodeURIComponent(invitedBy)}`
      );
      if (response.ok) {
        const inviter = await response.json();
        setInviterScore(inviter.score);
      }
    } catch (error) {
      console.error("Error fetching inviter score:", error);
    }
  };

  const fetchDestination = async () => {
    setGameState((prev) => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      timeRemaining: TIMER_DURATIONS[difficulty] 
    }));

    try {
      const response = await fetch(`/api/destinations?difficulty=${difficulty}`);

      if (!response.ok) {
        throw new Error("Failed to fetch destination");
      }

      const data = await response.json();

      setGameState((prev) => ({
        ...prev,
        destination: data.destination,
        options: data.options,
        selectedOption: null,
        isCorrect: null,
        isLoading: false,
        showFeedback: false,
        timeRemaining: TIMER_DURATIONS[difficulty],
      }));
    } catch (error) {
      setGameState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      }));
    }
  };

  const handleOptionSelect = async (option: string) => {
    if (gameState.selectedOption || !gameState.destination) return;

    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const correctAnswer = `${gameState.destination.city}, ${gameState.destination.country}`;
    const isCorrect = option === correctAnswer;

    setGameState((prev) => ({
      ...prev,
      selectedOption: option,
      isCorrect,
      showFeedback: true,
    }));

    try {
      const response = await fetch("/api/users/update-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          isCorrect,
          difficulty,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        onUpdateUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const handleNextQuestion = () => {
    fetchDestination();
  };

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    // If we're in the middle of a question, fetch a new one with the new difficulty
    if (!gameState.isLoading && !gameState.showFeedback) {
      fetchDestination();
    }
  };

  if (gameState.isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (gameState.error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{gameState.error}</p>
        <button
          onClick={fetchDestination}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!gameState.destination) {
    return <div className="text-center py-8">No destination found</div>;
  }

  const { destination, options, selectedOption, isCorrect, showFeedback, timeRemaining } =
    gameState;

  // Calculate timer color based on time remaining
  const getTimerColor = () => {
    const percentage = timeRemaining / TIMER_DURATIONS[difficulty];
    if (percentage > 0.66) return "text-green-500";
    if (percentage > 0.33) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {invitedBy && inviterScore && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center">
            You were challenged by <strong>{invitedBy}</strong> who has scored{" "}
            {inviterScore.correct} correct answers!
          </p>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Globetrotter Challenge</h2>
          <p className="text-gray-600">
            Score: {user.score.correct} correct, {user.score.incorrect}{" "}
            incorrect
          </p>
        </div>
        <div className="flex space-x-2">
          <DifficultySelector 
            currentDifficulty={difficulty} 
            onSelectDifficulty={handleDifficultyChange} 
          />
          <ShareButton user={user} />
        </div>
      </div>

      {/* Timer display */}
      {!showFeedback && (
        <div className="mb-4 text-center">
          <div className={`text-2xl font-bold ${getTimerColor()}`}>
            Time remaining: {timeRemaining}s
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div 
              className={`h-2.5 rounded-full ${
                timeRemaining > TIMER_DURATIONS[difficulty] * 0.66 ? "bg-green-500" : 
                timeRemaining > TIMER_DURATIONS[difficulty] * 0.33 ? "bg-yellow-500" : "bg-red-500"
              }`} 
              style={{ width: `${(timeRemaining / TIMER_DURATIONS[difficulty]) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Where am I?</h3>
        <div className="bg-gray-100 p-4 rounded-lg">
          {destination.clues.map((clue, index) => (
            <p key={index} className="mb-2 last:mb-0">
              {clue}
            </p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option)}
            disabled={!!selectedOption}
            className={`p-4 rounded-lg text-center transition duration-200 ${
              selectedOption === option
                ? isCorrect
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
                : selectedOption &&
                  option === `${destination.city}, ${destination.country}`
                ? "bg-green-500 text-white"
                : "bg-blue-100 hover:bg-blue-200"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {showFeedback && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            isCorrect ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <h3 className="text-xl font-semibold mb-2">
            {isCorrect 
              ? "🎉 Correct!" 
              : selectedOption === "timeout" 
                ? "⏰ Time's up!" 
                : "😢 Incorrect!"}
          </h3>
          <p className="mb-2">
            {isCorrect
              ? `You guessed it! It's ${destination.city}, ${destination.country}.`
              : selectedOption === "timeout"
                ? `You ran out of time! The answer was ${destination.city}, ${destination.country}.`
                : `Sorry, the correct answer was ${destination.city}, ${destination.country}.`}
          </p>
          <p className="font-medium">Fun Fact:</p>
          <p>
            {
              destination.fun_fact[
                Math.floor(Math.random() * destination.fun_fact.length)
              ]
            }
          </p>
        </div>
      )}

      {selectedOption && (
        <div className="text-center">
          <button
            onClick={handleNextQuestion}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Next Question
          </button>
        </div>
      )}

      <Confetti isActive={!!isCorrect} />
    </div>
  );
};

export default GameBoard;

"use client";

import { useState } from "react";
import { Destination, User } from "@/types";
import Confetti from "./Confetti";
import ShareButton from "./ShareButton";

interface GameBoardProps {
  // user: User;
  // onUpdateUser: (user: User) => void;
  // invitedBy?: string;
  gameId: string;
  destinationFromApi: {
    destination: Destination;
    options: string[];
  };
}

interface GameState {
  destination: Destination | null;
  options: string[];
  selectedOption: string | null;
  isCorrect: boolean | null;
  isLoading: boolean;
  error: string | null;
  showFeedback: boolean;
  setUser?: (user: User) => void;
  gameId: string;
}

const GameBoard = ({ destinationFromApi, gameId }: GameBoardProps) => {
  const [gameState, setGameState] = useState<GameState>({
    destination: destinationFromApi.destination,
    options: destinationFromApi.options,
    selectedOption: null,
    isCorrect: null,
    isLoading: true,
    error: null,
    showFeedback: false,
    gameId,
  });

  const [user, setUser] = useState({
    username: "anonymous",
    score: {
      correct: 0,
      incorrect: 0,
    },
    gameId,
  });

  // const isAnonymousUser = user.username === "anonymous";

  // const [inviterScore, setInviterScore] = useState<{
  //   correct: number;
  //   incorrect: number;
  // } | null>(null);

  // useEffect(() => {
  //   fetchDestination();

  //   if (invitedBy) {
  //     fetchInviterScore();
  //   }
  // }, [invitedBy]);

  // useEffect(() => {
  //   if (isAnonymousUser) {
  //     const gameLocalStateFromStorage =
  //       localStorage.getItem("globetrotter_user");

  //     const gameLocalState = JSON.parse(gameLocalStateFromStorage || "{}");

  //     if (gameLocalState) {
  //       setUser({
  //         username: "anonymous",
  //         score: gameLocalState.score,
  //       });
  //     }
  //   }
  // }, []);

  // const fetchInviterScore = async () => {
  //   try {
  //     if (!invitedBy) return;

  //     const response = await fetch(
  //       `/api/users?username=${encodeURIComponent(invitedBy)}`
  //     );
  //     if (response.ok) {
  //       const inviter = await response.json();
  //       setInviterScore(inviter.score);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching inviter score:", error);
  //   }
  // };

  const handleOptionSelect = async (option: string) => {
    if (gameState.selectedOption || !gameState.destination) return;

    const correctAnswer = `${gameState.destination.city}, ${gameState.destination.country}`;
    const isCorrect = option === correctAnswer;

    setGameState((prev) => ({
      ...prev,
      selectedOption: option,
      isCorrect,
      showFeedback: true,
    }));

    // if (isAnonymousUser) {
    //   localStorage.setItem(
    //     "globetrotter_user",
    //     JSON.stringify({
    //       ...user,
    //       score: {
    //         ...user.score,
    //         [isCorrect ? "correct" : "incorrect"]:
    //           user.score[isCorrect ? "correct" : "incorrect"] + 1,
    //       },
    //       gameState,
    //     })
    //   );
    // }

    try {
      const response = await fetch("/api/users/update-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: user.username,
          isCorrect,
          gameId,
        }),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        // onUpdateUser(updatedUser);
      }
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  // const handleNextQuestion = () => {
  //   fetchDestination();
  // };

  // if (gameState.isLoading) {
  //   return <div className="text-center py-8">Loading...</div>;
  // }

  // if (gameState.error) {
  //   return (
  //     <div className="text-center py-8">
  //       <p className="text-red-500 mb-4">{gameState.error}</p>
  //       <button
  //         onClick={fetchDestination}
  //         className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
  //       >
  //         Try Again
  //       </button>
  //     </div>
  //   );
  // }

  if (!gameState.destination) {
    return <div className="text-center py-8">No destination found</div>;
  }

  const { destination, options, selectedOption, isCorrect, showFeedback } =
    gameState;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* {invitedBy && inviterScore && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-center">
            You were challenged by <strong>{invitedBy}</strong> who has scored{" "}
            {inviterScore.correct} correct answers!
          </p>
        </div>
      )} */}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Globetrotter Challenge</h2>
          <p className="text-gray-600">
            Score: {user.score.correct} correct, {user.score.incorrect}{" "}
            incorrect
          </p>
        </div>
        {/* <ShareButton user={user} /> */}
      </div>

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
            {isCorrect ? "🎉 Correct!" : "😢 Incorrect!"}
          </h3>
          <p className="mb-2">
            {isCorrect
              ? `You guessed it! It's ${destination.city}, ${destination.country}.`
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

      {/* {selectedOption && (
        <div className="text-center">
          <button
            onClick={handleNextQuestion}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Next Question
          </button>
        </div>
      )} */}

      <Confetti isActive={!!isCorrect} />
    </div>
  );
};

export default GameBoard;

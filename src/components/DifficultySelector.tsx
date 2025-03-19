"use client";

import { useState } from "react";

export type Difficulty = "easy" | "medium" | "hard";

interface DifficultySelectorProps {
  currentDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultySelector = ({
  currentDifficulty,
  onSelectDifficulty,
}: DifficultySelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const difficultyInfo = {
    easy: {
      name: "Easy",
      description: "60 seconds per question, more obvious clues",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
    },
    medium: {
      name: "Medium",
      description: "30 seconds per question, standard clues",
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
    },
    hard: {
      name: "Hard",
      description: "15 seconds per question, challenging clues",
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
    },
  };

  const currentInfo = difficultyInfo[currentDifficulty];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${currentInfo.color} text-white py-2 px-4 rounded-lg ${currentInfo.hoverColor} transition duration-200 flex items-center`}
      >
        <span className="mr-2">{currentInfo.name}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white p-4 rounded-lg shadow-lg z-10 w-64">
          <h3 className="font-bold mb-2">Select Difficulty</h3>
          {(Object.keys(difficultyInfo) as Difficulty[]).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => {
                onSelectDifficulty(difficulty);
                setIsOpen(false);
              }}
              className={`w-full text-left p-2 rounded-lg mb-2 ${
                difficulty === currentDifficulty
                  ? `${difficultyInfo[difficulty].color} text-white`
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <div className="font-bold">{difficultyInfo[difficulty].name}</div>
              <div className="text-sm">
                {difficultyInfo[difficulty].description}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DifficultySelector; 
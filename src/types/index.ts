export interface Destination {
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

export interface ScoreByDifficulty {
  correct: number;
  incorrect: number;
}

export interface User {
  username: string;
  score: {
    correct: number;
    incorrect: number;
    byDifficulty?: {
      easy: ScoreByDifficulty;
      medium: ScoreByDifficulty;
      hard: ScoreByDifficulty;
    };
  };
} 
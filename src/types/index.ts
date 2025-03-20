export interface Destination {
  city: string;
  country: string;
  clues: string[];
  fun_fact: string[];
  trivia: string[];
}

export interface User {
  username: string;
  score: {
    correct: number;
    incorrect: number;
  };
  gameSession: string | null;
}

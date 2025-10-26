
export interface LevelInfo {
  id: number;
  title: string;
  description: string;
  example: string;
}

export interface Answer {
  numerator: number;
  denominator: number;
}

export interface Question {
  problem: string;
  answer: Answer;
}

export type UserAnswer = Partial<Answer> | null;

export enum CheckState {
  UNCHECKED,
  CORRECT,
  INCORRECT
}

export type Difficulty = "入门" | "常用" | "进阶";

export type Exercise = {
  prompt: string;
  starter: string;
  answer: string;
  explanation: string;
};

export type DebugCase = {
  title: string;
  broken: string;
  fixed: string;
  reason: string;
};

export type Lesson = {
  id: string;
  title: string;
  difficulty: Difficulty;
  goal: string;
  concept: string[];
  jsThinking: string;
  tsThinking: string;
  example: string;
  exercise: Exercise;
  debugCase: DebugCase;
  checklist: string[];
};

import { Interview } from "../interviews/models";
import { Question } from "../tests/models";

export type Answer = {
  id: string;
  interviewId: string;
  questionId: string;
  correct: boolean | null;
  createdAt: Date;
}

export type ExtendedAnswer = {
  id: string;
  interviewId: Interview;
  question: Question;
  correct: boolean | null;
  createdAt: Date;
}
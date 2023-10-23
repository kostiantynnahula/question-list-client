export type Answer = {
  id: string;
  interviewId: string;
  questionId: string;
  correct: boolean | null;
  createdAt: Date;
}
import { Candidate } from '@/models/candidates/models';

export type Interview = {
  id: string;
  name: string;
  description: string;
  testId: string;
  candidate: Candidate;
  userId: string;
  status: string;
  createdAt: Date;
}
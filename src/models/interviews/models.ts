import { Candidate } from '@/models/candidates/models';
import { Test } from '@/models/tests/models';

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

export type InterviewTests = {
  id: string;
  name: string;
  description: string;
  test: Test;
  candidateId: string;
  userId: string;
  status: string;
  createdAt: Date;
}
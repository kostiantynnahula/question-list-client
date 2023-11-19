export type Test = {
  id: string;
  name: string;
  questions: Question[];
  isTemplate: boolean;
  createdAt?: Date;
}

export type Category = {
  id: string;
  name: string;
  questions?: Question[];
}

export type Question = {
  id: string;
  title: string;
  description: string;
  answer: string;
  order: number;
  categoryId?: string;
  testId?: string;
  createdAt?: Date;
}

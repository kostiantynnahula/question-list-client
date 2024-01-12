export type Test = {
  id: string;
  name: string;
  questions: Question[];
  categories: Category[];
  isTemplate: boolean;
  createdAt?: Date;
}

export type Category = {
  id: string;
  name: string;
  order: number;
  questions?: Question[];
}

export type Question = {
  id: string;
  title: string;
  description: string;
  answer: string;
  order: number;
  categoryId?: string | null;
  testId?: string;
  createdAt?: Date;
}

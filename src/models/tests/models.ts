export type Test = {
  id: string;
  name: string;
  categories: Category[];
}

export type Category = {
  id: string;
  name: string;
  questions: Question[];
}

export type Question = {
  id: string;
  title: string;
  description: string;
  answer: string;
}

export type Category = {
  name: string;
  questions: Question[];
}

export type Question = {
  title: string;
  description: string;
  answer: string;
}

export type FormData = {
  id?: string;
  name: string;
  categories: Category[];
}

export type Test = FormData;

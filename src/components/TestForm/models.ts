import { Test, Category, Question } from '@/models/tests/models';

export type QuestionFormData = Pick<Question, 'title' | 'description' | 'answer'> & { id?: string };
export type CategoryFormData = Pick<Category, 'name'> & {
  id?: string;
  questions: Array<QuestionFormData>;
};
export type FormData = Pick<Test, 'name'> & {
  id?: string;
  categories: Array<CategoryFormData>;
  isTemplate: boolean;
}
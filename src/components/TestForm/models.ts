import { Test, Question, Category } from '@/models/tests/models';

export type FormData = Pick<Test, 'name'> & {
  id?: string;
  isTemplate: boolean;
}

export type CategoryFormData = Pick<Category, 'name'>;

export type QuestionFormData = Pick<Question, 'title' | 'description' | 'answer' | 'categoryId'>;
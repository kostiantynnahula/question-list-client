import { Category as CategoryType, Question } from "@/models/tests/models";
import { Question as QuestionItem } from '@/components/TestForm/Question';

type CategoryProps = {
  category: CategoryType;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onEdit: (category: CategoryType) => void,
  onDelete: (categoryId: string) => void,
  onChangeQuestionOrder: (questionId: string, order: number) => void,
  onChangeCategoryOrder: (id: string, order: number) => void,
};

export const Category = ({
  category,
  onEditQuestion,
  onDeleteQuestion,
  onEdit,
  onDelete,
  onChangeQuestionOrder,
  onChangeCategoryOrder,
}: CategoryProps) => {
  return (
    <div className='category-item my-4 border border-indigo-500'>
      <div className='flex justify-between border-b p-3'>
        <div className='category-item-title flex'>
          <h1 className='font-bold text-indigo-600 hover:text-indigo-500 mr-2'>
            {category.name}
          </h1>
          <div className='order-action-buttons divide-x'>
            <button
              type="button"
              className="font-semibold text-indigo-600 hover:text-indigo-500 pr-2 pl-2"
              onClick={() => onChangeCategoryOrder(category.id, category.order + 1)}
             >
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
              </svg>
            </button>
            <button
              type="button"
              className="font-semibold text-indigo-600 hover:text-indigo-500 pr-2 pl-2"
              onClick={() => onChangeCategoryOrder(category.id, category.order - 1)}
            >
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"/>
              </svg>
            </button>
          </div>
        </div>
        <div className='action-buttons grid grid-cols-2 divide-x'>
          <button
            type='button'
            className='font-semibold text-indigo-600 hover:text-indigo-500 mr-2'
            onClick={() => onDelete(category.id)}
          >delete</button>
          <button
            type='button'
            className='font-semibold text-indigo-600 hover:text-indigo-500 mr-2'
            onClick={() => onEdit(category)}
          >edit</button>
        </div>
      </div>
      <div className='questions-list p-3'>
        {category.questions && category.questions.map((question) => (
          <QuestionItem
            onChangeOrder={onChangeQuestionOrder}
            question={question}
            key={question.id}
            onEdit={onEditQuestion}
            onDelete={onDeleteQuestion}
          />
        ))}
        {category.questions && category.questions.length === 0 && (
          <div className='text-center py-3'>
            <p className='text-indigo-500'>No questions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
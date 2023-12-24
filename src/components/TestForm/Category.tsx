import { Category as CategoryType, Question } from "@/models/tests/models";
import { Question as QuestionItem } from '@/components/TestForm/Question';

type CategoryProps = {
  category: CategoryType;
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (id: string) => void;
  onEdit: (category: CategoryType) => void,
  onDelete: (categoryId: string) => void,
  onChangeQuestionOrder: (questionId: string, order: number) => void,
};

export const Category = ({
  category,
  onEditQuestion,
  onDeleteQuestion,
  onEdit,
  onDelete,
  onChangeQuestionOrder,
}: CategoryProps) => {
  return (
    <div className='category-item my-4 border border-indigo-500'>
      <div className='flex justify-between border-b p-3'>
        <h1 className='font-bold text-indigo-600 hover:text-indigo-500 mr-2'>{category.name}</h1>
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
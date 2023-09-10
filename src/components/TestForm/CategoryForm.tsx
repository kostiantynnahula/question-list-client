import { FormikErrors, FormikValues, FieldArray, Field } from 'formik';
import { FormData, Category } from './models';
import { checkError } from '@/helpers/errorMessage';
import { QuestionForm } from './QuestionForm';

type CategoryFormProps = {
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  };
  errors: FormikErrors<FormData>;
  values: FormikValues;
  category: Category;
  index: number;
  onAddQuestion: (
    e: React.FormEvent<EventTarget>, index: number
  ) => void;
};

export const CategoryForm = ({
  handleChange,
  onAddQuestion,
  errors,
  values,
  category,
  index: i,
}: CategoryFormProps) => {
  const error = checkError(['categories', 'name'], `categories[${i}].name`, errors);
  return (
    <FieldArray 
      key={i}
      name="categories"
      render={(prop) => (
        <div>
          <div>
            <label
              htmlFor="name"
              className={`block text-sm font-medium leading-6 ${error ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
            >
              <div className="flex justify-between">
                <>Category</>
                <button
                  className="mt-2 placeholder:font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={() => prop.remove(i)}
                > - delete category</button>
              </div>
            </label>
            <div className="mt-2">
              <Field
                name={`categories.${i}.name`}
                onChange={handleChange}
                value={values.categories[i].name}
                className={`block w-full rounded-md ${error ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
              />
              {error && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{error}</p>}
              {category.questions.map((_, qi) => (
                <QuestionForm
                  handleChange={handleChange}
                  errors={errors}
                  values={values}
                  index={qi}
                  categoryIndex={i}
                  key={qi}
                />
              ))}
              <div>
                <button
                  type="button"
                  className="mt-2 font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={(e) => onAddQuestion(e, i)}
                > + add question</button>
              </div>
            </div>
          </div>
        </div>
      )}
    />
  );
};
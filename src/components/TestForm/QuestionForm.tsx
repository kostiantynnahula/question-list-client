import { FormikErrors, FormikValues, FieldArray, Field } from 'formik';
import { FormData } from './models';
import { checkError } from '@/helpers/errorMessage';

type QuestionFormProps = {
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any> ? void : (e: string | React.ChangeEvent<any>) => void;
  };
  errors: FormikErrors<FormData>;
  values: FormikValues;
  index: number;
  categoryIndex: number;
};


export const QuestionForm = ({
  handleChange,
  errors,
  values,
  index: qi,
  categoryIndex: i,
}: QuestionFormProps) => {
  const titleError = checkError(['categories', 'questions', 'title'], `categories[${i}].questions[${qi}].title`, errors);
  const descriptionError = checkError(['categories', 'questions', 'description'], `categories[${i}].questions[${qi}].description`, errors);
  const answerError = checkError(['categories', 'questions', 'answer'], `categories[${i}].questions[${qi}].answer`, errors);
  
  return (
    <FieldArray
      key={qi}
      name={`categories.${i}.questions`}
      render={(prop) => (
        <div className="mt-2">
          <div>
            <label
              htmlFor="title"
              className={`block text-sm font-medium leading-6 ${titleError ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
            >
              <div className="flex justify-between">
                <>Title</>
                <button
                  className="mt-2 placeholder:font-semibold text-indigo-600 hover:text-indigo-500"
                  onClick={() => prop.remove(qi)}
                > - delete question</button>
              </div>
            </label>
            <Field
              name={`categories.${i}.questions.${qi}.title`}
              onChange={handleChange}
              value={values.categories[i].questions[qi].title}
              className={`block w-full rounded-md ${titleError ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            />
            {titleError && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{titleError}</p>}
          </div>
          <div className="mt-2">
            <label
              htmlFor="body"
              className={`block text-sm font-medium leading-6 ${descriptionError ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
            >
              Description
            </label>
            <Field
              name={`categories.${i}.questions.${qi}.description`}
              component="textarea"
              rows="3"
              onChange={handleChange}
              value={values.categories[i].questions[qi].description}
              className={`block w-full rounded-md ${descriptionError ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            />
            {descriptionError && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{descriptionError}</p>}
          </div>
          <div className="mt-2 mb-5">
            <label
              htmlFor="body"
              className={`block text-sm font-medium leading-6 ${answerError ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
            >
              Answer
            </label>
            <Field
              name={`categories.${i}.questions.${qi}.answer`}
              component="textarea"
              rows="3"
              onChange={handleChange}
              value={values.categories[i].questions[qi].answer}
              className={`block w-full rounded-md ${answerError ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            />
            {answerError && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{answerError}</p>}
          </div>
          <hr/>
        </div>
      )}
    />
  );
}
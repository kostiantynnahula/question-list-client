'use client'
import { useFormik, FormikProvider, FieldArray, Field } from 'formik';
import * as Yup from 'yup';
import { FormData } from '@/components/TestForm/models';
import { newCategory, newQuestion } from '@/components/TestForm/consts';
import { checkError } from '@/helpers/errorMessage';

export const TestForm = () => {

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().min(5),
    categories: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string()
            .required()
            .min(5),
          questions: Yup.array()
            .of(
              Yup.object().shape({
                title: Yup.string().required().min(5),
                description: Yup.string().required().min(5),
                answer: Yup.string().required().min(5),
              }),
            )
        })
      )
  });

  const initialValues = {
    name: '',
    categories: [],
  };

  const onSubmit = (data: FormData) => {
    console.log(data, 'data');
  };

  const formik = useFormik<FormData>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const { handleSubmit, handleChange, values, errors, setFieldValue } = formik;

  const onAddCategory = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    console.log(newCategory, 'new category');
    setFieldValue('categories', [...values.categories, {...newCategory}]);
  }

  const onAddQuestion = (e: React.FormEvent<EventTarget>, index: number) => {
    e.preventDefault();
    const categories = values.categories;
    categories[index].questions = [...categories[index].questions, newQuestion];
    setFieldValue('categories', categories);
  }

  console.log(errors, 'errors');
  // console.log(values, 'values');

  return (
    <div>
      <form
        className="space-y-6"
        method="POST"
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="email"
            className={`block text-sm font-medium leading-6 ${errors.name ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
          >
            Name
          </label>
          <div className="mt-2">
            <input
              id="name"
              name="name"
              onChange={handleChange}
              value={values.name}
              className={`block w-full rounded-md ${errors.name ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            />
            {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>}
          </div>
        </div>
        <FormikProvider value={formik}>
          {values.categories.map((category, i) => (
            <FieldArray 
              key={i} 
              name="categories" 
              render={(prop) => (
                <div>
                  <div>
                    <label
                      htmlFor="name"
                      className={`block text-sm font-medium leading-6 ${checkError(['categories', 'name'], `categories[${i}].name`, errors) ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
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
                        className={`block w-full rounded-md ${checkError(['categories', 'name'], `categories[${i}].name`, errors) ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                      />
                      {checkError(['categories', 'name'], `categories[${i}].name`, errors) 
                        && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                          {checkError(['categories', 'name'], `categories[${i}].name`, errors)}
                        </p>
                      }
                      {category.questions.map((_, qi) => {
                        return (
                          <FieldArray
                            key={qi}
                            name={`categories.${i}.questions`}
                            render={(prop) => (
                              <div className="mt-2">
                                <div>
                                  <label
                                    htmlFor="title"
                                    className={`block text-sm font-medium leading-6 ${checkError(['categories', 'questions', 'title'], `categories[${i}].questions[${qi}].title`, errors) ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
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
                                    className={`block w-full rounded-md ${checkError(['categories', 'questions', 'title'], `categories[${i}].questions[${qi}].title`, errors) ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                  />
                                  {checkError(['categories', 'questions', 'title'], `categories[${i}].questions[${qi}].title`, errors) 
                                    && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                      {checkError(['categories', 'questions', 'title'], `categories[${i}].questions[${qi}].title`, errors)}
                                    </p>
                                  }
                                </div>
                                <div className="mt-2">
                                  <label
                                    htmlFor="body"
                                    className={`block text-sm font-medium leading-6 ${checkError(['categories', 'questions', 'description'], `categories[${i}].questions[${qi}].description`, errors) ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
                                  >
                                    Description
                                  </label>
                                  <Field
                                    name={`categories.${i}.questions.${qi}.description`}
                                    component="textarea"
                                    rows="3"
                                    onChange={handleChange}
                                    value={values.categories[i].questions[qi].description}
                                    className={`block w-full rounded-md ${checkError(['categories', 'questions', 'description'], `categories[${i}].questions[${qi}].description`, errors) ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                  />
                                  {checkError(['categories', 'questions', 'description'], `categories[${i}].questions[${qi}].description`, errors) 
                                    && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                      {checkError(['categories', 'questions', 'description'], `categories[${i}].questions[${qi}].description`, errors)}
                                    </p>
                                  }
                                </div>
                                <div className="mt-2 mb-5">
                                  <label
                                    htmlFor="body"
                                    className={`block text-sm font-medium leading-6 ${checkError(['categories', 'questions', 'answer'], `categories[${i}].questions[${qi}].answer`, errors) ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
                                  >
                                    Answer
                                  </label>
                                  <Field
                                    name={`categories.${i}.questions.${qi}.answer`}
                                    component="textarea"
                                    rows="3"
                                    onChange={handleChange}
                                    value={values.categories[i].questions[qi].answer}
                                    className={`block w-full rounded-md ${checkError(['categories', 'questions', 'answer'], `categories[${i}].questions[${qi}].answer`, errors) ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                  />
                                  {checkError(['categories', 'questions', 'answer'], `categories[${i}].questions[${qi}].answer`, errors) 
                                    && <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                                      {checkError(['categories', 'questions', 'answer'], `categories[${i}].questions[${qi}].answer`, errors)}
                                    </p>
                                  }
                                </div>
                                <hr/>
                              </div>
                            )}
                          />
                        );
                      })}
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
          ))}
        </FormikProvider>
        <div>
          <button
            type='button'
            className="font-semibold text-indigo-600 hover:text-indigo-500"
            onClick={onAddCategory}
          >+ add category</button>
        </div>
        <button
          type="submit"
          className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
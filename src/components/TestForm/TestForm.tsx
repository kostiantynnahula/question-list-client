'use client'

import { useState } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import { Test } from '@/models/tests/models';
import { FormData } from '@/components/TestForm/models';
import { newCategory, newQuestion } from '@/components/TestForm/consts';
import { CategoryForm } from './CategoryForm';
import { useSession } from 'next-auth/react';
import { AlertState, Alert } from '@/components/Alert/Alert';
import { fetchTemplates } from '@/fetchers/tests';
import useSWR from 'swr';

type TestFormProps = {
  test?: Test
};

export const TestForm = ({
  test
}: TestFormProps) => {
  const [alert, setAlert] = useState<AlertState>();
  const [initialValues] = useState<FormData>({
    name: test?.name || '',
    categories: test?.categories || [],
    isTemplate: test?.isTemplate || false,
  });

  const session = useSession();

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

  const onSubmit = async (data: FormData) => {
    if (test && test.id) {
      await onUpdate(test.id, data);
    } else {
      await onCreate(data);
    }
  };

  const onCreate = async (data: FormData) => {
    const body = JSON.stringify(data);
    const path = `${process.env.NEXT_PUBLIC_API_PATH}/tests`;
    const response = await fetch(path, {
      method: 'POST',
      body,
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${session.data?.user.accessToken}`
      }
    });

    const responseData = await response.json();

    if (response.status === 201) {
      setAlert({
        type: 'success',
        message: 'Test was created successful',
      });
    } else {
      const message = responseData.message || 'Something went wrong';
      setAlert({
        type: 'error',
        message
      });
    }
  }

  const onUpdate = async (testId: string, data: FormData) => {
    const body = JSON.stringify(data);
    const path = `${process.env.NEXT_PUBLIC_API_PATH}/tests/${testId}`;
    const response = await fetch(path, {
      method: 'PATCH',
      body,
      headers: {
        'Content-type': 'application/json',
        'Authorization': `Bearer ${session.data?.user.accessToken}`
      }
    });

    const responseData = await response.json();

    if (response.status === 200) {
      setAlert({
        type: 'success',
        message: 'Test was updated successful',
      });
    } else {
      const message = responseData.message || 'Something went wrong';
      setAlert({
        type: 'error',
        message
      });
    }
  }

  const formik = useFormik<FormData>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, setFieldValue } = formik;

  const onAddCategory = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault();
    setFieldValue('categories', [...values.categories, {...newCategory}]);
  }

  const onAddQuestion = (e: React.FormEvent<EventTarget>, index: number) => {
    e.preventDefault();
    const categories = values.categories;
    categories[index].questions = [...categories[index].questions, newQuestion];
    setFieldValue('categories', categories);
  }
  
  const onCloseAlert = () => {
    setAlert(undefined);
  }

  const onSelectTemplate = (e: any) => {
    const templateId = e.target.value;
    const template = templates?.find((item) => item.id === templateId);
    if (template) {
      setFieldValue('categories', template.categories);
    }
  }

  const { data: templates } = useSWR({
    key: 'templates',
    token: session.data?.user.accessToken || ''
  }, fetchTemplates);


  return (
    <div>
      {alert && <Alert
        type={alert.type}
        message={alert.message}
        onClose={onCloseAlert}
      />}
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
        <div>
          <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >Select an option</label>
            <select
              onChange={(e: any) => onSelectTemplate(e)}
              id="countries"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option selected>Choose a template</option>
              {templates?.map((template) => (<option
                key={template.id}
                value={template.id}
              >Template 1</option>))}
            </select>
        </div>
        <FormikProvider value={formik}>
          {values.categories.map((category, i) => (
            <CategoryForm
              handleChange={handleChange}
              errors={errors}
              values={values}
              category={category}
              index={i}
              onAddQuestion={onAddQuestion}
              key={i}
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
        <div>
        <div className="flex items-center">
          <input
            checked={values.isTemplate}
            id="is-template"
            type="checkbox"
            name="isTemplate"
            onChange={() => setFieldValue('isTemplate', !values.isTemplate)}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <label
            htmlFor="is-template"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >Is template</label>
        </div>
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
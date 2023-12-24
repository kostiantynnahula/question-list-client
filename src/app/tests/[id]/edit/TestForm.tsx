import { useState } from 'react';
import { Test } from '@/models/tests/models';
import { FormData } from '@/components/TestForm/models';
import { useFormik } from 'formik';
import * as Yup from 'yup';

type TestFormProps = {
  test: Test;
};

export const TestForm = ({test}: TestFormProps) => {

  const [initialValues, setInitialValues] = useState<FormData>({
    name: test?.name || '',
    isTemplate: test?.isTemplate || false,
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().min(5),
    isTemplate: Yup.boolean().optional(),
  });

  const onSubmit = () => {
    console.log('on submit');
  };

  const formik = useFormik<FormData>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, setFieldValue } = formik;

  return (
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
          htmlFor="template"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Select an option</label>
          <select
            onChange={(e: any) => console.log('on select template')}
            id="template"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option selected>Choose a template</option>
            {/* {templates?.map((template) => (<option
              key={template.id}
              value={template.id}
            >Template 1</option>))} */}
          </select>
      </div>
                  <button
        type="submit"
        className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        Submit
      </button>
    </form>
  );
}
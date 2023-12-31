'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertState, Alert } from '@/components/Alert/Alert';

type FormData = {
  email: string;
}

export const ForgotForm = () => {
  const [alert, setAlert] = useState<AlertState>();

  const validationSchema = Yup.object().shape({
    email: Yup
      .string()
      .trim()
      .email()
      .required()
  });

  const initialValues = {
    email: '',
  };

  const onSubmit = async (data: FormData) => {
    const path = `${process.env.NEXT_PUBLIC_API_PATH}/auth/forgot`;
    const body = JSON.stringify(data);

    const response = await fetch(path, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body,
    });

    const responseData = await response.json();

    if (response.status === 201) {
      setAlert({
        type: 'success',
        message: 'We send an email with a link to reset password',
      });
    } else {
      const message = responseData.message || 'Something went wrong';
      setAlert({
        type: 'error',
        message
      });
    }
  }

  const { handleSubmit, handleChange, values, errors } = useFormik<FormData>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  const onCloseAlert = () => {
    setAlert(undefined);
  }

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Forgot password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {alert && <Alert
              type={alert.type}
              message={alert.message}
              onClose={onCloseAlert}
            />}
          <form 
            className="space-y-6 mt-3"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium leading-6 ${errors.email ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={handleChange}
                  value={values.email}
                  className={`block w-full rounded-md ${errors.email ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
                {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email}</p>}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Submit
              </button>
              <Link href="/">
                <button className="flex w-full justify-center rounded-md bg-gray-200 px-3 py-1.5 mt-5 text-sm font-semibold leading-6 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
                  Back
                </button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
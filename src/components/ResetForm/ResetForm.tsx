'use client'

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertState, Alert } from '@/components/Alert/Alert';
import { useSearchParams } from 'next/navigation';

type FormData = {
  password: string;
} 

export const ResetForm = () => {

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [alert, setAlert] = useState<AlertState>();
  
  const validationSchema = Yup.object().shape({
    password: Yup.string().trim().required(),
  });

  const initialValues = {
    password: '',
  };

  const onSubmit = async (data: FormData) => {
    
    if (!token) {
      setAlert({
        type: 'error',
        message: 'Token is invalid',
      });
      return null;
    }

    const path = `${process.env.NEXT_PUBLIC_API_PATH}/auth/reset`;
    const body = JSON.stringify({
      ...data,
      token
    });

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
        message: 'Password is changed, please login to check it',
      });
    } else {
      const message = responseData.message || 'Something went wrong';
      setAlert({
        type: 'error',
        message
      });
    }
  };

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
          {alert && <Alert message={alert.message} type={alert.type} onClose={onCloseAlert}/>}
        </div>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Reset password
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form 
            className="space-y-6"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <label
                htmlFor="email"
                className={`block text-sm font-medium leading-6 text-gray-900 ${errors.password ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={values.password}
                  className={`block w-full rounded-md ${errors.password ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
                {errors.password && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.password}</p>}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
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
'use client'
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { AlertState, Alert } from '@/components/Alert/Alert';

type FormData = {
  email: string;
  password: string;
}

export const LoginForm = () => {

  const searchParams = useSearchParams();
  const errorParam = searchParams.get('error')
  const [alert, setAlert] = useState<AlertState>();

  useEffect(() => {
    if (errorParam) {
      setAlert({
        type: 'error',
        message: errorParam,
      });
    }
  }, [errorParam])

  const validationSchema = Yup.object().shape({
    email: Yup
      .string()
      .trim()
      .email()
      .required(),
    password: Yup
      .string()
      .trim()
      .required()
  });

  const initialValues = {
    email: '',
    password: '',
  };

  const onSubmit = (data: FormData) => {
    signIn('credentials', data);
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
            Sign in
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
            <div className="text-sm flex justify-between">
              <Link
                href="/registration"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >Create account</Link>
              <Link
                href="/forgot"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >Forgot password?</Link>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default LoginForm;
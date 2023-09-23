'use client'

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertState, Alert } from '@/components/Alert/Alert';
import { redirect } from 'next/navigation';

type FormData = {
  username: string;
  email: string;
  password: string | undefined;
};

const Profile = () => {

  const [alert, setAlert] = useState<AlertState>();
  const session = useSession();

  if (session.status === 'unauthenticated') {
    redirect('/');
  }

  const validationSchema = Yup.object().shape({
    username: Yup
      .string()
      .required(),
    email: Yup
      .string()
      .trim()
      .email()
      .required(),
  });

  const initialValues = {
    username: session.data?.user.username || '',
    email: session.data?.user.email || '',
    password: '',
  }

  const onSubmit = async (data: FormData) => {

    if (!data.password?.length) {
      data.password = undefined;
    }

    const body = JSON.stringify(data);
    const path = `${process.env.NEXT_PUBLIC_API_PATH}/auth/profile`
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
        message: 'Profile update successful',
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
    <div>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile</h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="max-w-3xl py-6">
            {alert && <Alert
              type={alert.type}
              message={alert.message}
              onClose={onCloseAlert}
            />}
            <form className="space-y-6 mt-3" onSubmit={handleSubmit} method="POST">
              <div>
                <label
                  htmlFor="username"
                  className={`block text-sm font-medium leading-6 ${errors.username ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    onChange={handleChange}
                    value={values.username}
                    className={`block w-full rounded-md ${errors.username ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                  {errors.username && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.username}</p>}
                </div>
              </div>
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
                    onChange={handleChange}
                    value={values.email}
                    className={`block w-full rounded-md ${errors.email ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email}</p>}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className={`block text-sm font-medium leading-6 text-gray-900 ${errors.email ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
                  >
                    Password
                  </label>
                  
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
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
                  className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profile;
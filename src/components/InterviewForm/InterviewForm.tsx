'use client'

import { useState } from 'react';
import { Interview } from '@/models/interviews/models';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSession } from 'next-auth/react';
import { listFetcher as candidatesFetcher } from '@/fetchers/candidates';
import { listFetcher as testsFetcher } from '@/fetchers/tests';
import { createItem } from '@/fetchers/interviews';
import useSWR from 'swr';

type FormData = Pick<Interview, 'name' | 'description' | 'testId' | 'candidateId'>;

export const InterviewForm = () => {

  const [initialValues] = useState<FormData>({
    name: '',
    description: '',
    testId: '',
    candidateId: '',
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(),
    description: Yup.string()
      .trim()
      .required(),
    testId: Yup.string()
      .required(),
    candidateId: Yup.string()
      .required(),
  });

  const session = useSession();

  const sessionToken = session.data?.user.accessToken;

  const { data: candidates, isLoading: candidatesLoading } = useSWR({
    key: 'candidates',
    token: sessionToken
  }, candidatesFetcher);

  const { data: tests, isLoading: testsLoading } = useSWR({
    key: 'tests',
    token: sessionToken,
  }, testsFetcher);

  const onSubmit = async (data: FormData) => {
    if (sessionToken) {
      const response = await createItem(JSON.stringify(data), sessionToken)
      console.log(response);
    }
  }

  const formik = useFormik<FormData>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors } = formik;

  return (
    <>
      <form
        className="space-y-6"
        method='POST'
        onSubmit={handleSubmit}
      >
        <div>
          <label
            htmlFor="Name"
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
            htmlFor="description"
            className={`block text-sm font-medium leading-6 ${errors.description ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
          >
            Description
          </label>
          <div className="mt-2">
            <textarea
              id="description"
              name="description"
              onChange={handleChange}
              value={values.description}
              rows={3}
              className={`block w-full rounded-md ${errors.description ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            />
            {errors.description && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.description}</p>}
          </div>
        </div>
        <div>
          <label
            htmlFor="candidateId"
            className={`block text-sm font-medium leading-6 ${errors.candidateId ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
          >
            Candidate
          </label>
          <div className="mt-2">
            <select
              id="candidateId"
              name="candidateId"
              onChange={handleChange}
              value={values.candidateId}
              className={`block w-full rounded-md ${errors.candidateId ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            >
              <option value="">Please choose the candidate</option>
              {candidates?.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.fullName}</option>)}
            </select>
            {errors.candidateId && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.candidateId}</p>}
          </div>
        </div>
        <div>
          <label
            htmlFor="testId"
            className={`block text-sm font-medium leading-6 ${errors.candidateId ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
          >
            Test
          </label>
          <div className="mt-2">
            <select
              id="testId"
              name="testId"
              onChange={handleChange}
              value={values.testId}
              className={`block w-full rounded-md ${errors.candidateId ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            >
              <option value="">Please choose the test</option>
              {tests?.map(test => <option key={test.id} value={test.id}>{test.name}</option>)}
            </select>
            {errors.testId && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.testId}</p>}
          </div>
        </div>
        <button
          type="submit"
          className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Submit
        </button>
      </form>
    </>
  );
}

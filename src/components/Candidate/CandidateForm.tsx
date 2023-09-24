'use client'

import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Candidate } from '@/models/candidates/models';

type CandidateFormProps = {
  candidate?: Candidate;
}

type CandidateFormState = Pick<Candidate, 'fullName' | 'email' | 'resumeLink'>

export const CandidateForm = ({
  candidate
}: CandidateFormProps) => {

  const [initialValues] = useState<CandidateFormState>({
    fullName: candidate?.fullName || '',
    email: candidate?.email || '',
    resumeLink: candidate?.resumeLink || '', 
  });

  const validationSchema = Yup.object().shape({
    fullname: Yup.string()
      .trim()
      .required(),
    email: Yup.string()
      .email()
      .trim()
      .required(),
    resumeLink: Yup.string()
      .trim()
      .url()
      .optional(),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const formik = useFormik<CandidateFormState>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors } = formik;

  return (
    <div>
      <form
        className="space-y-6"
        onSubmit={handleSubmit}
      >
         <div>
          <label
            htmlFor="fullname"
            className={`block text-sm font-medium leading-6 ${errors.fullName ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
          >
            Full name
          </label>
          <div className="mt-2">
            <input
              id="fullName"
              name="fullName"
              onChange={handleChange}
              value={values.fullName}
              className={`block w-full rounded-md ${errors.fullName ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            />
            {errors.fullName && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.fullName}</p>}
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
              onChange={handleChange}
              value={values.email}
              className={`block w-full rounded-md ${errors.email ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            />
            {errors.email && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.email}</p>}
          </div>
        </div>
        <div>
          <label
            htmlFor="resumeLink"
            className={`block text-sm font-medium leading-6 ${errors.resumeLink ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
          >
            Resume link
          </label>
          <div className="mt-2">
            <input
              id="resumeLink"
              name="resumeLink"
              onChange={handleChange}
              value={values.resumeLink}
              className={`block w-full rounded-md ${errors.resumeLink ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
            />
            {errors.resumeLink && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.resumeLink}</p>}
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
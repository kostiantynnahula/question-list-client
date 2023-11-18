'use client';

import { useState } from 'react';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { TestFetcher } from '@/fetchers/tests';
import { useSession } from 'next-auth/react';
import { Test } from '@/models/tests/models';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/Layout/Spinner';

type ModalProps = {
  open: boolean;
  onClose: () => void;
};

type FormData = {
  name: string;
};

export const TestModal = ({
  open,
  onClose,
}: ModalProps) => {

  const [initialValues] = useState<FormData>({ name: '' });

  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();
  const session = useSession();

  const testFetcher = new TestFetcher<Test>(session.data?.user.accessToken || '');

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().min(5),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await testFetcher.create(JSON.stringify(data));
    if (result.status === 201) {
      const response = await result.json();
      router.push(`/tests/${response.id}/edit`);
    }
    
    onClose();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { values, errors, handleSubmit, handleChange } = formik;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                        Create a new test
                      </Dialog.Title>
                      <div className="mt-2">
                        <form
                          onSubmit={handleSubmit}
                          className='space-y-6 w-100'
                        >
                          <div>
                            <label 
                              htmlFor="name" 
                              className="block text-sm font-medium text-gray-700"
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
                          <div className="sm:flex sm:flex-row-reverse">
                            <button
                              disabled={loading}
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                            >
                              <span className='pr-2'>Create</span>{loading && <Spinner radius={5}/>}
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={onClose}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
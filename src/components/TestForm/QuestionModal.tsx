'use client'

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Spinner } from '@/components/Layout/Spinner';
import { Question, Category } from '@/models/tests/models';
import { QuestionFormData } from '@/components/TestForm/models';

type ModalProps = {
  open: boolean;
  loading: boolean;
  question: Question | null;
  categories: Category[];
  onClose: () => void;
  onEditHandler: (data: Question) => void;
  onSubmitHandler: (data: QuestionFormData) => void;
};

export const QuestionModal = ({
  open,
  loading,
  question,
  categories,
  onClose,
  onEditHandler,
  onSubmitHandler,
}: ModalProps) => {

  const [initialValues] = useState<QuestionFormData>({
    title: question?.title || '',
    description: question?.description || '',
    answer: question?.answer || '',
    categoryId: question?.categoryId || null,
  });

  const validationSchema = Yup.object().shape({
    title: Yup.string().required().min(5),
    description: Yup.string().required().min(5),
    answer: Yup.string().required().min(5),
  });

  const onSubmit = async (data: QuestionFormData) => {
    if (question) {
      onEditHandler({ ...question, ...data });
    } else {
      onSubmitHandler(data);
    }
  };

  const {
    values,
    errors,
    handleSubmit,
    handleChange,
    setFieldValue,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <div className='category-modal-container'>
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
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
                          {question ? 'Update the' : 'Create a new'} question
                        </Dialog.Title>
                        <div className="mt-2">
                          <form
                            onSubmit={handleSubmit}
                            className='space-y-6 w-100'
                          >
                            <div>
                              <label
                                htmlFor="category"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                              >Select an option</label>
                                <select
                                  onChange={(e: any) => setFieldValue('categoryId', e.target.value || null)}
                                  id="category"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                  value={values.categoryId || ''}
                                >
                                  <option value={""}>Choose a category</option>
                                  {categories.map(category =>
                                    <option key={category.id} value={category.id}>{category.name}</option>)
                                  }
                                </select>
                            </div>
                            <div>
                              <label 
                                htmlFor="title" 
                                className="block text-sm font-medium text-gray-700"
                              >
                                Title
                              </label>
                              <div className="mt-2">
                                <input
                                  id="title"
                                  name="title"
                                  onChange={handleChange}
                                  value={values.title}
                                  className={`block w-full rounded-md ${errors.title ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                />
                                {errors.title && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.title}</p>}
                              </div>
                            </div>
                            <div>
                              <label 
                                htmlFor="description" 
                                className="block text-sm font-medium text-gray-700"
                              >
                                Description
                              </label>
                              <div className="mt-2">
                                <textarea
                                  rows={4}
                                  id="description"
                                  name="description"
                                  onChange={handleChange}
                                  value={values.description}
                                  className={`block w-full rounded-md ${errors.description ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                />
                                {errors.description && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.description}</p>}
                              </div>
                            </div>
                            <div>
                              <label 
                                htmlFor="answer" 
                                className="block text-sm font-medium text-gray-700"
                              >
                                Answer
                              </label>
                              <div className="mt-2">
                                <textarea
                                  rows={4}
                                  id="answer"
                                  name="answer"
                                  onChange={handleChange}
                                  value={values.answer}
                                  className={`block w-full rounded-md ${errors.answer ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                                />
                                {errors.answer && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.answer}</p>}
                              </div>
                            </div>
                            <div className="sm:flex sm:flex-row-reverse">
                              <button
                                disabled={loading}
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                              >
                                <span>{question ? 'Update' : 'Create'}</span>{loading && <Spinner radius={5}/>}
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
    </div>
  );
};
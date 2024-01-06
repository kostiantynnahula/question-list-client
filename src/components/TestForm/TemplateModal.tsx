'use client';

import { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Spinner } from '@/components/Layout/Spinner';
import { Test } from '@/models/tests/models';
import { useFormik } from 'formik';
import * as Yup from 'yup';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  loading: boolean;
  templates: Test[];
  onClone: (templateId: string) => void;
};

type FormData = {
  templateId: string;
};

export const TemplateModal = ({
  open,
  onClose,
  templates,
  loading,
  onClone,
}: ModalProps) => {

  const [initialValues] = useState<FormData>({ templateId: '' });

  const validationSchema = Yup.object().shape({
    templateId: Yup.string().required(),
  });

  const onSubmit = (data: FormData) => {
    console.log('on submit');
    onClone(data.templateId);
  }

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { values, handleSubmit, handleChange } = formik;

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
                        Add a template to your test
                      </Dialog.Title>
                      <div className="mt-2">
                        <form
                          onSubmit={handleSubmit}
                          className='space-y-6 w-100'
                        >
                          <div>
                            <select
                              name="templateId"
                              onChange={handleChange}
                              id="template"
                              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            >
                              <option selected value={''}>Choose a template</option>
                              {templates?.map((template) => (<option
                                key={template.id}
                                value={template.id}
                              >Template 1</option>))}
                            </select>
                          </div>
                          <div className="sm:flex sm:flex-row-reverse">
                            <button
                              disabled={loading}
                              type="submit"
                              className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                            >
                              <span>Create</span>{loading && <Spinner radius={5}/>}
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
  );
};
'use client'

import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { Spinner } from '@/components/Layout/Spinner';
import { TestFetcher } from '@/fetchers/tests';
import { CategoryFetcher } from '@/fetchers/categories';
import { QuestionFetcher } from '@/fetchers/questions';
import { Category, Question, Test } from '@/models/tests/models';
import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AlertState, Alert } from '@/components/Alert/Alert';
import { Question as QuestionItem } from '@/components/TestForm/Question';
import { CategoryModal } from '@/components/TestForm/CategoryModal';
import { QuestionModal } from '@/components/TestForm/QuestionModal';
import { TemplateModal } from '@/components/TestForm/TemplateModal';
import { FormData, CategoryFormData, QuestionFormData } from '@/components/TestForm/models';
import { Modal } from '@/components/Modal/Modal';
import { Category as CategoryItem } from '@/components/TestForm/Category';

const EditPage = () => {

  const params = useParams();
  const testId = params.id as string;
  const session = useSession({ required: true });
  const token = session.data?.user.accessToken || '';
  const testFetcher = new TestFetcher<Test>(token);
  const categoryFecther = new CategoryFetcher<Category>(token);
  const questionFecther = new QuestionFetcher<Question>(token);

  const { data: test, isLoading, mutate } = useSWR({
    url: `/tests/${params.id}`,
    token: session.data?.user.accessToken,
    id: params.id,
  }, async () => await testFetcher.test(testId));

  useEffect(() => {
    // TODO refacort this way of setting initial values
    if (!isLoading && test) {
      setFieldValue('name', test.name);
      setFieldValue('isTemplate', test.isTemplate);
    }
  }, [isLoading, test]);

  const [alert, setAlert] = useState<AlertState>();
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showQuestionModal, setShowQuestionModal] = useState<boolean>(false);
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [loadingCategoryModal, setLoadingCategoryModal] = useState<boolean>(false);
  const [loadingQuestionModal, setLoadingQuestionModal] = useState<boolean>(false);
  const [loadingTemplateModal, setLoadingTemplateModal] = useState<boolean>(false);
  const [showDeleteQuestionModal, setShowDeleteQuestionModal] = useState<boolean>(false);
  const [editQuestion, setEditQuestion] = useState<Question|null>(null);
  const [deleteQuestionId, setDeleteQuestionId] = useState<string|null>(null);
  const [editCategory, setEditCategory] = useState<Category|null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<string|null>(null);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState<boolean>(false);
  const [initialValues] = useState<FormData>({
    name: '',
    isTemplate: false,
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required().min(5),
    isTemplate: Yup.boolean().optional(),
  });

  const onSubmit = async (data: FormData) => {
    if (test) {
      const response = await testFetcher.update(test.id, JSON.stringify(data));
      
      const responseData = await response.json();

      if (response.status === 200) {
        setAlert({
          type: 'success',
          message: 'Test was updated successful',
        });
      } else {
        const message = responseData.message || 'Something went wrong';
        setAlert({
          type: 'error',
          message
        });
      }
      
      mutate();
    }
  };

  const formik = useFormik<FormData>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  const { handleSubmit, handleChange, values, errors, touched, setFieldValue } = formik;

  const onCloseAlert = () => {
    setAlert(undefined);
  }

  const { data: templates } = useSWR({
    key: 'templates',
    token: session.data?.user.accessToken || ''
  }, async () => {
    return await testFetcher.testList(true) as unknown as Test[];
  });

  const onAddCategory = (e: React.FormEvent<EventTarget>) => {
    setShowCategoryModal(true);
  }

  const onEditCategory = (category: Category) => {
    setShowCategoryModal(true);
    setEditCategory(category);
  };

  const handleAddCategory = async (data: CategoryFormData) => {
    setLoadingCategoryModal(true);
    if (test) {
      const order = test.categories.length;
      const body = JSON.stringify({ ...data, testId: test.id, order });
      await categoryFecther.create(body);
    }
    setShowCategoryModal(false);
    setLoadingCategoryModal(false);
    
    mutate();
  };

  const handleEditCategory = async (data: Category) => {
    setLoadingCategoryModal(true);
    if (editCategory) {
      const body = JSON.stringify({ ...data, questions: undefined });
      await categoryFecther.update(editCategory.id, body);
    }
    setShowCategoryModal(false);
    setLoadingCategoryModal(false);
    mutate();
  };

  const handleDeleteCategory = async () => {
    if (deleteCategoryId) {
      await categoryFecther.delete(deleteCategoryId);
    }
    setShowDeleteCategoryModal(false);
    setDeleteCategoryId(null);
    mutate();
  }

  const onAddQuestion = () => {
    setShowQuestionModal(true);
  }

  const onDeleteCategory = (id: string) => {
    setDeleteCategoryId(id);
    setShowDeleteCategoryModal(true);
  }

  const handleAddQuestion = async (data: QuestionFormData) => {
    setLoadingQuestionModal(true);
    if (test) {
      const questionCategory = data?.categoryId;
      const category = test.categories.find((category) => category.id === questionCategory);
      const order = data?.categoryId && category ? category?.questions?.length : test.questions.length;

      const body = JSON.stringify({ ...data, testId: test.id, order, categoryId: questionCategory || undefined });
      await questionFecther.create(body);
    }
    setLoadingQuestionModal(false);
    setShowQuestionModal(false);
    mutate();
  };

  const handleEditQuestion = async (data: Question) => {
    setLoadingQuestionModal(true);
    if (editQuestion) {
      const body = JSON.stringify({ ...data, categoryId: data.categoryId });
      await questionFecther.update(editQuestion.id, body);
    }
    setLoadingQuestionModal(false);
    setShowQuestionModal(false);
    mutate();
  };

  const handleDeleteQuestion = async () => {
    if (deleteQuestionId) {
      await questionFecther.delete(deleteQuestionId);
      mutate();
    }
    setShowDeleteQuestionModal(false);
  };

  const onEditQuestion = (question: Question) => {
    setEditQuestion(question);
    setShowQuestionModal(true);
  };

  const onCloseQuestionModal = () => {
    setEditQuestion(null);
    setShowQuestionModal(false);
  };

  const onDeleteQuestion = (id: string) => {
    setShowDeleteQuestionModal(true);
    setDeleteQuestionId(id)
  };

  const onCloseDeleteQuestionModal = () => {
    setShowDeleteQuestionModal(false);
    setDeleteQuestionId(null)
  };

  const onCloseDeleteCategoryModal = () => {
    setShowDeleteCategoryModal(false);
    setDeleteCategoryId(null);
  }

  const handleCloneTemplate = async (templateId: string) => {
    setLoadingTemplateModal(true);
    if (showTemplateModal) {
      testFetcher.clone(testId, JSON.stringify({ templateId }));
    }
    setShowTemplateModal(false);
    setLoadingTemplateModal(false);
    mutate();
  }

  const onChangeQuestionOrder = async (questionId: string, order: number) => {
    if (test) {
      const body = JSON.stringify({ order: order < 0 ? 0 : order });
      await questionFecther.update(questionId, body);
    }
    mutate();
  }

  const onChangeCategoryOrder = async (id: string, order: number) => {
    if (test) {
      const body = JSON.stringify({ order: order < 0 ? 0 : order });
      await categoryFecther.update(id, body);
    }
    mutate();
  }

  return (
    <div>
      {isLoading && <div className="text-center"><Spinner/></div>}
      <div>
        {alert && <Alert
          type={alert.type}
          message={alert.message}
          onClose={onCloseAlert}
        />}
        {!isLoading && test &&
          <form
            className="space-y-6"
            method="POST"
            onSubmit={handleSubmit}
          >
            <div>
              <div>
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium leading-6 ${touched.name && errors.name ? 'text-red-700 dark:text-red-500' : 'text-gray-900'}`}
                >
                  Name
                </label>
                <div className="mt-2">
                  <div>
                    <input
                      id="name"
                      name="name"
                      onChange={handleChange}
                      value={values.name}
                      className={`block w-full rounded-md ${touched.name && errors.name ? 'bg-red-50 border border-red-500' : 'border-0'} p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    />
                    {touched.name && errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.name}</p>}
                  </div>
                </div>
              </div>
              <div className='mt-1 text-center'>
                <button
                  type='button'
                  className="font-semibold text-indigo-600 hover:text-indigo-500 leading-10"
                  onClick={() => setShowTemplateModal(true)}
                >+ Add a template questions</button>
              </div>
            </div>
          
            <div>
              <button
                type='button'
                className="font-semibold text-indigo-600 hover:text-indigo-500 mr-2"
                onClick={onAddCategory}
              >+ add a category</button>
              <button
                type='button'
                className="font-semibold text-indigo-600 hover:text-indigo-500"
                onClick={onAddQuestion}
              >+ add a question</button>
            </div>
            <div className='category-list'>
              {test.categories.map((category) =>
                <CategoryItem
                  onChangeQuestionOrder={onChangeQuestionOrder}
                  key={category.id}
                  category={category}
                  onEditQuestion={onEditQuestion}
                  onDeleteQuestion={onDeleteQuestion}
                  onEdit={onEditCategory}
                  onDelete={onDeleteCategory}
                  onChangeCategoryOrder={onChangeCategoryOrder}
                />
              )}
            </div>
            <div
              className='questions-list'
            >
              {test?.questions.map((question, index) => (
                <QuestionItem
                  onChangeOrder={onChangeQuestionOrder}
                  question={question}
                  key={index}
                  onEdit={onEditQuestion}
                  onDelete={onDeleteQuestion}
                />
              ))}
            </div>
            <div>
              <div className="flex items-center">
                <input
                  checked={values.isTemplate}
                  id="is-template"
                  type="checkbox"
                  name="isTemplate"
                  onChange={() => setFieldValue('isTemplate', !values.isTemplate)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  htmlFor="is-template"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >Is template</label>
              </div>
            </div>
            <button
              type="submit"
              className="flex justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </form>
        }
        {showCategoryModal && <CategoryModal
          category={editCategory}
          onClose={() => setShowCategoryModal(false)}
          onEditHandler={handleEditCategory}
          onSubmitHandler={handleAddCategory}
          open={showCategoryModal}
          loading={loadingCategoryModal}
        />}
        {showQuestionModal && <QuestionModal
          categories={test?.categories || []}
          onClose={onCloseQuestionModal}
          onEditHandler={handleEditQuestion}
          onSubmitHandler={handleAddQuestion}
          open={showQuestionModal}
          loading={loadingQuestionModal}
          question={editQuestion}
        />}
        {showDeleteQuestionModal && <Modal
          open={showDeleteQuestionModal}
          title='Delete question'
          content='Are you sure you want to delete this question?'
          onClose={onCloseDeleteQuestionModal}
          onSubmit={handleDeleteQuestion}
        />}
        {showDeleteCategoryModal && <Modal
          open={showDeleteCategoryModal}
          title='Delete category'
          content='Are you sure you want to delete this category?'
          onClose={onCloseDeleteCategoryModal}
          onSubmit={handleDeleteCategory}
        />}
        {showTemplateModal && <TemplateModal
          open={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          templates={templates || []}
          loading={loadingTemplateModal}
          onClone={handleCloneTemplate}
        />}
      </div>
    </div>
  );
}

export default EditPage;
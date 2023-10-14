'use client'

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { Spinner } from '@/components/Layout/Spinner';
import { InterviewTests } from '@/models/interviews/models';
import { InterviewFetcher } from '@/fetchers/interviews';
import { itemFetcher as getCandidate } from '@/fetchers/candidates';
import { CorrectAnswerIcon, WrongAnswerIcon, WithoutAnswerIcon } from './icons';


type Answers = {
  correct: string[];
  wrong: string[];
}

const StartPage = () => {
  const { id } = useParams();
  const session = useSession();
  const token = session.data?.user.accessToken;
  const initialValues = { correct: [], wrong: [] };
  const interviewFetcher = new InterviewFetcher(token || '');

  const [answers, setAnswers] = useState<Answers>(initialValues);

  const { data: interview, isLoading: interviewLoading } = useSWR({
    key: 'item',
    id,
    token,
  }, async () => {
    return token ? await interviewFetcher.tests<InterviewTests>(id as string) : undefined;
  });

  const { data: candidate, isLoading: candidateLoading } = useSWR({
    key: 'candidate',
    id: interview?.candidateId,
    token
  }, getCandidate);

  const onHandleAnswer = (answerId: string, type: 'correct' | 'wrong') => {
    // TODO refactor it
    if (type === 'correct') {
      const index = answers.wrong.findIndex(i => i === answerId);
      index !== -1 && answers.wrong.splice(index, 1);
      const correct = !answers.correct.includes(answerId) ? [...answers.correct, answerId] : answers.correct;
      setAnswers({ ...answers, correct }); 
    } else {
      const index = answers.correct.findIndex(i => i === answerId);
      index !== -1 && answers.correct.splice(index, 1);
      const wrong = !answers.wrong.includes(answerId) ? [...answers.wrong, answerId] : answers.wrong;
      setAnswers({ ...answers, wrong }); 
    }
  };

  const onFinish = () => {
    console.log('on finish interview');
  }

  return (
    <>
      {candidateLoading && <Spinner/>}
      {!candidateLoading && candidate &&
        <div className="mb-2">
          Candidate info
          <ul>
            <li>
              <span><b>Full name:</b> {candidate.fullName}</span>
            </li>
            <li>
              <span><b>Email:</b> {candidate.email}</span>
            </li>
            <li>
              <span><b>Resume link:</b> <a href={candidate.resumeLink} target="blank">{candidate.resumeLink}</a></span>
            </li>
          </ul>
        </div>
      }
      {interviewLoading && <Spinner/>}
      {!interviewLoading && interview && (
        <>
          <p><b>Interview:</b> {interview.name}</p>
          <p><b>Description:</b> {interview.description}</p>
          <div className="mb-2 mt-2"><hr/></div>
          {interview.test?.categories.map((category, i) => (
            <div key={i}>
              <p className="mb-3">Category: {category.name}</p>
              <ol key={i} className="relative border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
              {category.questions.map((question, i) => (
                <li key={i} className="mb-10 ml-6">
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-gray-700">
                    {answers.correct.includes(question.id) && <CorrectAnswerIcon/>} 
                    {answers.wrong.includes(question.id) && <WrongAnswerIcon/>}
                    {!answers.correct.includes(question.id) && !answers.wrong.includes(question.id) && <WithoutAnswerIcon/>} 
                  </span>
                  <h3 className="font-medium leading-tight">{question.title}</h3>
                  <p className="mb-2 mt-2"><b>Description:</b> {question.description}</p>
                  <p className="mb-2 mt-2"><b>Answer:</b> {question.answer}</p>
                  <div>
                    <p className="mb-2">Result:</p>
                    <button 
                      type="button" 
                      className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                      onClick={() => onHandleAnswer(question.id, 'correct')}
                    >Correct</button>
                    <button 
                      type="button" 
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                      onClick={() => onHandleAnswer(question.id, 'wrong')}
                    >Wrong</button>
                  </div>
                </li>
              ))}
              </ol>
            </div>
          ))}
          <button 
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
            onClick={() => onFinish()}
          >Finish interview</button>
        </>
      )}
    </>
  );
}

export default StartPage;
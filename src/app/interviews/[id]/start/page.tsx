'use client'

import { useState, useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import useSWR from "swr";
import { Spinner } from '@/components/Layout/Spinner';
import { InterviewTests, InterviewStatus } from '@/models/interviews/models';
import { Candidate } from '@/models/candidates/models';
import { InterviewFetcher } from '@/fetchers/interviews';
import { CandidateFetcher } from '@/fetchers/candidates';
import { CorrectAnswerIcon, WrongAnswerIcon, WithoutAnswerIcon } from './icons';
import { Answer } from '@/models/answers/models';
import { AnswerFetcher } from '@/fetchers/answers';
import { blueBgBtn, redOutlineBtn, greenOutlineBtn } from '@/consts/styles/button';

type Answers = {
  correct: string[];
  wrong: string[];
}

const StartPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const session = useSession({
    required: true,
    onUnauthenticated: () => router.push('/')
  });
  const token = session.data?.user.accessToken;
  const initialValues = { correct: [], wrong: [] };
  const interviewFetcher = new InterviewFetcher(token || '');
  const answerFetcher = new AnswerFetcher(token || '');
  const candidateFetcer = new CandidateFetcher<Candidate>(token || '');

  const [answers, setAnswers] = useState<Answers>(initialValues);

  const { data: interview, isLoading: interviewLoading, mutate: reloadInterview } = useSWR({
    key: 'item',
    id,
    token,
  }, async () => {
    return await interviewFetcher.tests<InterviewTests>(id as string)
  });

  useEffect(() => {
    if (interview?.status === InterviewStatus.CREATED && token) {
      interviewFetcher.start(id as string).then(() => {
        reloadInterview();
        reloadAnswers();
      });
    }
  }, [interview]);

  const { data: interviewAnswers, mutate: reloadAnswers } = useSWR({
    key: 'interview/answers',
    id,
  }, async () => {
    if (token) {
      return await interviewFetcher.answers<Answer>(id as string);
    }

    return [];
  });

  const { data: candidate, isLoading: candidateLoading } = useSWR({
    key: 'candidate',
    id: interview?.candidateId,
    token
  }, async () => {
    return await candidateFetcer.candidate(interview?.candidateId || '');
  });

  useEffect(() => {
    const correct: string[] = [], wrong: string[] = [];

    interviewAnswers?.forEach(answer => {
      if (answer.correct === true) {
        correct.push(answer.questionId);
      } else if (answer.correct === false) {
        wrong.push(answer.questionId);
      }
    });

    setAnswers({ wrong, correct })

  }, [interviewAnswers]);
  
  const onHandleAnswer = async (questionId: string, type: 'correct' | 'wrong') => {
    // TODO refactor it
    const answer = interviewAnswers?.find(answer => answer.questionId === questionId);

    if (!answer) return;

    if (type === 'correct') {
      const index = answers.wrong.findIndex(i => i === questionId);
      index !== -1 && answers.wrong.splice(index, 1);
      const correct = !answers.correct.includes(questionId) ? [...answers.correct, questionId] : answers.correct;
      setAnswers({ ...answers, correct });
      await answerFetcher.setAnswer(answer.id, JSON.stringify({ correct: true }));
    } else {
      const index = answers.correct.findIndex(i => i === questionId);
      index !== -1 && answers.correct.splice(index, 1);
      const wrong = !answers.wrong.includes(questionId) ? [...answers.wrong, questionId] : answers.wrong;
      setAnswers({ ...answers, wrong });
      await answerFetcher.setAnswer(answer.id, JSON.stringify({ correct: false }));
    }
  };

  const onFinish = async () => {
    const interviewId = id as unknown as string;
    await interviewFetcher.update(interviewId, JSON.stringify({ status: 'COMPLETED' }));
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
          <p><b>Status:</b> {interview.status.toLowerCase()}</p>
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
                      className={greenOutlineBtn}
                      onClick={() => onHandleAnswer(question.id, 'correct')}
                    >Correct</button>
                    <button 
                      type="button" 
                      className={redOutlineBtn}
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
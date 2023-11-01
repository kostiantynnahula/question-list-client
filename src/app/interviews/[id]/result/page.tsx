'use client'

import { Spinner } from "@/components/Layout/Spinner";
import { InterviewFetcher } from "@/fetchers/interviews";
import { ExtendedAnswer } from "@/models/answers/models";
import { Interview } from "@/models/interviews/models";
import { useSession } from "next-auth/react";
import { useParams } from 'next/navigation';
import useSWR from "swr";

const Result = () => {

  const params = useParams();
  const session = useSession();

  const interviewId = params.id as string;
  const token = session.data?.user.accessToken || '';
  const interviewFetcher = new InterviewFetcher(token);

  const { data: answers, isLoading: answersLoading } = useSWR({
    key: 'answers',
    id: interviewId,
  }, async () => {
    return await interviewFetcher.answers<ExtendedAnswer>(interviewId, true);
  });

  const { data: interview, isLoading: interviewLoading } = useSWR({ key: 'interview', id: interviewId }, async () => {
    return await interviewFetcher.interview(interviewId) as Interview;
  });

  return (
    <div>
      <div id="detailed-pricing" className="w-full overflow-x-auto">
        {(answersLoading || interviewLoading) && <div className="text-center"><Spinner/></div>}
        {interview && 
          <div className="mb-4">
            <div><b>Description: </b>{interview.description}</div>
            <div><b>Date: </b>{new Date(interview.createdAt).toDateString()}</div>
            <div><b>Status: </b>{interview.status}</div>
            <div><b>Candidate name: </b>{interview.candidate.fullName}</div>
            <div><b>Candidate email: </b>{interview.candidate.email}</div>
          </div>
        }
        {answers && !!answers?.length && 
          <div className="overflow-hidden min-w-max">
            <div className="grid grid-cols-4 p-4 text-sm font-medium text-gray-900 bg-gray-100 border-t border-b border-gray-200 gap-x-16 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <div className="flex items-center">Question</div>
              <div>Answer</div>
            </div>
            {answers?.map(answer => (
              <div key={answer.id} className="grid grid-cols-4 px-4 py-5 text-sm text-gray-700 border-b border-gray-200 gap-x-16 dark:border-gray-700">
                <div className="text-gray-500 dark:text-gray-400">{answer.question.title} (<a href="#" className="text-blue-600 hover:underline">view all</a>)</div>
                <div>
                  {answer.correct ? 
                  <svg className="w-3 h-3 text-green-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                  </svg> : 
                  <svg className="w-3 h-3 text-red-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                  </svg>
                  }
                </div>
              </div>  
            ))}
          </div>
        }
      </div>
    </div>
  );
}

export default Result;
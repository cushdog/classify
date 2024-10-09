'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchData, Course, semesterConfigs } from '@/lib/commonFunctions';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SubjectDetails = () => {
  const [subjectData, setSubjectData] = useState<Course[][] | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchSubjectData = async () => {
      const subjectParam = searchParams.get('subject')?.split(' ');
      const termParam = searchParams.get('term')?.split(' ');
      const subj = subjectParam ? subjectParam[0] : '';
      const term = termParam ? termParam[0] : '';
      const year = termParam ? termParam[1] : '';
      const modified_search = `${subj} ${term.toLowerCase()} ${year}`;
      const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(modified_search)}`;
      const data = await fetchData(url);
      const uniqueData = data.filter(
        (item: Course[], index: number, self: Course[][]) =>
          index === self.findIndex((t) => t[2] === item[2] && t[3] === item[3])
      );
      setSubjectData(uniqueData);
    };

    fetchSubjectData();
  }, [searchParams]);

  const handleClassClick = (classNumber: string) => {
    const mostRecentTerm = `${semesterConfigs[0].semester} ${semesterConfigs[0].year}`;
    router.push(`/class?class=${classNumber}&term=${encodeURIComponent(mostRecentTerm)}`);
  };

  const toggleExpand = (index: number) => {
    setExpandedCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-blue-600 text-white p-4 sticky top-0 z-10">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-white hover:bg-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <h1 className="text-2xl font-bold mt-2">Subject Courses</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
        <ul className="space-y-4">
          {subjectData?.map((classData, index) => (
            <li key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div
                className="p-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpand(index)}
              >
                <div>
                  <h2 className="text-xl font-semibold">{`${classData[2]} ${classData[3]}`}</h2>
                  <p className="text-gray-600">{String(classData[4])}</p>
                </div>
                {expandedCards.has(index) ? (
                  <ChevronUp className="h-6 w-6 text-gray-400" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-gray-400" />
                )}
              </div>
              {expandedCards.has(index) && (
                <div className="px-4 pb-4">
                  <p className="text-gray-700 mb-2">{String(classData[5])}</p>
                  <p className="text-sm text-gray-600">
                    <strong>Credit Hours:</strong> {String(classData[6])}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Average GPA:</strong>{' '}
                    {classData[22] && Number(classData[22]) > 0
                      ? Number(classData[22]).toFixed(2)
                      : 'Not available'}
                  </p>
                  <Button
                    onClick={() => handleClassClick(`${classData[2]} ${classData[3]}`)}
                    className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
                  >
                    View Class Details
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default SubjectDetails;
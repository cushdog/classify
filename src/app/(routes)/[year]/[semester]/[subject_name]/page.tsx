'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  fetchData,
  fetchSubjectFullName,
} from '@/lib/commonFunctions';
import { Search, ArrowLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Suspense } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Course } from '@/types/commonTypes';
import { useMediaQuery } from '@mui/system';

const SubjectDetails = () => {
  const [subjectData, setSubjectData] = useState<Course[][] | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFullName, setSubjectFullName] = useState('');
  const router = useRouter();
  const params = useParams();
  const isMobile = useMediaQuery('(max-width:600px)');

  const minHeight = isMobile ? '18em' : '200px';

  // Extract dynamic parameters from the URL
  const { year, semester, subject_name } = params;

  useEffect(() => {
    if (subject_name && year && semester) {
      const fetchSubjectData = async () => {
        const modifiedSearch = `${typeof subject_name === 'string' ? subject_name.toUpperCase() : subject_name} ${typeof semester === 'string' ? semester.toLowerCase() : semester} ${year}`;
        const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
          modifiedSearch
        )}`;
        const data = await fetchData(url);
        const uniqueData = data.filter(
          (item: Course[], index: number, self: Course[][]) =>
            index === self.findIndex(
              (t) => t[2] === item[2] && t[3] === item[3]
            )
        );
        fetchSubjectFullName(typeof subject_name === 'string' ? subject_name.toUpperCase() : '').then((res) =>
          setSubjectFullName(res)
        );
        setSubjectData(uniqueData);
      };

      fetchSubjectData();
    }
  }, [subject_name, year, semester]);

  const handleClassClick = (classNumber: string) => {
    router.push(`/${year}/${semester}/${subject_name}/${classNumber}`);
  };

  const filteredData = subjectData?.filter((course) =>
    `${course[2]} ${course[3]} ${course[4]}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <header
        className="bg-blue-600 text-white sticky top-0 z-10"
        style={{
          width: '100%',
          minHeight: minHeight,
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={() => router.back()}
          variant="ghost"
          className="text-white hover:bg-blue-700 hidden md:inline-flex"
          style={{
            alignSelf: 'flex-start',
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        <div style={{ flexGrow: 1 }}></div>

        <h1
          style={{
            color: '#fff',
            fontWeight: 'bold',
            marginTop: '4px',
            fontSize: '2rem',
          }}
        >
          {subjectFullName && subjectFullName} Offerings in {semester} {year}
        </h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Search className="mr-2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow"
          />
        </div>

        <div className="hidden md:block">
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credit Hours
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg GPA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData?.map((course, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{`${course[2]} ${course[3]}`}</td>
                  <td className="px-6 py-4">{String(course[4])}</td>
                  <td className="px-6 py-4">{String(course[6])}</td>
                  <td className="px-6 py-4">
                    {course[22] && Number(course[22]) > 0
                      ? Number(course[22]).toFixed(2)
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <Button
                      onClick={() =>
                        handleClassClick(`${course[3]}`)
                      }
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4">
          {filteredData?.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold">{`${course[2]} ${course[3]}`}</h2>
              <p className="text-gray-600 mb-2">{String(course[4])}</p>
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <span>Credits: {String(course[6])}</span>
                <span>
                  Avg GPA:{' '}
                  {course[22] && Number(course[22]) > 0
                    ? Number(course[22]).toFixed(2)
                    : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Info className="h-4 w-4 mr-2" />
                      Description
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{`${course[2]} ${course[3]}: ${String(
                        course[4]
                      )}`}</DialogTitle>
                    </DialogHeader>
                    <p className="mt-2">{String(course[5])}</p>
                  </DialogContent>
                </Dialog>
                <Button
                  onClick={() =>
                    handleClassClick(`${course[3]}`)
                  }
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  size="sm"
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const SubjectDets = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SubjectDetails />
    </Suspense>
  );
};

export default SubjectDets;

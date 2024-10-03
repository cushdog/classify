"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  fetchData,
  Course,
  CourseInfo,
  Section,
  formatDate,
} from "@/lib/commonFunctions";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Suspense } from "react";

const CourseDetails: React.FC = () => {
  const [classData, setClassData] = useState<Course[][] | null>(null);
  const [classObj, setClassObj] = useState<CourseInfo | null>(null);
  const [sections, setSections] = useState<Section[] | null>(null);

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [professorInfo, setProfessorInfo] = useState<any | null>(null);
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(
    null
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  // Fetches data when the component loads
  useEffect(() => {
    const setupClassData = async () => {
      const classParam = searchParams.get("class")?.split(" ");
      const termParam = searchParams.get("term")?.split(" ");

      const subj = classParam ? classParam[0] : "";
      const num = classParam ? classParam[1] : "";

      const term = termParam ? termParam[0] : "";
      const year = termParam ? termParam[1] : "";

      const modified_search = `${subj} ${num} ${term.toLowerCase()} ${year}`;

      const url = `https://uiuc-course-api-production.up.railway.app/sections?query=${encodeURIComponent(
        modified_search
      )}`;

      const data = await fetchData(url);
      return data;
    };

    const fetchDataAndUpdateState = async () => {
      const data = await setupClassData();
      setClassData(data);
    };

    fetchDataAndUpdateState();
  }, []);

  // Process class data to set up the class object and sections
  useEffect(() => {
    if (classData) {
      const sample_section: Course[] = classData[0];
      const classInfo: CourseInfo = {
        year: Number(sample_section[0]),
        term: String(sample_section[1]),
        subject: String(sample_section[2]),
        courseNumber: String(sample_section[3]),
        title: String(sample_section[4]),
        description: String(sample_section[5]),
        creditHours: String(sample_section[6]),
        startDate: String(sample_section[13]),
        endDate: String(sample_section[14]),
        gpa: Number(Number(sample_section[22]).toFixed(2)),
        metadata: String(sample_section[23]),
        degreeRequirement: String(sample_section[24]),
      };
      setClassObj(classInfo);

      const sectionsList: Section[] = classData.map((course: Course[]) => ({
        startDate: course[13] ? String(course[13]) : null,
        endDate: course[14] ? String(course[14]) : null,
        enrollmentStatus: String(course[12]),
        partOfTerm: course[8] ? String(course[8]) : null,
        sectionCode: String(course[7]),
        sectionType: course[15] ? String(course[15]) : null,
        meetingDays: course[18] ? String(course[18]) : null,
        startTime: course[16] ? String(course[16]) : null,
        endTime: course[17] ? String(course[17]) : null,
        days: course[18] ? String(course[18]) : null,
        room: course[19] ? String(course[19]) : null,
        building: course[20] ? String(course[20]) : null,
        instructor: String(course[21]),
      }));
      setSections(sectionsList);
    }
  }, [classData]);

  // Handle Google Maps search for building
  const handleLocationClick = (building: string) => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      building
    )}+Champaign+Illinois`;
    window.open(googleMapsUrl, "_blank");
  };

  // Fetch professor's Rate My Professors data
  const handleProfessorClick = async (professor: string) => {
    const [lastName, firstName] = professor.split(", ");
    const url = `https://uiuc-course-api-production.up.railway.app/rmp?query=${firstName}+${lastName}`;
    const data = await fetchData(url);
    setProfessorInfo(data);
    setSelectedProfessor(professor);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="container mx-auto p-4">
      {/* Card for Class Information */}
      <Card className="mx-auto mt-8 max-w-4xl rounded-lg overflow-hidden shadow-lg bg-white">
        <CardHeader className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">
            {classObj && `${classObj.subject} ${classObj.courseNumber}`}
          </h2>
          <p className="text-lg font-semibold">{classObj && classObj.title}</p>
        </CardHeader>
        <CardContent className="p-6">
          <p>
            <strong>Description:</strong> {classObj && classObj.description}
          </p>
          <p className="mt-2">
            <strong>Credit Hours:</strong> {classObj && classObj.creditHours}
          </p>
          <p className="mt-2">
            <strong>Average GPA:</strong> {classObj && classObj.gpa}
          </p>
        </CardContent>
        <CardFooter className="p-6 bg-gray-100">
          <Button
            onClick={handleBack}
            variant="secondary"
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </CardFooter>
      </Card>

      {/* Display Sections Information */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-center mb-4">
          Sections Available
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections && sections.length > 0 ? (
            sections.map((section, index) => (
              <div
                key={index}
                className="p-4 border border-gray-200 shadow-md rounded-lg bg-white"
              >
                <h4 className="text-lg font-semibold mb-2">
                  Section{" "}
                  {section.sectionCode && section.sectionCode.length > 0
                    ? section.sectionCode
                    : "Not available"}
                </h4>
                <p>
                  <strong>Instructor: </strong>
                  {section.instructor &&
                  typeof section.instructor === "string" &&
                  section.instructor.length > 0 && section.instructor != "null" ? (
                    <button
                      className="text-blue-500 underline"
                      onClick={() => handleProfessorClick(section.instructor)}
                    >
                      {section.instructor}
                    </button>
                  ) : (
                    "Not available"
                  )}
                </p>
                <p>
                  <strong>Meeting Days:</strong>{" "}
                  {section.meetingDays && section.meetingDays.length > 0
                    ? section.meetingDays
                    : "Not available"}
                </p>
                <p>
                  <strong>Start Time:</strong>{" "}
                  {section.startTime && section.startTime.length > 0
                    ? section.startTime
                    : "Not available"}
                </p>
                <p>
                  <strong>End Time:</strong>{" "}
                  {section.endTime && section.endTime.length > 0
                    ? section.endTime
                    : "Not available"}
                </p>
                <p>
                  <strong>Room: </strong>
                  {section.room && section.room.length > 0
                    ? section.room
                    : "Not available"}
                  {section.building && section.building.length > 0 ? (
                    <button
                      className="text-blue-500 underline ml-1"
                      onClick={() =>
                        handleLocationClick(section.building ?? "")
                      }
                    >
                      {section.building}
                    </button>
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  <strong>Enrollment Status:</strong>{" "}
                  {section.enrollmentStatus &&
                  section.enrollmentStatus.length > 0
                    ? section.enrollmentStatus
                    : "Not available"}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {section.startDate && section.startDate.length > 0
                    ? section.startDate
                    : "Not available"}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {section.endDate && section.endDate.length > 0
                    ? section.endDate
                    : "Not available"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center col-span-2">
              No sections available for this class.
            </p>
          )}
        </div>
      </div>

      {/* Professor Information Popup */}
      {professorInfo && (
        <Dialog
          open={selectedProfessor !== null}
          onOpenChange={() => setSelectedProfessor(null)}
        >
          <DialogContent>
            <DialogTitle>
              Professor{" "}
              {professorInfo.personal_info.first_name +
                " " +
                professorInfo.personal_info.last_name}
            </DialogTitle>
            <DialogDescription>
              <p>
                <strong>Department:</strong>{" "}
                {professorInfo.personal_info.department}
              </p>
              <p>
                <strong>Average Rating:</strong>{" "}
                {professorInfo.ratings.average_rating}
              </p>
              <p>
                <strong>Average Difficulty:</strong>{" "}
                {professorInfo.ratings.average_difficulty}
              </p>
              <p>
                <strong>Number of Ratings:</strong>{" "}
                {professorInfo.ratings.number_of_ratings}
              </p>
              <p>
                <strong>Would Take Again:</strong>{" "}
                {professorInfo.ratings.would_take_again_percent}%
              </p>
              <h4 className="mt-4 font-semibold">Recent Ratings:</h4>
              {professorInfo.recent_ratings.map(
                /* eslint-disable @typescript-eslint/no-explicit-any */
                (rating: any, index: number) => (
                  <div key={index} className="mb-2">
                    <p>
                      <strong>Class:</strong> {rating.class}
                    </p>
                    <p>
                      <strong>Comment:</strong> {rating.comment}
                    </p>
                  </div>
                )
              )}
            </DialogDescription>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const CourseDets = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CourseDetails />
    </Suspense>
  );
};

export default CourseDets;

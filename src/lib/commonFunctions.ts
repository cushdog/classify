/*
class data format:
0: class year
1: semester of class ("fall", "spring", "summer")
2: class subject
3: class number
4: class title
5: class description
6: class credit hours
7: class section code (e.g. "ADA")
8: part of term i think?
9: null
10: null
11: null
12: enrollment status of that section
13: start date
14: end date
15: meeting type (e.g. "Discussion/Recitation")
16: section start time
17: section end time
18: section days
19: section room number
20: section building
21: instructor
22: gpa
23: metadata (info from the ACTUAL uiuc course api)
24: degree requirement
*/

export interface Course {
  year: number;
  term: string;
  subject: string;
  courseNumber: string;
  title: string;
  description: string;
  creditHours: string;
  section: string;
  sectionType: string | null;
  meetingDays: string | null;
  startDate: string | null;
  endDate: string | null;
  classType: string;
  startTime: string | null;
  endTime: string | null;
  days: string | null;
  room: string | null;
  building: string | null;
  instructor: string;
  gpa: number;
  metadata: string;
  degreeRequirement: string | null;
};

export interface CourseInfo {
  year: number;
  term: string;
  subject: string;
  courseNumber: string;
  title: string;
  description: string;
  creditHours: string;
  startDate: string;
  endDate: string;
  gpa: number;
  metadata: string;
  degreeRequirement: string;
};

export interface Section {
  startDate: string | null;
  endDate: string | null;
  enrollmentStatus: string;
  partOfTerm: string | null;
  sectionCode: string;
  sectionType: string | null;
  meetingDays: string | null;
  startTime: string | null;
  endTime: string | null;
  days: string | null;
  room: string | null;
  building: string | null;
  instructor: string;
};

export const semesterConfigs = [
  { semester: "Fall", year: "2024" },
  { semester: "Spring", year: "2024" },
  { semester: "Fall", year: "2023" },
  { semester: "Spring", year: "2023" },
  { semester: "Fall", year: "2022" },
];

export const termOptions = semesterConfigs.map((config) => ({
  value: `${config.semester} ${config.year}`,
  label: `${config.semester} ${config.year}`,
}));

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  // Extract individual components from the date
  const day = date.getUTCDate();
  const month = date.getUTCMonth() + 1; // Months are zero-indexed
  const year = date.getUTCFullYear().toString(); // Last two digits of the year

  // Return formatted date string
  return `${month}-${day}-${year}`;
};

export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const fetchData = async (url: string) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};



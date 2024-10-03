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
  const year = date.getUTCFullYear().toString().slice(-2); // Last two digits of the year
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  // Convert to 12-hour format
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12 || 12; // Convert 0 hour to 12

  // Return formatted date string
  return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}${ampm}`;
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



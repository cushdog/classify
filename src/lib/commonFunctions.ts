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
  metadata: {
    id: string;
    parents: {
      calendarYear: string;
      term: string;
      subject: string;
    };
    label: string;
    description: string;
    creditHours: string;
    sections: string[];
  };
  otherField: string | null;
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



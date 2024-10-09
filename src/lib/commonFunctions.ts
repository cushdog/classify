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

export const genEdMap: { [key: string]: string } = {
  SBS_SOC:
    "Social & Beh Sci - Soc Sci, and Cultural Studies - US Minority course",
  CS_US: "Cultural Studies - US Minority course",
  HUM_HIST_CS_US:
    "Humanities - Hist & Phil, and Cultural Studies - US Minority course",
  HUM_LIT_CS_US:
    "Humanities - Lit & Arts, and Cultural Studies - US Minority course",
  ACP_CS_US:
    "Advanced Composition, and Cultural Studies - US Minority course",
  CS_NONWEST_SBS_SOC:
    "Cultural Studies - Non-West, and Social & Beh Sci - Soc Sci course",
  QR1: "Quantitative Reasoning I course",
  HUM_HIST: "Humanities - Hist & Phil course",
  ACP_HUM_HIST_CS_US:
    "Advanced Composition, Humanities - Hist & Phil, and Cultural Studies - US Minority course",
  HUM_HIST_CS_NONWEST:
    "Humanities - Hist & Phil, and Cultural Studies - Non-West course",
  JS: "James Scholars course",
  CS_WEST: "Cultural Studies - Western course",
  SBS_SOC_CS_WEST:
    "Social & Beh Sci - Soc Sci, and Cultural Studies - Western course",
  HUM_HIST_CS_WEST:
    "Humanities - Hist & Phil, and Cultural Studies - Western course",
  CS_NONWEST: "Cultural Studies - Non-West course",
  HUM_LIT: "Humanities - Lit & Arts course",
  CH_HUM_HIST: "Camp Honors/Chanc Schol, and Humanities - Hist & Phil course",
  HUM_LIT_CS_WEST:
    "Humanities - Lit & Arts, and Cultural Studies - Western course",
  HUM_LIT_CS_NONWEST:
    "Humanities - Lit & Arts, and Cultural Studies - Non-West course",
  CH_NAT_PHYS:
    "Camp Honors/Chanc Schol, and Nat Sci & Tech - Phys Sciences course",
  SBS_BEH: "Social & Beh Sci - Beh Sci course",
  COMP_I: "Composition I course",
  NAT_LIFE: "Nat Sci & Tech - Life Sciences course",
  NAT_PHYS: "Nat Sci & Tech - Phys Sciences course",
  NAT_PHYS_QR2:
    "Nat Sci & Tech - Phys Sciences, and Quantitative Reasoning II course",
  NAT_PHYS_CS_WEST:
    "Nat Sci & Tech - Phys Sciences, and Cultural Studies - Western course",
  NAT_SCI_US_MIN:
    "Nat Sci & Tech - Life Sciences, and Cultural Studies - US Minority course",
};

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
}

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
}

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
}

export const semesterConfigs = [
  { semester: "Spring", year: "2025" },
  { semester: "Fall", year: "2024" },
  { semester: "Spring", year: "2024" },
  { semester: "Fall", year: "2023" },
  { semester: "Spring", year: "2023" },
  { semester: "Fall", year: "2022" },
];

// Helper to slightly lighten a color
export const lightenColor = (color: string, percent: number) => {
  const num = parseInt(color.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
};

// Randomize background color
export const getRandomBackgroundColor = () => {
  const colors = ["#FF5F05", "#13294B"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export function linkifyClasses(text: string, baseUrl: string): string {
  // Regular expression to match the class codes like CS 173 or MATH 213
  const classRegex = /\b([A-Z]{2,4})\s(\d{3})\b/g;

  // Replace matched class codes with a link
  return text.replace(classRegex, (match, subject, number) => {
    const classCode = `${subject} ${number}`;
    const most_recent_term = `${semesterConfigs[0].semester.toLowerCase()} ${
      semesterConfigs[0].year
    }`;
    const classUrl = `${baseUrl}?class=${classCode}&term=${most_recent_term}`;
    return `<a style="color: blue; text-decoration: underline; cursor: pointer;" href="${classUrl}">${match}</a>`;
  });
}

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

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const fetchAndGroupSections = async (
  SUBJECT: string,
  COURSE_NUM: string,
  term: string
): Promise<Record<string, any[][]>> => {
  // Extract semester and year from the term parameter
  const [semester, year] = term.split(" ");

  // Construct the URL using the dynamic term values
  const url = `https://uiuc-course-api-production.up.railway.app/sections?query=${SUBJECT}+${COURSE_NUM}+${semester.toLowerCase()}+${year}`;

  try {
    // Fetch data from the API
    const response = await fetch(url);

    // Handle non-OK responses
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    // Parse the JSON response
    const data: any[][] = await response.json(); // Since it's an array of arrays

    console.log("DATA: ", data);

    // Initialize an empty object to store grouped sections
    const groupedSections: Record<string, any[][]> = {};

    // Create a Set to keep track of unique section identifiers
    const seenSections = new Set<string>();

    // Loop through the data and group by the "type", which is at index 15
    data.forEach((section) => {
      const type = section[15]; // Assuming "type" is stored at index 15
      console.log("TYPE: ", type);

      // If the type key doesn't exist, initialize it as an empty array
      if (!groupedSections[type]) {
        groupedSections[type] = [];
      }

      // Create a unique identifier for the section
      // Let's use the section code at index 7 and CRN at index 12
      const sectionCode = section[7]; // Section code
      const crn = section[12];        // CRN or enrollment status
      const uniqueIdentifier = `${sectionCode}-${crn}`;

      // Check if this section has already been added
      if (!seenSections.has(uniqueIdentifier)) {
        seenSections.add(uniqueIdentifier);
        // Push the section into the appropriate group
        groupedSections[type].push(section);
      } else {
        console.log(`Duplicate section found: ${uniqueIdentifier}`);
      }
    });

    console.log("GROUPED SECTIONS: ", groupedSections);

    // Return the grouped sections
    return groupedSections;
  } catch (error) {
    console.error("Failed to fetch or process data:", error);
    throw error;
  }
};



export const fetchSubjectFullName = async (subject: string) => {
  const url = `https://uiuc-course-api-production.up.railway.app/subject-info?subject=${subject}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the response as JSON
    const jsonData = await response.json();

    // Extract and return the "label" field from the JSON
    const subjectFullName = jsonData.label;
    console.log(subjectFullName);
    return subjectFullName;
  } catch (error) {
    console.error("Error fetching subject full name:", error);
    return "";
  }
};

export const fetchClassData = async (
  classQuery: string,
  term: string | undefined,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  setClassData: React.Dispatch<React.SetStateAction<any>>,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  setSectionsByType: React.Dispatch<
    React.SetStateAction<Record<string, any[][]>>
  >,
  /* eslint-disable @typescript-eslint/no-explicit-any */
  fetchAndGroupSections: (
    SUBJECT: string,
    COURSE_NUM: string
  ) => Promise<Record<string, any[][]>>
) => {
  let data = null;

  // If term is provided, attempt to fetch data for the specific term
  if (term) {
    const [semester, year] = term.split(" ");
    const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
      `${classQuery} ${semester.toLowerCase()} ${year}`
    )}`;
    data = await fetchData(url);
    if (data === "Course not found") {
      console.log(
        `Course not found for specified term: ${term}. Searching for most recent offering.`
      );
      data = null;
    }
  }

  // If no data is found for the provided term, fallback to recent offerings
  if (!data) {
    for (const config of semesterConfigs) {
      const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
        `${classQuery} ${config.semester.toLowerCase()} ${config.year}`
      )}`;
      data = await fetchData(url);
      if (data && data !== "Course not found") break;
    }
  }

  // If valid course data is found, proceed to fetch and group sections
  if (data && data !== "Course not found") {
    setClassData(data); // Set the course data in state
    const subject = data[2]; // Subject is at index 2
    const courseNumber = data[3]; // Course number is at index 3

    // Fetch and group sections by type using the new helper function
    const groupedSections = await fetchAndGroupSections(subject, courseNumber);
    console.log("GROUPED SECTIONS: ", groupedSections);
    setSectionsByType(groupedSections); // Set the grouped sections in state
  } else {
    console.log("Course not found in any recent term");
    setClassData(null);
    setSectionsByType({}); // Reset sections to an empty object
  }
};

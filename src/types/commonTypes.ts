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
  
  export const semesterConfigs = [
    { semester: "Spring", year: "2025" },
    { semester: "Fall", year: "2024" },
    { semester: "Spring", year: "2024" },
    { semester: "Fall", year: "2023" },
    { semester: "Spring", year: "2023" },
    { semester: "Fall", year: "2022" },
  ];

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
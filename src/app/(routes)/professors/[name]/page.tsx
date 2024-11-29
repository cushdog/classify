// app/professors/[name]/page.tsx

import ProfessorProfile from "@/Custom Components/Misc/Professor Profile/page";
import { getProfessorRatingsByName } from "@/db/Supabase Professor Reviews/operations";
import { IProfessor } from "@/db/Supabase Professor Reviews/types";

interface ProfessorPageProps {
  params: {
    name: string;
  };
}

interface ClassTaught {
  class: string;
  professor: string;
  term: string;
}

interface ClassWithInfo extends ClassTaught {
  averageGPA: number | null;
  title: string;
  description: string;
  subject: string;
  courseNumber: string;
  year: number;
  semester: string;
  department: string;
}

interface ProfessorData {
  collegename: string;
  departmentname: string;
  email: string;
  firstname: string;
  lastname: string;
  link: string;
  middlename: string;
  name: string;
  netid: string;
  role: string;
}

export default async function ProfessorPage({ params }: ProfessorPageProps) {
  // Decode and split the name from the URL
  const rawName = params.name;
  const name = decodeURIComponent(rawName);
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.slice(1).join(" ");

  if (!firstName || !lastName) {
    return <div>Invalid professor name in URL.</div>;
  }

  // Fetch professor's ratings from Supabase
  const professorRatings = await getProfessorRatingsByName(firstName, lastName);

  // Fetch classes taught by professors with the matching last name
  const classesTaught = await fetchClassesTaught(lastName);

  // Fetch class info and filter classes based on matching first and last names
  const classesWithInfoOrNull: (ClassWithInfo | null)[] = await Promise.all(
    classesTaught.map(async (course): Promise<ClassWithInfo | null> => {
      const classInfo = await fetchClassInfo(course.class, course.term);

      const professorNames = course.professor
        .split(",")
        .map((prof) => prof.trim());

      let classIncludesProfessor = false;

      for (const profName of professorNames) {
        // Extract last name from the professor's name
        const profNameParts = profName.split(" ");
        const profLastName = profNameParts[profNameParts.length - 1];

        // Fetch professor data using department and last name
        const professorsDataFromAPI = await fetchProfessorData(
          classInfo.department,
          profLastName
        );

        if (professorsDataFromAPI && professorsDataFromAPI.length > 0) {
          // Compare first and last names
          for (const professorData of professorsDataFromAPI) {
            if (
              professorData.firstname.toLowerCase() === firstName.toLowerCase() &&
              professorData.lastname.toLowerCase() === lastName.toLowerCase()
            ) {
              classIncludesProfessor = true;
              break;
            }
          }
        }

        if (classIncludesProfessor) {
          break;
        }
      }

      if (!classIncludesProfessor) {
        return null; // Exclude class if professor doesn't match
      }

      const averageGPA = await fetchAverageGPA(course.class, firstName, lastName);

      return {
        ...course,
        averageGPA,
        title: classInfo.title,
        description: classInfo.description,
        subject: classInfo.subject,
        courseNumber: classInfo.courseNumber,
        year: classInfo.year,
        semester: classInfo.semester,
        department: classInfo.department,
      };
    })
  );

  // Filter out null values (classes not taught by the professor)
  const classesWithInfo: ClassWithInfo[] = classesWithInfoOrNull.filter(
    (classInfo): classInfo is ClassWithInfo => classInfo !== null
  );

  // Fetch professor data for display on the profile page
  let professorDataFromAPI: ProfessorData | null = null;

  if (classesWithInfo.length > 0) {
    const anyClass = classesWithInfo[0];
    const professorsDataFromAPI = await fetchProfessorData(
      anyClass.department,
      lastName
    );

    if (professorsDataFromAPI && professorsDataFromAPI.length > 0) {
      professorDataFromAPI =
        professorsDataFromAPI.find(
          (professorData) =>
            professorData.firstname.toLowerCase() === firstName.toLowerCase() &&
            professorData.lastname.toLowerCase() === lastName.toLowerCase()
        ) || null;
    }
  } else {
    // Attempt to fetch professor data without specifying a department
    const professorsDataFromAPI = await fetchProfessorData("", lastName);

    if (professorsDataFromAPI && professorsDataFromAPI.length > 0) {
      professorDataFromAPI =
        professorsDataFromAPI.find(
          (professorData) =>
            professorData.firstname.toLowerCase() === firstName.toLowerCase() &&
            professorData.lastname.toLowerCase() === lastName.toLowerCase()
        ) || null;
    }
  }

  // Construct the professor data for the profile page
  const professorData: IProfessor = {
    id: professorRatings ? professorRatings.id : 0,
    createdAt: professorRatings ? professorRatings.createdAt : "",
    firstName: professorDataFromAPI
      ? professorDataFromAPI.firstname
      : firstName,
    lastName: professorDataFromAPI ? professorDataFromAPI.lastname : lastName,
    email: professorDataFromAPI ? professorDataFromAPI.email : undefined,
    department: professorDataFromAPI
      ? professorDataFromAPI.departmentname
      : undefined,
    preparednessPercentage: professorRatings
      ? professorRatings.preparednessPercentage
      : 0,
    clarityPercentage: professorRatings
      ? professorRatings.clarityPercentage
      : 0,
    respectPercentage: professorRatings
      ? professorRatings.respectPercentage
      : 0,
  };

  // Render the ProfessorProfile component with the fetched data
  return (
    <ProfessorProfile
      professorData={professorData}
      classes={classesWithInfo}
    />
  );
}

async function fetchProfessorData(
  department: string,
  lastName: string
): Promise<ProfessorData[] | null> {
  let url = `https://uiuc-course-api-production.up.railway.app/name-search?last_name=${encodeURIComponent(
    lastName
  )}`;
  if (department) {
    url += `&department=${encodeURIComponent(department)}`;
  }

  const response = await fetch(url, { cache: "no-store" });
  const data = await response.json();

  if (Array.isArray(data) && data.length > 0) {
    return data;
  } else if (data.message === "No matching professors found.") {
    return null;
  } else {
    console.error("Unexpected data format:", data);
    return null;
  }
}

async function fetchClassesTaught(lastName: string): Promise<ClassTaught[]> {
  const currentYear = new Date().getFullYear();
  const semesters = ["Fall", "Spring"];
  const classes: ClassTaught[] = [];

  for (let year = currentYear; year >= currentYear - 4; year--) {
    for (const semester of semesters) {
      const query = `${lastName} ${semester.toLowerCase()} ${year}`;
      const url = `https://uiuc-course-api-production.up.railway.app/prof-search?query=${encodeURIComponent(
        query
      )}`;

      const response = await fetch(url, { cache: "no-store" });
      const data: any[] = await response.json();

      data.forEach((item) => {
        const professors = item[21]; // Professor(s) field
        // Include the class if any professor's last name matches
        if (professorLastNameMatches(professors, lastName)) {
          classes.push({
            class: `${item[2]} ${item[3]}`,
            professor: professors,
            term: `${semester} ${year}`,
          });
        }
      });
    }
  }

  // Remove duplicates
  const uniqueClasses = Array.from(
    new Set(classes.map((c) => `${c.class}-${c.term}`))
  ).map((uniqueKey) =>
    classes.find(
      (c) => `${c.class}-${c.term}` === uniqueKey
    )!
  );

  return uniqueClasses;
}

function professorLastNameMatches(
  professors: string,
  lastName: string
): boolean {
  const professorList = professors.split(",").map((prof) => prof.trim());

  return professorList.some((professor) => {
    const nameParts = professor.split(" ").map((part) => part.trim());
    const profLastName = nameParts[nameParts.length - 1];

    return profLastName.toLowerCase() === lastName.toLowerCase();
  });
}

async function fetchAverageGPA(
  className: string,
  firstName: string,
  lastName: string
): Promise<number | null> {
  const response = await fetch(
    `https://uiuc-course-api-production.up.railway.app/professor-stats?class=${encodeURIComponent(
      className
    )}`,
    { cache: "no-store" }
  );
  const data: any[] = await response.json();

  const professorData = data.find((d) =>
    d.professor
      .toLowerCase()
      .includes(`${firstName.toLowerCase()} ${lastName.toLowerCase()}`)
  );

  return professorData ? professorData.average_gpa : null;
}

interface ClassInfo {
  title: string;
  description: string;
  subject: string;
  courseNumber: string;
  year: number;
  semester: string;
  department: string;
}

async function fetchClassInfo(
  className: string,
  term: string
): Promise<ClassInfo> {
  const [subject, courseNumber] = className.split(" ");
  const [semester, yearStr] = term.split(" ");
  const year = parseInt(yearStr);

  const url = `https://uiuc-course-api-production.up.railway.app/search?query=${encodeURIComponent(
    `${subject} ${courseNumber} ${semester.toLowerCase()} ${year}`
  )}`;
  const response = await fetch(url, { cache: "no-store" });

  const data: any[] = await response.json();

  let title = "No title available.";
  let description = "No description available.";
  let department = "Unknown Department";

  if (data && data.length > 0) {
    title = data[4];
    description = data[5];
    department = data[27] || "Unknown Department";
  }

  return {
    title,
    description,
    subject,
    courseNumber,
    year,
    semester,
    department,
  };
}

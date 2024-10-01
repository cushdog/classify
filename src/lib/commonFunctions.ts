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



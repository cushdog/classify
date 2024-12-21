"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Box, Typography } from "@mui/material";
import { useMediaQuery } from "@mui/system";
import { insertClassReview } from "@/db/Supabase Reviews/operations";
import { insertProfessor } from "@/db/Supabase Professor Reviews/operations";
import { IClassReviewInsert } from "@/db/Supabase Reviews/types";
import { IProfessorInsert } from "@/db/Supabase Professor Reviews/types";
import { ToastLib } from "@/lib/toast";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandGroup,
  CommandEmpty,
} from "@/components/ui/command";

const { notifySuccess, notifyError } = ToastLib;

// Department list remains the same
const departments = [
  "Aerospace Engineering, Department of",
  "African American Studies, Department of",
  "Agricultural Communications Program",
  "Agricultural Leadership Education and Communication Program",
  "Agricultural and Biological Engineering, Department of",
  "American Indian Studies Program",
  "Animal Sciences, Department of",
  "Anthropology, Department of",
  "Architecture, School of",
  "Art and Design, School of",
  "Asian American Studies, Department of",
  "Astronomy, Department of",
  "Biochemistry, Department of",
  "Bioengineering, Department of",
  "Business Administration, Department of",
  "Cell and Developmental Biology, Department of",
  "Chemical and Biomolecular Engineering, Department of",
  "Chemistry, Department of",
  "Civil and Environmental Engineering, Department of",
  "Classics, Department of the",
  "Climate, Meteorology and Atmospheric Sciences, Department of",
  "Communication, Department of",
  "Comparative and World Literature",
  "Crop Sciences, Department of",
  "Dance, Department of",
  "Earth Science and Environmental Change",
  "Earth, Society and Environment, School of",
  "East Asian Languages and Cultures, Department of",
  "Economics, Department of",
  "Electrical and Computer Engineering, Department of",
  "English, Department of",
  "Entomology, Department of",
  "Evolution, Ecology, and Behavior, Department of",
  "Food Science and Human Nutrition, Department of",
  "French & Italian, Department of",
  "Gender and Women's Studies, Department of",
  "Geography & Geographic Information Science, Department of",
  "Germanic Languages and Literatures, Department of",
  "Health and Kinesiology, Department of",
  "History, Department of",
  "Human Development & Family Studies, Department of",
  "Industrial and Enterprise Systems Engineering, Department of",
  "Information Sciences, School of",
  "Integrative Biology, School of",
  "Interdisciplinary Health Sciences (i-Health)",
  "Labor and Employment Relations, School of",
  "Landscape Architecture, Department of",
  "Latina/Latino Studies, Department of",
  "Library Administration, University of Illinois",
  "Linguistics, Department of",
  "Literatures, Cultures and Linguistics, School of",
  "Materials Science and Engineering, Department of",
  "Mathematics, Department of",
  "Mechanical Science and Engineering, Department of",
  "Media, College of",
  "Microbiology, Department of",
  "Molecular and Integrative Physiology, Department of",
  "Music, School of",
  "Natural Resources and Environmental Sciences, Department of",
  "Philosophy, Department of",
  "Physics, Department of",
  "Plant Biology, Department of",
  "Political Science, Department of",
  "Psychology, Department of",
  "Religion, Department of",
  "Siebel School of Computing and Data Science",
  "Slavic Languages and Literatures, Department of",
  "Social Work, School of",
  "Sociology, Department of",
  "Spanish and Portuguese, Department of",
  "Speech and Hearing Science, Department of",
  "Statistics, Department of",
  "Theatre, Department of",
  "Urban and Regional Planning, Department of",
  "Veterinary Medicine, College of",
];

interface ReviewSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number[]) => void;
}

const ReviewSlider: React.FC<ReviewSliderProps> = ({
  label,
  description,
  value,
  onChange,
}) => {
  const getPercentageDescription = (percentage: number) => {
    if (percentage < 20) return "Very Low";
    if (percentage < 40) return "Low";
    if (percentage < 60) return "Moderate";
    if (percentage < 80) return "High";
    return "Very High";
  };

  return (
    <div className="space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300">
      <div className="flex justify-between items-center">
        <div>
          <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
            {label}
          </Label>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {description}
          </p>
        </div>
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {value}% - {getPercentageDescription(value)}
        </span>
      </div>
      <Slider
        defaultValue={[value]}
        max={100}
        step={1}
        onValueChange={onChange}
        className="mt-2"
      />
    </div>
  );
};

const ReviewPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Extract query params for BOTH professor and course
  const queryFirstName = searchParams.get("firstName") || "";
  const queryLastName = searchParams.get("lastName") || "";
  const queryDepartment = searchParams.get("department") || "";

  // New: For course
  const querySubject = searchParams.get("subject") || "";
  const queryCourseNumber = searchParams.get("courseNumber") || "";

  // Decide initial form type based on search params
  // If we have a subject & courseNumber, assume it's a course review.
  // If we have firstName & lastName, assume it's a professor review.
  // Otherwise default to course if neither are present.
  const initialFormType =
    querySubject && queryCourseNumber
      ? "course"
      : queryFirstName && queryLastName
      ? "professor"
      : "course";

  const [formType, setFormType] = useState<"course" | "professor">(
    initialFormType
  );

  // Set initial course form data from URL (if present)
  const [courseFormData, setCourseFormData] = useState<IClassReviewInsert>({
    subject: querySubject,
    courseNumber: queryCourseNumber,
    desireToTakePercentage: 50,
    understandingPercentage: 50,
    workloadPercentage: 50,
    expectationsPercentage: 50,
    increasedInterestPercentage: 50,
  });

  // Set initial professor form data from URL (if present)
  const [professorFormData, setProfessorFormData] = useState<IProfessorInsert>({
    firstName: queryFirstName,
    lastName: queryLastName,
    department: queryDepartment,
    preparednessPercentage: 50,
    clarityPercentage: 50,
    respectPercentage: 50,
  });

  // Theme/Mode effect
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setIsDarkMode(storedTheme === "dark");
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const handleSliderChange =
    (
      field: keyof IClassReviewInsert | keyof IProfessorInsert,
      isCourse: boolean
    ) =>
    (value: number[]) => {
      if (isCourse) {
        setCourseFormData((prev) => ({ ...prev, [field]: value[0] }));
      } else {
        setProfessorFormData((prev) => ({ ...prev, [field]: value[0] }));
      }
    };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isCourse: boolean
  ) => {
    const { name, value } = e.target;
    if (isCourse) {
      setCourseFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setProfessorFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectDepartment = (dep: string) => {
    setProfessorFormData((prev) => ({ ...prev, department: dep }));
  };

  // Filter department list
  const filteredDepartments = useMemo(() => {
    const query = (professorFormData.department ?? "").toLowerCase().trim();
    if (query === "") {
      return departments;
    }
    return departments.filter((dep) => dep.toLowerCase().includes(query));
  }, [professorFormData.department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formType === "course") {
        if (!courseFormData.subject || !courseFormData.courseNumber) {
          notifyError("Please fill in the subject and course number");
          setIsSubmitting(false);
          return;
        }

        const result = await insertClassReview(courseFormData);
        if (result) {
          notifySuccess("Course review submitted successfully!");
          setCourseFormData({
            subject: "",
            courseNumber: "",
            desireToTakePercentage: 50,
            understandingPercentage: 50,
            workloadPercentage: 50,
            expectationsPercentage: 50,
            increasedInterestPercentage: 50,
          });
          router.push("/");
        } else {
          notifyError("Failed to submit course review");
        }
      } else {
        if (!professorFormData.firstName || !professorFormData.lastName) {
          notifyError("Please fill in the professor's first and last name");
          setIsSubmitting(false);
          return;
        }

        const result = await insertProfessor(professorFormData);
        if (result) {
          notifySuccess("Professor review submitted successfully!");
          setProfessorFormData({
            firstName: "",
            lastName: "",
            department: "",
            preparednessPercentage: 50,
            clarityPercentage: 50,
            respectPercentage: 50,
          });
          router.push("/");
        } else {
          notifyError("Failed to submit professor review");
        }
      }
    } catch (error) {
      notifyError("An error occurred while submitting the review");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Title to show at top
  const searchQuery =
    formType === "professor"
      ? professorFormData.lastName || "Professor"
      : "Course";

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Box
        sx={{
          width: "100%",
          minHeight: isMobile ? "14em" : "200px",
          backgroundColor: isDarkMode ? "#1E3A8A" : "#3B82F6",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
          color: "#fff",
        }}
        className="transition-colors duration-300"
      >
        {/* Dark Mode Toggle Button */}
        <div className="flex justify-end"></div>

        {/* Back Button */}
        <IconButton
          onClick={() => router.back()}
          aria-label="Go back"
          sx={{
            color: "#fff",
            position: "absolute",
            top: 20,
            left: 20,
            display: { xs: "none", md: "inline-flex" },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* Title */}
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Submit a {searchQuery} Review
        </Typography>
      </Box>

      <main className="container mx-auto px-4 py-8">
        <Card className="bg-white dark:bg-gray-800 shadow-lg border-none transition-colors duration-300">
          <CardContent className="p-8">
            <div className="flex justify-center space-x-4 mb-6">
              <Button
                onClick={() => setFormType("course")}
                variant={formType === "course" ? "default" : "ghost"}
                className={
                  formType === "course" ? "bg-blue-600 text-white" : ""
                }
              >
                Course Review
              </Button>
              <Button
                onClick={() => setFormType("professor")}
                variant={formType === "professor" ? "default" : "ghost"}
                className={
                  formType === "professor" ? "bg-blue-600 text-white" : ""
                }
              >
                Professor Review
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {formType === "course" ? (
                <>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Subject Code (e.g. CSCI)"
                    value={courseFormData.subject}
                    onChange={(e) => handleInputChange(e, true)}
                    className="bg-white dark:bg-gray-700"
                    required
                  />
                  <Input
                    id="courseNumber"
                    name="courseNumber"
                    placeholder="Course Number (e.g. 101)"
                    value={courseFormData.courseNumber}
                    onChange={(e) => handleInputChange(e, true)}
                    className="bg-white dark:bg-gray-700"
                    required
                  />
                  <ReviewSlider
                    label="Desire to Take Again"
                    description="Would you recommend this course to other students?"
                    value={courseFormData.desireToTakePercentage}
                    onChange={handleSliderChange(
                      "desireToTakePercentage",
                      true
                    )}
                  />
                  <ReviewSlider
                    label="Understanding of Material"
                    description="How well did you grasp the course content?"
                    value={courseFormData.understandingPercentage}
                    onChange={handleSliderChange(
                      "understandingPercentage",
                      true
                    )}
                  />
                  <ReviewSlider
                    label="Workload"
                    description="Assess the time and effort required for this course"
                    value={courseFormData.workloadPercentage}
                    onChange={handleSliderChange("workloadPercentage", true)}
                  />
                  <ReviewSlider
                    label="Met Expectations"
                    description="Did the course align with what you expected?"
                    value={courseFormData.expectationsPercentage}
                    onChange={handleSliderChange(
                      "expectationsPercentage",
                      true
                    )}
                  />
                  <ReviewSlider
                    label="Increased Interest in Subject"
                    description="Did this course spark more curiosity about the topic?"
                    value={courseFormData.increasedInterestPercentage}
                    onChange={handleSliderChange(
                      "increasedInterestPercentage",
                      true
                    )}
                  />
                </>
              ) : (
                <>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder="Professor First Name"
                    value={professorFormData.firstName}
                    onChange={(e) => handleInputChange(e, false)}
                    className="bg-white dark:bg-gray-700"
                    required
                  />
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder="Professor Last Name"
                    value={professorFormData.lastName}
                    onChange={(e) => handleInputChange(e, false)}
                    className="bg-white dark:bg-gray-700"
                    required
                  />

                  <div>
                    <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Department
                    </Label>
                    <Command className="bg-white dark:bg-gray-700 rounded-md border border-gray-300 dark:border-gray-600 mt-2">
                      <CommandInput
                        placeholder="Start typing to search..."
                        value={professorFormData.department ?? ""}
                        onValueChange={(val) =>
                          setProfessorFormData((prev) => ({
                            ...prev,
                            department: val,
                          }))
                        }
                      />
                      <CommandList>
                        {filteredDepartments.length > 0 ? (
                          <CommandGroup heading="Departments">
                            {filteredDepartments.map((dep) => (
                              <CommandItem
                                key={dep}
                                onSelect={() => handleSelectDepartment(dep)}
                              >
                                {dep}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        ) : (
                          <CommandEmpty>No results found.</CommandEmpty>
                        )}
                      </CommandList>
                    </Command>
                  </div>

                  <ReviewSlider
                    label="Preparedness"
                    description="How prepared was the professor for lectures?"
                    value={professorFormData.preparednessPercentage}
                    onChange={handleSliderChange(
                      "preparednessPercentage",
                      false
                    )}
                  />
                  <ReviewSlider
                    label="Respect"
                    description="How much respect did the professor show to students?"
                    value={professorFormData.respectPercentage}
                    onChange={handleSliderChange("respectPercentage", false)}
                  />
                  <ReviewSlider
                    label="Clarity"
                    description="How clear were the professor's explanations?"
                    value={professorFormData.clarityPercentage}
                    onChange={handleSliderChange("clarityPercentage", false)}
                  />
                </>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-300"
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const Reviews = () => {
  return (
    <Suspense
      fallback={
        <div className="text-center text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      }
    >
      <ReviewPage />
    </Suspense>
  );
};

export default Reviews;

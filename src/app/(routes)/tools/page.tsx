'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calculator, ListChecks, Edit, BookOpen, CheckSquare, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface GradeItem {
  name: string;
  weight: number; // percentage of total grade
  grade: number;  // earned percentage
}

const StudentToolsPage = () => {
  const router = useRouter();

  // GPA Quick Calculator
  const [gpaCourses, setGpaCourses] = useState<{ name: string; grade: string }[]>([
    { name: "Course 1", grade: "A" },
    { name: "Course 2", grade: "B+" },
  ]);
  const [gpaResult, setGpaResult] = useState<number | null>(null);

  // Notes
  const [notes, setNotes] = useState<string>('');
  const [savedNotes, setSavedNotes] = useState<string>('');

  // Assignments Todo
  const [assignments, setAssignments] = useState<string[]>([]);
  const [newAssignment, setNewAssignment] = useState<string>('');

  // Final Grade Calculator (multiple components)
  const [gradeItems, setGradeItems] = useState<GradeItem[]>([]);
  const [calcError, setCalcError] = useState<string>('');

  // Needed score on final
  const [currentGrade, setCurrentGrade] = useState<number>(87);
  const [finalWeight, setFinalWeight] = useState<number>(25);
  const [desiredFinalGrade, setDesiredFinalGrade] = useState<number>(95);
  const [neededOnFinal, setNeededOnFinal] = useState<number | null>(null);
  const [neededError, setNeededError] = useState<string>('');

  // GPA Calculation Helper
  const gradeToPoint = (grade: string) => {
    const map: Record<string, number> = {
      "A+": 4.0,
      "A": 4.0,
      "A-": 3.7,
      "B+": 3.3,
      "B": 3.0,
      "B-": 2.7,
      "C+": 2.3,
      "C": 2.0,
      "C-": 1.7,
      "D+": 1.3,
      "D": 1.0,
      "F": 0.0,
    };
    return map[grade.toUpperCase()] ?? 0.0;
  };

  const handleCalculateGPA = () => {
    if (gpaCourses.length === 0) return;
    const points = gpaCourses.reduce((acc, c) => acc + gradeToPoint(c.grade), 0);
    const average = points / gpaCourses.length;
    setGpaResult(average);
  };

  const handleAddCourseForGPA = () => {
    setGpaCourses(prev => [...prev, { name: `Course ${prev.length + 1}`, grade: "A" }]);
  };

  const handleSaveNotes = () => {
    setSavedNotes(notes);
  };

  const handleAddAssignment = () => {
    if (newAssignment.trim()) {
      setAssignments(prev => [...prev, newAssignment.trim()]);
      setNewAssignment('');
    }
  };

  const handleRemoveAssignment = (index: number) => {
    setAssignments(prev => prev.filter((_, i) => i !== index));
  };

  // Final Grade Calculation
  const handleAddGradeItem = () => {
    setGradeItems(prev => [...prev, { name: "", weight: 0, grade: 0 }]);
  };

  const handleRemoveGradeItem = (index: number) => {
    setGradeItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleGradeItemChange = (index: number, field: keyof GradeItem, value: string) => {
    const val = field === 'weight' || field === 'grade' ? parseFloat(value) : value;
    setGradeItems(prev =>
      prev.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    );
  };

  const calculateFinalGrade = () => {
    let totalWeight = 0;
    let weightedSum = 0;
    for (const item of gradeItems) {
      if (!item.name || item.weight === 0 || item.grade === 0) {
        setCalcError("Please fill out all fields and ensure weights/grades are > 0.");
        return;
      }
      totalWeight += item.weight;
      weightedSum += (item.grade * item.weight) / 100;
    }
    if (totalWeight !== 100) {
      setCalcError("Total weight must equal 100%.");
      return;
    }
    setCalcError("");
    alert(`Your estimated final grade: ${weightedSum.toFixed(2)}%`);
  };

  // Needed on Final
  const calculateNeededScore = () => {
    if (finalWeight <= 0 || finalWeight >= 100) {
      setNeededError("Final weight should be between 0 and 100%");
      return;
    }
    if (desiredFinalGrade <= 0 || desiredFinalGrade > 100 || currentGrade < 0 || currentGrade > 100) {
      setNeededError("Check your inputs. Grades should be between 0 and 100.");
      return;
    }

    setNeededError("");
    const fw = finalWeight / 100;
    const cw = 1 - fw;
    const needed = (desiredFinalGrade - (currentGrade * cw)) / fw;
    setNeededOnFinal(needed);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-700 p-6 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors duration-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-200"/>
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Student Toolkit</h1>
          <p className="text-slate-700 dark:text-white">
            Everything you need to excel this semester. Plan, calculate, and stay organized.
          </p>
        </div>

        {/* GPA Quick Calculator */}
        <Card className="bg-white dark:bg-black p-6 space-y-4 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2 dark:text-white">
              <Calculator className="w-5 h-5" />
              Quick GPA Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gpaCourses.map((course, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) =>
                    setGpaCourses(prev => prev.map((c, i) =>
                      i === index ? { ...c, name: e.target.value } : c
                    ))
                  }
                  className="flex-1 px-3 py-2 rounded bg-slate-200 dark:bg-slate-600 dark:text-white"
                  placeholder="Course Name"
                />
                <input
                  type="text"
                  value={course.grade}
                  onChange={(e) =>
                    setGpaCourses(prev => prev.map((c, i) =>
                      i === index ? { ...c, grade: e.target.value } : c
                    ))
                  }
                  className="px-3 py-2 rounded bg-slate-200 dark:bg-slate-600 dark:text-white"
                  placeholder="Grade (e.g. A, B+)"
                />
              </div>
            ))}
            <div className="flex gap-2">
              <Button variant="default" onClick={handleCalculateGPA} className="dark:text-white dark:bg-slate-800 hover:dark:bg-slate-700">
                Calculate GPA
              </Button>
              <Button variant="secondary" onClick={handleAddCourseForGPA} className="dark:text-white dark:bg-slate-700 hover:dark:bg-slate-600">
                Add Another Course
              </Button>
            </div>
            {gpaResult !== null && (
              <div className="dark:text-white">
                Estimated GPA: {gpaResult.toFixed(2)}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notes */}
        <Card className="bg-white dark:bg-black p-6 space-y-4 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2 dark:text-white">
              <Edit className="w-5 h-5"/>
              Quick Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Your Notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="dark:text-white dark:bg-slate-800"
            />
            <Button variant="default" onClick={handleSaveNotes} className="dark:text-white dark:bg-slate-800 hover:dark:bg-slate-700">
              Save Notes
            </Button>
            {savedNotes && (
              <div className="dark:text-white bg-slate-100 dark:bg-slate-800 p-4 rounded">
                <p className="font-semibold">Last Saved Notes:</p>
                <p>{savedNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignments Todo List */}
        <Card className="bg-white dark:bg-black p-6 space-y-4 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2 dark:text-white">
              <ListChecks className="w-5 h-5" />
              Assignments To-Do
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a new assignment..."
                value={newAssignment}
                onChange={(e) => setNewAssignment(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-slate-200 dark:bg-slate-600 dark:text-white"
              />
              <Button variant="default" onClick={handleAddAssignment} className="dark:text-white dark:bg-slate-800 hover:dark:bg-slate-700">
                <Plus className="w-4 h-4 mr-2"/>
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {assignments.map((assn, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2 rounded"
                >
                  <span className="dark:text-white">{assn}</span>
                  <button
                    onClick={() => handleRemoveAssignment(index)}
                    className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4"/>
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Final Grade Calculator */}
        <Card className="bg-white dark:bg-black p-6 space-y-4 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2 dark:text-white">
              <CheckSquare className="w-5 h-5"/>
              Final Grade Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="dark:text-white">
              Enter each graded component with its weight (%) and your earned grade (%).
              Total weight must sum to 100%.
            </p>
            {gradeItems.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => handleGradeItemChange(index, 'name', e.target.value)}
                  placeholder="Component Name"
                  className="flex-1 px-3 py-2 rounded bg-slate-200 dark:bg-slate-600 dark:text-white"
                />
                <input
                  type="number"
                  value={item.weight}
                  onChange={(e) => handleGradeItemChange(index, 'weight', e.target.value)}
                  placeholder="Weight (%)"
                  className="w-20 px-3 py-2 rounded bg-slate-200 dark:bg-slate-600 dark:text-white"
                />
                <input
                  type="number"
                  value={item.grade}
                  onChange={(e) => handleGradeItemChange(index, 'grade', e.target.value)}
                  placeholder="Grade (%)"
                  className="w-20 px-3 py-2 rounded bg-slate-200 dark:bg-slate-600 dark:text-white"
                />
                <button
                  onClick={() => handleRemoveGradeItem(index)}
                  className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4"/>
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleAddGradeItem} className="dark:text-white dark:bg-slate-700 hover:dark:bg-slate-600">
                Add Component
              </Button>
              <Button variant="default" onClick={calculateFinalGrade} className="dark:text-white dark:bg-slate-800 hover:dark:bg-slate-700">
                Calculate Final Grade
              </Button>
            </div>
            {calcError && (
              <p className="text-red-500">{calcError}</p>
            )}
          </CardContent>
        </Card>

        {/* Needed On Final Calculator */}
        <Card className="bg-white dark:bg-black p-6 space-y-4 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2 dark:text-white">
              <BookOpen className="w-5 h-5"/>
              Needed Score on Final
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="dark:text-white">
              Enter your current course grade, final exam weight, and desired final course grade.
              We'll tell you what you need on the final.
            </p>
            <div className="space-y-2">
              <input
                type="number"
                value={currentGrade}
                onChange={(e) => setCurrentGrade(parseFloat(e.target.value))}
                placeholder="Current Grade (%)"
                className="w-full px-3 py-2 rounded bg-slate-200 dark:bg-slate-600 dark:text-white"
              />
              <input
                type="number"
                value={finalWeight}
                onChange={(e) => setFinalWeight(parseFloat(e.target.value))}
                placeholder="Final Weight (%)"
                className="w-full px-3 py-2 rounded bg-slate-200 dark:bg-slate-600 dark:text-white"
              />
              <input
                type="number"
                value={desiredFinalGrade}
                onChange={(e) => setDesiredFinalGrade(parseFloat(e.target.value))}
                placeholder="Desired Final Course Grade (%)"
                className="w-full px-3 py-2 rounded bg-slate-200 dark:bg-slate-600 dark:text-white"
              />
            </div>
            <Button variant="default" onClick={calculateNeededScore} className="dark:text-white dark:bg-slate-800 hover:dark:bg-slate-700">
              Calculate Needed Score
            </Button>
            {neededError && (
              <p className="text-red-500">{neededError}</p>
            )}
            {neededOnFinal !== null && !neededError && (
              <p className="dark:text-white">
                You need approximately {neededOnFinal.toFixed(2)}% on the final.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentToolsPage;

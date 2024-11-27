'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from Next.js
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { insertClassReview } from '@/db/Supabase Reviews/operations';
import { IClassReviewInsert } from '@/db/Supabase Reviews/types';
import { Loader2, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Import your custom toast library
import { ToastLib } from '@/lib/toast'; // Adjust the import path accordingly

const { notifySuccess, notifyError } = ToastLib; // Destructure the necessary functions

const FullPageClassReviewForm: React.FC = () => {
  const router = useRouter(); // Initialize the router
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<IClassReviewInsert>({
    subject: '',
    courseNumber: '',
    desireToTakePercentage: 50,
    understandingPercentage: 50,
    workloadPercentage: 50,
    expectationsPercentage: 50,
    increasedInterestPercentage: 50
  });

  const handleSliderChange = (field: keyof IClassReviewInsert) => (value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value[0]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate inputs
      if (!formData.subject || !formData.courseNumber) {
        notifyError('Please fill in subject and course number');
        setIsSubmitting(false);
        return;
      }

      const result = await insertClassReview(formData);

      if (result) {
        notifySuccess('Review submitted successfully! Redirecting to home page...');
        // Reset form
        setFormData({
          subject: '',
          courseNumber: '',
          desireToTakePercentage: 50,
          understandingPercentage: 50,
          workloadPercentage: 50,
          expectationsPercentage: 50,
          increasedInterestPercentage: 50
        });
        // Redirect after a short delay to allow the toast to be visible
        setTimeout(() => {
          router.push('/');
        }, 2000); // 2-second delay
      } else {
        notifyError('Failed to submit review');
      }
    } catch (error) {
      notifyError('An error occurred while submitting the review');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-2xl bg-white dark:bg-gray-800 shadow-lg border-none">
        <CardHeader className="text-center bg-blue-600 dark:bg-blue-700 text-white py-8 rounded-t-lg">
          <CardTitle className="text-3xl font-extrabold mb-2">
            Course Review Submission
          </CardTitle>
          <CardDescription className="text-blue-100">
            Share your insights to help fellow students make informed decisions
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subject Code Field */}
              <div>
                <Label htmlFor="subject" className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="flex-grow">Subject Code</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info 
                          className="ml-2 h-4 w-4 text-muted-foreground cursor-pointer" 
                          aria-label="Tooltip information about Subject Code" 
                        />
                      </TooltipTrigger>
                      <TooltipContent className="bg-gray-800 text-white p-2 rounded-md">
                        Enter the department code (e.g., CSCI for Computer Science)
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="e.g. CSCI"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="mt-2 uppercase bg-gray-50 dark:bg-gray-700 border border-transparent focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
              </div>

              {/* Course Number Field */}
              <div>
                <Label htmlFor="courseNumber" className="flex items-start text-gray-700 dark:text-gray-300">
                  <span className="flex-grow">Course Number</span>
                  {/* Placeholder span to align with the Info icon */}
                  <span className="ml-2 h-4 w-4"></span>
                </Label>
                <Input
                  id="courseNumber"
                  name="courseNumber"
                  placeholder="e.g. 101"
                  value={formData.courseNumber}
                  onChange={handleInputChange}
                  className="mt-2 bg-gray-50 dark:bg-gray-700 border border-transparent focus:ring-blue-500 dark:focus:ring-blue-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-6">
              <ReviewSlider
                label="Desire to Take Again"
                description="Would you recommend this course to other students?"
                value={formData.desireToTakePercentage}
                onChange={handleSliderChange('desireToTakePercentage')}
              />
              <ReviewSlider
                label="Understanding of Material"
                description="How well did you grasp the course content?"
                value={formData.understandingPercentage}
                onChange={handleSliderChange('understandingPercentage')}
              />
              <ReviewSlider
                label="Workload"
                description="Assess the time and effort required for this course"
                value={formData.workloadPercentage}
                onChange={handleSliderChange('workloadPercentage')}
              />
              <ReviewSlider
                label="Met Expectations"
                description="Did the course align with what you expected?"
                value={formData.expectationsPercentage}
                onChange={handleSliderChange('expectationsPercentage')}
              />
              <ReviewSlider
                label="Increased Interest in Subject"
                description="Did this course spark more curiosity about the topic?"
                value={formData.increasedInterestPercentage}
                onChange={handleSliderChange('increasedInterestPercentage')}
              />
            </div>

            <div className="text-center">
              <Button 
                type="submit" 
                size="lg"
                className="w-full max-w-md mx-auto bg-blue-600 dark:bg-blue-700 text-white py-2.5 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting Review...
                  </>
                ) : (
                  'Submit Your Course Review'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// Reusable Slider Component
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
  onChange 
}) => {
  const getPercentageDescription = (percentage: number) => {
    if (percentage < 20) return 'Very Low';
    if (percentage < 40) return 'Low';
    if (percentage < 60) return 'Moderate';
    if (percentage < 80) return 'High';
    return 'Very High';
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div>
          <Label className="text-lg font-semibold text-gray-700 dark:text-gray-300">{label}</Label>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
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

export default FullPageClassReviewForm;

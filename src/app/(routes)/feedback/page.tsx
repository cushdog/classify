"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToastLib } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const GoogleFormPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    feedbackType: "",
    feedback: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      feedbackType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const googleFormURL =
        "https://docs.google.com/forms/d/e/1FAIpQLSczIeiz7eJcUZLWfW-N0hsDw5mCaS8KlHVnrUH0ogL0sQFg1g/formResponse";

    const submissionData = new FormData();
    submissionData.append("entry.966562401", formData.feedbackType);
    submissionData.append("entry.1715496086", formData.feedback);

    try {
      await fetch(googleFormURL, {
        method: "POST",
        body: submissionData,
        mode: "no-cors",
      });
      ToastLib.notifySuccess("Your feedback has been submitted!");
      setFormData({
        name: "",
        email: "",
        feedbackType: "",
        feedback: "",
      });
    } catch (error) {
      console.error("Error submitting form: ", error);
      ToastLib.notifyError("An error occurred while submitting your feedback. Please try again later.");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center transition-all duration-200">
        <div className="w-full max-w-2xl mx-4 my-8 transform transition-all duration-300 hover:scale-[1.01]">
          {/* Card Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-200">
            {/* Header Section */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
                <h1 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Submit Feedback
                </h1>
              </div>
            </div>

            {/* Form Section */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Feedback Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Feedback Type<span className="text-red-500">*</span>
                </label>
                <Select
                    onValueChange={handleSelectChange}
                    required
                >
                  <SelectTrigger className="w-full bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400">
                    <SelectValue placeholder="Select Feedback Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Comments">Comments</SelectItem>
                    <SelectItem value="Suggestions">Suggestions</SelectItem>
                    <SelectItem value="Questions">Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback Text */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Feedback<span className="text-red-500">*</span>
                </label>
                <Textarea
                    name="feedback"
                    id="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    required
                    placeholder="Share your thoughts with us..."
                    className="w-full min-h-[150px] bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 rounded-lg transition-all duration-200"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Submit Feedback
                </Button>
              </div>
            </form>

            {/* Footer Section */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 rounded-b-2xl border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Your feedback helps us improve our services.
                Thank you for taking the time to share your thoughts.
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default GoogleFormPage;
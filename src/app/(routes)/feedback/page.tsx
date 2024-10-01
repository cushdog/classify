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
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
    submissionData.append("entry.966562401", formData.feedbackType); // Feedback Type field
    submissionData.append("entry.1715496086", formData.feedback); // Feedback text

    try {
      await fetch(googleFormURL, {
        method: "POST",
        body: submissionData,
        mode: "no-cors",
      });
      toast.success("Your feedback has been submitted!");
    } catch (error) {
      console.error("Error submitting form: ", error);
      toast.error("An error occurred while submitting your feedback. Please try again later.");
    }
  };

  const handleBack = () => {
    router.back();
  }

  return (
    <div>
      <Button onClick={handleBack}>Back</Button>
      <h1>Submit Feedback</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="feedbackType">Feedback Type*</label>
          <Select onValueChange={handleSelectChange} required>
            <SelectTrigger aria-label="Select Feedback Type">
              <SelectValue placeholder="Select Feedback Type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Comments">Comments</SelectItem>
              <SelectItem value="Suggestions">Suggestions</SelectItem>
              <SelectItem value="Questions">Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="feedback">Feedback*</label>
          <Textarea
            name="feedback"
            id="feedback"
            value={formData.feedback}
            onChange={handleChange}
            required
          ></Textarea>
        </div>

        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default GoogleFormPage;

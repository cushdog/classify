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
import { IconButton, Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
    
    setFormData({
      name: "",
      email: "",
      feedbackType: "",
      feedback: "",
    });

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
      ToastLib.notifySuccess("Your feedback has been submitted!");
    } catch (error) {
      console.error("Error submitting form: ", error);
      ToastLib.notifyError("An error occurred while submitting your feedback. Please try again later.");
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full height of the viewport to center vertically
        padding: "20px",
      }}
    >
      <Box
        sx={{
          width: "100%", // Full width
          maxWidth: "600px", // Medium-sized box
          padding: "20px",
          backgroundColor: "#fff", // White background for the form
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Shadow for the box
          borderRadius: "8px", // Rounded corners
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <IconButton
            onClick={handleBack}
            aria-label="Go back"
            sx={{
              color: "#000", // Changed to black or dark color for visibility
              marginRight: "16px", // Adds space to the right of the button
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Submit Feedback
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Feedback Type*
            </Typography>
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
          </Box>

          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Feedback*
            </Typography>
            <Textarea
              name="feedback"
              id="feedback"
              value={formData.feedback}
              onChange={handleChange}
              required
            ></Textarea>
          </Box>

          <Box display="flex" justifyContent="center">
            <Button type="submit">Submit</Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default GoogleFormPage;

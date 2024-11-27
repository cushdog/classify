import React, { useContext } from "react";
import { Box, Typography, LinearProgress, styled } from "@mui/material";
import { RxLightningBolt } from "react-icons/rx";
import { TbListCheck } from "react-icons/tb";
import { PiScalesBold } from "react-icons/pi";
import { FaRegLightbulb, FaRegHeart } from "react-icons/fa";
import { ThemeContext } from "@/lib/ThemeContext";

// Define the necessary types
interface EvaluationData {
  desireToTake: number;
  understanding: number;
  workload: number;
  expectations: number;
  increasedInterest: number;
}

interface EvaluationCardProps {
  label: string;
  value: number;
  icon: React.ReactElement;
  description: string;
  barColor: string;
  textColor: string;
  iconColor: string;
}

// Custom styled container for the evaluation card
const EvaluationCardContainer = styled(Box)(
  ({ isDarkMode }: { isDarkMode: boolean }) => ({
    padding: 16,
    borderRadius: 16,
    textAlign: "center",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "translateY(-5px)",
    },
    border: `1px solid ${
      isDarkMode ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)"
    }`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: isDarkMode
      ? "rgba(50, 50, 50, 0.4)"
      : "rgba(255, 255, 255, 0.9)",
  })
);

// EvaluationCard component
const EvaluationCard: React.FC<EvaluationCardProps> = ({
  label,
  value,
  icon,
  description,
  barColor,
  textColor,
  iconColor,
}) => {
  const { theme } = useContext(ThemeContext); // Use ThemeContext to get the current theme
  const isDarkMode = theme === "dark"; // Determine if dark mode is active

  return (
    <EvaluationCardContainer isDarkMode={isDarkMode}>
      {/* Label */}
      <Typography
        variant="h6"
        sx={{ mb: 1, fontWeight: "bold", color: textColor }}
      >
        {label}
      </Typography>

      {/* Icon */}
      {React.cloneElement(icon, {
        size: 48,
        color: iconColor,
        style: { marginBottom: 8 },
      })}

      {value > 0 ? (
        <>
          {/* Percentage */}
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: textColor, mb: 1 }}
          >
            {Math.round(value)}%
          </Typography>

          {/* Progress Bar */}
          <LinearProgress
            variant="determinate"
            value={value}
            sx={{
              width: "80%",
              height: 12,
              borderRadius: 6,
              backgroundColor: isDarkMode ? "#333" : "#e0e0e0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: barColor,
                borderRadius: 6,
              },
              mb: 1.5,
            }}
          />

          {/* Description */}
          <Typography variant="body2" sx={{ color: textColor }}>
            {description}
          </Typography>
        </>
      ) : (
        // Empty state when value is 0%
        <Typography
          variant="body2"
          sx={{
            color: isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
            mt: 2,
          }}
        >
          No data available
        </Typography>
      )}
    </EvaluationCardContainer>
  );
};

// CourseEvaluations component
interface CourseEvaluationsProps {
  evaluationData: EvaluationData;
}

const CourseEvaluations: React.FC<CourseEvaluationsProps> = ({
  evaluationData,
}) => {
  const { theme } = useContext(ThemeContext); // Use ThemeContext to manage light/dark mode
  const isDarkMode = theme === "dark";

  return (
    <Box
      sx={{
        color: isDarkMode ? "white" : "black",
        transition: "background-color 0.3s ease",
        py: 4,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)", // Single column on extra-small screens
            sm: "repeat(2, 1fr)", // Two columns on small screens
            md: "repeat(3, 1fr)", // Three columns on medium screens
            lg: "repeat(5, 1fr)", // Five columns on large screens
          },
          gap: 4,
        }}
      >
        {/* Render an EvaluationCard for each metric */}
        <EvaluationCard
          label="Desire to Take"
          value={evaluationData.desireToTake}
          icon={<FaRegHeart />}
          description="% of respondents that expressed a strong desire to take this course."
          barColor="#FF6B6B"
          textColor="#FF6B6B"
          iconColor="#FF6B6B"
        />
        <EvaluationCard
          label="Understanding"
          value={evaluationData.understanding}
          icon={<FaRegLightbulb />}
          description="% of respondents that thought this course advanced their understanding of the subject matter."
          barColor="#FFD93D"
          textColor="#FFD93D"
          iconColor="#FFD93D"
        />
        <EvaluationCard
          label="Workload"
          value={evaluationData.workload}
          icon={<PiScalesBold />}
          description="% of respondents that perceived the workload for this course as heavier than other courses."
          barColor="#4ECDC4"
          textColor="#4ECDC4"
          iconColor="#4ECDC4"
        />
        <EvaluationCard
          label="Expectations"
          value={evaluationData.expectations}
          icon={<TbListCheck />}
          description="% of respondents that expressed knowing what was expected of them in this course."
          barColor="#1A535C"
          textColor="#1A535C"
          iconColor="#1A535C"
        />
        <EvaluationCard
          label="Increased Interest"
          value={evaluationData.increasedInterest}
          icon={<RxLightningBolt />}
          description="% of respondents that expressed an increased interest in the subject because of this course."
          barColor="#FF9F1C"
          textColor="#FF9F1C"
          iconColor="#FF9F1C"
        />
      </Box>
    </Box>
  );
};

export default CourseEvaluations;

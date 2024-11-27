import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface GPADistributionProps {
  apiUrl: string;
}

const GRADE_WEIGHTS = [
  'A+', 'A', 'A-', 'B+', 'B', 'B-', 
  'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'
];

const chartConfig = {
  percentage: {
    label: "Percentage",
    color: "#2563eb",
  },
} satisfies ChartConfig;

const GPADistribution: React.FC<GPADistributionProps> = ({ apiUrl }) => {
  const [data, setData] = useState<{
    chartData: Array<{ grade: string; percentage: number }>;
    medianGrade: string;
  }>({
    chartData: [],
    medianGrade: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl);
        const rawData: number[][] = await response.json();
        const counts = rawData[0];
        
        const totalStudents = counts.reduce((sum, count) => sum + count, 0);
        
        if (totalStudents === 0) {
          setData({
            chartData: GRADE_WEIGHTS.map(grade => ({ grade, percentage: 0 })),
            medianGrade: '',
          });
          return;
        }

        // Calculate percentages and find median grade
        let cumulativeCount = 0;
        let medianGrade = '';
        const chartData = counts.map((count, index) => {
          cumulativeCount += count;
          if (!medianGrade && cumulativeCount >= totalStudents / 2) {
            medianGrade = GRADE_WEIGHTS[index];
          }
          return {
            grade: GRADE_WEIGHTS[index],
            percentage: (count / totalStudents) * 100,
          };
        });

        setData({ chartData, medianGrade });
      } catch (error) {
        console.error('Error fetching GPA distribution:', error);
      }
    };

    fetchData();
  }, [apiUrl]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Grade Distribution</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          For students who earned letter grades other than W, I, P, or F, this graph shows the percentage of students who received each letter grade.
        </p>
        <p className="font-bold">Median Grade: {data.medianGrade}</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px] w-full">
          <BarChart 
            data={data.chartData} 
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis 
              dataKey="grade" 
              tickLine={false} 
              tickMargin={10} 
              axisLine={false}
            />
            <YAxis 
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
            />
            <Bar 
              dataKey="percentage" 
              fill="var(--color-percentage)" 
              radius={4}
              name="Percentage"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default GPADistribution;
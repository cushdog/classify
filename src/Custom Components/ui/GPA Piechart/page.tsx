import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';

interface GPAGaugeProps {
  gpa: number;
}

const GPAGauge: React.FC<GPAGaugeProps> = ({ gpa }) => {
  const maxGPA = 4.0;
  const normalizedGPA = Math.min(gpa, maxGPA) / maxGPA;
  const data = [
    { value: normalizedGPA },
    { value: 1 - normalizedGPA },
  ];

  const getColor = (gpa: number): string => {
    if (gpa < 2.5) return '#ff6b6b';  // Red for low GPA
    if (gpa >= 2.5 && gpa < 3.2) return '#feca57';  // Yellow for medium GPA
    return '#1dd1a1';  // Green for high GPA
  };

  const gaugeColor = getColor(gpa);
  const darkBackgroundColor = '#333333';  // Dark gray background for dark mode

  return (
    <div style={{ position: 'relative', width: '200px', height: '110px' }}>
      <PieChart width={200} height={100}>
        <Pie
          data={data}
          cx={100}
          cy={100}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={0}
          dataKey="value"
          stroke="none"
        >
          <Cell fill={gaugeColor} />
          <Cell fill={darkBackgroundColor} />
        </Pie>
      </PieChart>
      <div style={{
        position: 'absolute',
        bottom: '5px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '24px',
        fontWeight: 'bold',
        backgroundColor: '#121212',  // Dark background for the GPA label
        padding: '0 8px',
        borderRadius: '4px',
        color: gaugeColor
      }}>
        {gpa.toFixed(2)}
      </div>
    </div>
  );
};

export default GPAGauge;

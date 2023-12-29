import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyD3Component from "./MyD3Component";
import MyMultiSeriesD3Component from "./MyMultiSeriesD3Component";
import MainPage from "./MainPage";
import "./App.css";

function App() {
  const sampleData = [
    { category: "Laptop", value: 32 },
    { category: "Smartphone", value: 85 },
    { category: "Tablets", value: 45 },
    { category: "Smartwatch", value: 68 },
    { category: "Speakers", value: 13 },
    { category: "Digital Camera", value: 24 },
    { category: "Gaming Console", value: 53 },
    { category: "VR Headset", value: 24 },
    { category: "4K Monitor", value: 67 },
    { category: "LED TV", value: 49 },
  ];
  const months = [
    "Monday",
    "Tuesday",
    "Wednesdey",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const generateSeasonalData = (base, peak, range, phaseShift) => {
    return months.map((month, index) => {
      // Create a sinusoidal pattern to simulate seasonal trends
      const sinValue = Math.sin(((index + phaseShift) / 12) * 2 * Math.PI);
      // Peak in the middle of the year and lower at the beginning and end
      const offset = sinValue * peak;
      const value = base + offset + (index % 2 === 0 ? range / 2 : -range / 2);
      return {
        category: month,
        value: Math.max(0, value), // Ensure values don't go negative
      };
    });
  };

  const multiSeriesData = [
    {
      series: "Laptop",
      values: generateSeasonalData(100, 50, 5, 0), // Base of 50, peak of 20, random range of 30
    },
    {
      series: "Smartphone",
      values: generateSeasonalData(100, 30, 14, 0), // Base of 60, peak of 30, random range of 20
    },
    {
      series: "Tablets",
      values: generateSeasonalData(80, 30, 10, 0), // Base of 60, peak of 30, random range of 20
    },
    {
      series: "Smartwatch",
      values: generateSeasonalData(50, 40, 50, 0), // Base of 60, peak of 30, random range of 20
    },
    {
      series: "Speakers",
      values: generateSeasonalData(40, 30, 0, 0), // Base of 60, peak of 30, random range of 20
    },

    // ... (more series with their own patterns)
  ];

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/chart" element={<MyD3Component data={sampleData} />} />
          {/* New Route for Multi-Series Graph */}
          <Route
            path="/multiseries"
            element={<MyMultiSeriesD3Component data={multiSeriesData} />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyD3Component from "./MyD3Component";
import MySingleSeriesD3Component from "./MySingleSeriesD3Component";
import MainPage from "./MainPage";
import "./App.css";
import MyChartJSComponent from "./MyChartJSComponent";
import GoogleChart from "./GoogleChart";

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

  const foodData = [
    { category: "Apples", value: 1.99 },
    { category: "Bananas", value: 0.49 },
    { category: "Milk", value: 2.49 },
    { category: "Bread", value: 2.19 },
    { category: "Eggs", value: 1.79 },
    { category: "Chicken Breast", value: 3.99 },
    { category: "Rice", value: 4.99 },
    { category: "Pasta", value: 1.29 },
    { category: "Tomatoes", value: 1.29 },
    { category: "Cheese", value: 2.99 },
  ];

  const sampleData2 = [
    { title: "The Matrix", rating: 8.7 },
    { title: "The Shawshank Redemption", rating: 9.3 },
    { title: "The Godfather", rating: 9.2 },
    { title: "Jurassic Park", rating: 7.0 },
    { title: "Avatar", rating: 7.8 },
    { title: "Titanic", rating: 7.5 },
    { title: "The Avengers", rating: 8.0 },
    { title: "The Lion King", rating: 8.5 },
    { title: "Home Alone", rating: 6.7 },
    { title: "Transformers", rating: 6.0 },
    { title: "The Room", rating: 3.7 },
    { title: "Birdemic: Shock and Terror", rating: 1.8 },
  ];
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const generateDayOfWeekData = (base, peak, range, phaseShift) => {
    return daysOfWeek.map((day, index) => {
      const sinValue = Math.sin(((index + phaseShift) / 7) * 2 * Math.PI);
      const offset = sinValue * peak;
      const value = base + offset + (index % 2 === 0 ? range / 2 : -range / 2);
      return {
        category: day,
        value: Math.max(0, value),
      };
    });
  };

  const multiSeriesData = [
    {
      series: "Speakers",
      values: generateDayOfWeekData(40, 25, 10, 0),
    },
  ];

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/D3" element={<MyD3Component data={sampleData} />} />
          <Route
            path="/ChartJs"
            element={<MyChartJSComponent data={sampleData2} />}
          />
          <Route
            path="/GoogleChart"
            element={<GoogleChart data={foodData} />}
          />
          <Route
            path="/singleseries"
            element={
              <MySingleSeriesD3Component
                data={multiSeriesData}
                title="My Awesome Bar Chart"
                altText="Bar chart showing sales data. Each bar represents the sales of a product over a specified period."
              />
            }
          />
          {}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <Link to="/D3">Go to D3 Single-series Bar Graph</Link>
      <br />
      <br />
      <Link to="/ChartJs">Go to ChartJS Single-series Bar Graph</Link>
      <br />
      <br />
      <Link to="/GoogleChart">Go to GoogleChart Single-series Bar Graph</Link>
      <br />
      <br />
      <Link to="/singleseries">Go to D3 Single-Series Line Graph</Link>
    </div>
  );
};

export default MainPage;

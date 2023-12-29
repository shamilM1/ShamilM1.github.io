import React from "react";
import { Link } from "react-router-dom";

const MainPage = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <Link to="/chart">Go to Chart</Link>
      <br />
      <Link to="/multiseries">Go to Multi-Series Graph</Link> {/* New link */}
    </div>
  );
};

export default MainPage;

import React from "react";

const ChartLegend = ({ data, colors }) => {
  return (
    <div>
      <h3>Legend</h3>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <span
              className="legend-color"
              style={{ backgroundColor: colors[index] }}
            ></span>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChartLegend;

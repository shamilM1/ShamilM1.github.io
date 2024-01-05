import React from "react";

const AccessibleDataTable = ({ multiSeriesData }) => {
  return (
    <table aria-describedby="chartDesc">
      <caption>
        Table representing average sales per week of certain products. Each row
        represents a product and each column represents a day of the week.
      </caption>
      <thead>
        <tr>
          <th scope="col">Product</th>
          {multiSeriesData[0].values.map((val, index) => (
            <th key={index} scope="col">
              {val.category}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {multiSeriesData.map((series, index) => (
          <tr key={index}>
            <th scope="row">{series.series}</th>
            {series.values.map((val, valIndex) => (
              <td key={valIndex}>{val.value}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AccessibleDataTable;

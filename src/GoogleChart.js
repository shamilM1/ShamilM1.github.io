import React, { useEffect, useState } from "react";
import startCase from "lodash/startCase";
import voxlens from "voxlens";
import "./MyGoogleChartComponent.css";

const MyGoogleChartComponent = ({ data, title, altText }) => {
  useEffect(() => {
    const createGoogleCharts = () => {
      const container = document.getElementById("chart");
      const legendContainer = document.getElementById("legend");
      const tableContainer = document.getElementById("data-table");
      const margin = { top: 20, right: 40, bottom: 60, left: 70 };
      const height = 700 - margin.top - margin.bottom;
      const width = container.offsetWidth - margin.left - margin.right;
      const google = window.google;

      const drawChart = () => {
        if (!window.google || !google.charts) {
          console.error("Google Charts library not loaded");
          return;
        }

        const dataTable = new google.visualization.DataTable();
        let Chart = google.visualization.ColumnChart;

        dataTable.addColumn("string", startCase("category"));
        dataTable.addColumn("number", startCase("value"));
        dataTable.addColumn({ type: "string", role: "style" });

        const colors = [
          "#333333",
          "#007ACC",
          "#950061",
          "#006400",
          "#8B0000",
          "#FFD700",
          "#6E5600",
          "#009933",
          "#FF6600",
          "#4B0082",
          "#FF1493",
          "#800000",
        ];
        const tableRows = [];

        const legendItems = data.map((d, index) => {
          return {
            name: d.category.toString(),
            color: colors[index % colors.length],
          };
        });

        data.forEach((d, index) => {
          const color = colors[index % colors.length];
          dataTable.addRow([d.category.toString(), parseFloat(d.value), color]);

          tableRows.push(`<tr><td>${d.category}</td><td>${d.value}</td></tr>`);
        });

        const options = {
          legend: { position: "none" },
          accessibility: {
            enable: true,
            description:
              "A bar chart showing prices of different products. Each bar represents a product and its corresponding price.",
          },
          bars: "horizontal",
          title: "The price of different products",
          width,
          height,
          hAxis: {
            title: startCase("Product"),
            slantedText: false,
          },
          vAxis: {
            title: startCase("Price"),
            baseline: 0,
            gridlines: {
              color: "black",
            },
          },
          titlePosition: "out",
          forceIFrame: false,
        };

        const chart = new Chart(container);
        chart.draw(dataTable, options);

        legendContainer.innerHTML = legendItems
          .map(
            (item) =>
              `<div style="display: flex; align-items: center; margin-bottom: 5px;">
             <span style="background-color: ${item.color}; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></span>
             <span>${item.name}</span>
          </div>`
          )
          .join("");

        tableContainer.innerHTML = `
          <table class="data-table">
            <thead>
              <tr><th>Product</th><th>Price</th></tr>
            </thead>
            <tbody>
              ${tableRows.join("")}
            </tbody>
          </table>
        `;
        const voxlensOptions = {
          x: "category",
          y: "value",
          title: "The price of different products",
          xLabel: "Product",
          yLabel: "Price",
        };

        voxlens("googlecharts", chart, data, voxlensOptions);
      };

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChart);
    };

    createGoogleCharts();
  }, [data, title]);

  return (
    <section aria-labelledby="chart-title">
      {" "}
      {}
      <h2 id="chart-title" style={{ textAlign: "center" }}>
        {title}
      </h2>{" "}
      {}
      <div
        id="chart"
        style={{ width: "100%", height: "700px" }}
        role="img"
        aria-label={altText}
      ></div>{" "}
      {}
      <aside
        id="legend"
        style={{ position: "absolute", top: "20px", right: "40px" }}
      >
        {" "}
        {}
        {}
      </aside>
      <div
        id="data-table"
        style={{ position: "absolute", bottom: "20px", left: "40px" }}
      >
        {" "}
        {}
        {}
      </div>
      <div
        aria-live="polite"
        style={{ textAlign: "center", marginTop: "5px", fontSize: "17px" }}
      >
        Bar chart showing the price of different products. Rice and Chicken
        Breast have the highest price with 4.99 and 3.99 respectively , while
        Banana has the lowest, with 0.49.
      </div>
    </section>
  );
};

export default MyGoogleChartComponent;

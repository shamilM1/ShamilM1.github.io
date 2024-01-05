import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import voxlens from "voxlens";
import styled from "styled-components";

const VisuallyHiddenDescription = styled.div`
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
`;

const DataTable = styled.table`
  border-collapse: collapse;
  width: auto;
  font-size: 12px;
`;

const ThTd = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Th = styled.th`
  background-color: #f2f2f2;
`;

const LegendContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: white;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: #fff;
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 5px;
  display: none;
  pointer-events: none;
`;

const ChartCanvas = styled.canvas`
  width: 600px; 
  height: 300px; 
`;

const MyChartComponent = ({ data, withVoxLens }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [selectedBarIndex, setSelectedBarIndex] = useState(-1);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const accessibleColors = [
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
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    const backgroundColors = data.map(
      (_, index) => accessibleColors[index % accessibleColors.length]
    );

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((d) => d.title),
        datasets: [
          {
            label: "Ratings",
            data: data.map((d) => d.rating),
            backgroundColor: data.map(
              (_, index) => accessibleColors[index % accessibleColors.length]
            ),
          },
        ],
      },
      options: {
        layout: {
          padding: {
            top: 100,
            right: 100,
            bottom: 50,
            left: 100,
          },
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: "Movie Titles",
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
          y: {
            display: true,
            title: {
              display: true,
              text: "Ratings",
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
        },
        plugins: {
          onHover: (event, chartElement) => {
            event.native.target.style.cursor = chartElement[0]
              ? "pointer"
              : "default";
            if (chartInstance.current) {
              chartInstance.current.data.datasets[0].borderWidth = data.map(
                (_, index) => (index === chartElement[0]?.index ? 2 : 0)
              );
              chartInstance.current.update();
            }
          },
          tooltip: {
            enabled: true,
            mode: "index",
            position: "nearest",
            callbacks: {
              label: function (context) {
                return `Rating: ${context.parsed.y}`;
              },
            },
          },
          legend: {
            display: false,
          },
          title: {
            display: false,
            text: "Ratings of different movies",
            position: "top",
            font: {
              size: 16,
              weight: "bold",
            },
          },
        },
        hover: {
          animationDuration: 0,
        },
      },
    });

    const voxlensOptions = {
      x: "title",
      y: "rating",
      title: "Chart Title",
    };
    voxlens("chartjs", chartRef.current, data, voxlensOptions);
  }, [data, withVoxLens]);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        setSelectedBarIndex((prevIndex) => {
          let newIndex = e.key === "ArrowRight" ? prevIndex + 1 : prevIndex - 1;
          newIndex = Math.min(Math.max(newIndex, 0), data.length - 1);
          const bar = chartInstance.current.getDatasetMeta(0).data[newIndex];
          setTooltipPosition({ x: bar.x, y: bar.y });
          return newIndex;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [data.length]);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].backgroundColor = data.map(
        (_, index) =>
          index === selectedBarIndex
            ? "#FFD700"
            : accessibleColors[index % accessibleColors.length]
      );
      chartInstance.current.update();
    }
  }, [selectedBarIndex, data]);
  useEffect(() => {
    if (chartInstance.current) {
      const legendContainer = document.querySelector("#legend-container");
      if (legendContainer) {
        legendContainer.innerHTML = generateLegend(data);
      }
    }
  }, [data]);

  const generateLegend = (data) => {
    return data
      .map(
        (item, index) =>
          `<div style="display: flex; align-items: center;">
            <div style="width: 20px; height: 20px; background-color: ${
              accessibleColors[index % accessibleColors.length]
            }; margin-right: 5px;"></div>
            <span>${item.title}</span>
          </div>`
      )
      .join("");
  };

  return (
    <main
      aria-labelledby="main-heading"
      style={{ display: "flex", alignItems: "center", padding: "20px" }}
    >
      {" "}
      <h1 id="main-heading" style={{ display: "none" }}>
        Movie Ratings Chart
      </h1>
      <aside
        aria-labelledby="data-table-heading"
        style={{ marginRight: "20px" }}
      >
        <h2
          id="data-table-heading"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          Data Table of Movie Ratings
        </h2>

        <DataTable>
          <thead>
            <tr>
              <Th>Title</Th>
              <Th>Rating</Th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <ThTd>{item.title}</ThTd>
                <ThTd>{item.rating}</ThTd>
              </tr>
            ))}
          </tbody>
        </DataTable>
      </aside>
      <section aria-labelledby="chart-section-heading">
        <h2
          id="chart-section-heading"
          style={{ fontSize: "18px", fontWeight: "bold" }}
        >
          Ratings of different movie
        </h2>
        <figure aria-labelledby="chart-title">
          <ChartCanvas
            ref={chartRef}
            id="goodCanvas1"
            aria-label="Bar chart showing movie ratings. The highest rating is for The Shawshank Redemption at 9.3, followed by The Godfather at 9.2, and the lowest is Birdemic: Shock and Terror at 1.8."
          />
          <figcaption id="chart-title">
            <p
              style={{
                marginTop: "2px",
                textAlign: "center",
                fontSize: "20px",
              }}
            >
              This bar graph shows the rating of different movies. With the
              highest one being The Shawshank Redemption with a rating of 9.3,
              and the lowest one being Birdemic: Shock and Terror with a rating
              of 1.8.
            </p>
          </figcaption>
        </figure>
        <nav aria-labelledby="legend-title">
          <LegendContainer id="legend-container" role="document">
            <h2
              id="legend-title"
              style={{ fontSize: "14px", fontWeight: "bold" }}
            >
              Color Legend
            </h2>
            <ul aria-label="Movie Ratings Legend">
              {data.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "5px",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      backgroundColor:
                        accessibleColors[index % accessibleColors.length],
                      display: "inline-block",
                      marginRight: "10px",
                    }}
                  ></span>
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </LegendContainer>
        </nav>
        <Tooltip
          style={{
            left: tooltipPosition.x + 200,
            top: tooltipPosition.y,
            display: selectedBarIndex >= 0 ? "block" : "none",
          }}
        >
          Rating: {selectedBarIndex >= 0 ? data[selectedBarIndex].rating : ""}
        </Tooltip>
        <VisuallyHiddenDescription>
          <h2>Movie Ratings Overview</h2>
          <p>
            This data visualization is a bar chart representing the ratings of
            various movies. Each bar's height indicates the movie's rating on a
            scale from 0 to 10. Notable trends include a high rating for classic
            films such as The Shawshank Redemption and The Godfather, which have
            ratings above 9.0. In contrast, movies such as Birdemic: Shock and
            Terror have significantly lower ratings, close to 1.8, indicating a
            strong disparity in movie reception. The chart illustrates a general
            trend where widely recognized films tend to have higher ratings,
            while less known or critically panned films show lower ratings.
          </p>
        </VisuallyHiddenDescription>
      </section>
    </main>
  );
};

export default MyChartComponent;

import React, { useEffect } from "react";
import * as d3 from "d3";
import voxlens from "voxlens";

const MyMultiSeriesD3Component = ({ data }) => {
  useEffect(() => {
    // Clear any existing SVG to prevent duplicates
    d3.select("#multi-d3-container").selectAll("*").remove();

    // Set up dimensions and margins for the graph
    const margin = { top: 20, right: 150, bottom: 30, left: 50 }, // Adjust right margin to make room for legend
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Append the SVG object to the div
    const svg = d3
      .select("#multi-d3-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Parse the Data
    const categories = Array.from(
      new Set(data.flatMap((d) => d.values.map((v) => v.category)))
    );
    const maxValue = d3.max(data, (s) => d3.max(s.values, (v) => v.value));

    // Create scales
    const xScale = d3.scalePoint().range([0, width]).domain(categories);
    const yScale = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);

    // Add the x-axis
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    // Add the y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    // Create a color scale for differentiating series
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Line generator
    const line = d3
      .line()
      .curve(d3.curveMonotoneX) // This will smooth the lines
      .x((d) => xScale(d.category))
      .y((d) => yScale(d.value));

    // Draw lines for each series and apply VoxLens
    data.forEach((seriesData, i) => {
      // Add the line
      const lineElement = svg
        .append("path")
        .datum(seriesData.values)
        .attr("fill", "none")
        .attr("stroke", color(i))
        .attr("stroke-width", 1.5)
        .attr("d", line);

      // Append series name at the end of the line
      svg
        .append("text")
        .attr("fill", color(i))
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .attr("x", width + 5) // Offset from the right edge
        .attr(
          "y",
          yScale(seriesData.values[seriesData.values.length - 1].value)
        )
        .text(seriesData.series);

      // Apply VoxLens for accessibility
      try {
        voxlens("d3", lineElement, seriesData.values, {
          x: "category",
          y: "value",
          series: "series",
          title: "Multi-Series Line Chart",
          xLabel: "Category",
          yLabel: "Value",
          // ... any other options
        });
      } catch (error) {
        console.error("VoxLens integration error:", error);
      }
    });

    // Create a legend
    const legend = svg
      .selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    // Draw legend colored rectangles
    legend
      .append("rect")
      .attr("x", width + 20)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => color(i));

    // Draw legend text
    legend
      .append("text")
      .attr("x", width + 40)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d) => d.series);
  }, [data]); // Only re-run the effect if new data comes in

  return <div id="multi-d3-container"></div>;
};

export default MyMultiSeriesD3Component;

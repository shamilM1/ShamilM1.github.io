import React, { useEffect } from "react";
import * as d3 from "d3";
import voxlens from "voxlens";

const MyMultiSeriesD3Component = ({ data }) => {
  useEffect(() => {
    // Clear any existing SVG to prevent duplicates
    d3.select("#multi-d3-container").selectAll("*").remove();

    const legendItemHeight = 20; // Height of each legend item, adjust as needed
    const legendTotalHeight = data.length * legendItemHeight;

    // Set up dimensions and margins for the graph
    const margin = { top: 100, right: 150, bottom: 100, left: 100 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // Append the SVG object to the div
    const svg = d3
      .select("#multi-d3-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 60)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2) // Position above the chart
      .attr("text-anchor", "middle")
      .style("font-size", "24px") // Font size can be changed based on your design
      .text("Average sales per week of certain products");
    const captionText = svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 50) // Position below the chart, adjust as necessary
      .attr("text-anchor", "middle")
      .style("font-size", "14px") // Adjust font size as needed
      .style("font-style", "italic"); // Italicize the font

    captionText
      .append("tspan")
      .attr("x", width / 2) // Center the line
      .attr("dy", "1.2em") // Position on the first line
      .text(
        "This multi-series graph shows average sales per each day of the week"
      );

    captionText
      .append("tspan")
      .attr("x", width / 2) // Center the line
      .attr("dy", "1.2em") // Move to the next line
      .text(
        "for certain products such as Laptop, Smartphone, Tablets, Smartwatch, Speakers."
      );

    captionText
      .append("tspan")
      .attr("x", width / 2) // Center the line
      .attr("dy", "1.2em") // Move to the next line
      .text("Each line represents a product.");

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

    // Add X-axis title
    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 65})`)
      .style("text-anchor", "middle")
      .text("Day of the Week");

    // Add the y-axis
    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amount Sold");

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
      const tooltip = d3
        .select("#multi-d3-container")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");

      // Hover line and circle
      const focusLine = svg
        .append("line")
        .style("stroke", "grey")
        .style("stroke-width", 1.5)
        .style("opacity", 0);

      const focusCircle = svg
        .selectAll(".focusCircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "focusCircle")
        .style("fill", (d, i) => color(i))
        .style("stroke", "none")
        .attr("r", 4.5)
        .style("opacity", 0);

      // Mouse event functions
      const mouseover = () => {
        tooltip.style("opacity", 1);
        focusLine.style("opacity", 1);
        focusCircle.style("opacity", 1);
      };

      const mousemove = (event) => {
        const mouse = d3.pointer(event);
        const eachBand = xScale.step();
        const index = Math.round(mouse[0] / eachBand);
        const d0 = data.map((series) => ({
          name: series.series,
          value:
            series.values[Math.max(0, Math.min(index, categories.length - 1))]
              .value,
        }));

        focusLine
          .attr(
            "x1",
            xScale(
              categories[Math.max(0, Math.min(index, categories.length - 1))]
            )
          )
          .attr("y1", 0)
          .attr(
            "x2",
            xScale(
              categories[Math.max(0, Math.min(index, categories.length - 1))]
            )
          )
          .attr("y2", height);

        focusCircle
          .data(d0)
          .attr(
            "cx",
            xScale(
              categories[Math.max(0, Math.min(index, categories.length - 1))]
            )
          )
          .attr("cy", (d) => yScale(d.value));

        tooltip
          .html(
            `Day of the Week: ${
              categories[Math.max(0, Math.min(index, categories.length - 1))]
            }<br>` + d0.map((d) => `${d.name}: ${d.value}`).join("<br>")
          )
          .style("left", event.pageX + "px")
          .style("top", event.pageY + "px");
      };
      const mouseleave = () => {
        tooltip.style("opacity", 0);
        focusLine.style("opacity", 0);
        focusCircle.style("opacity", 0);
      };

      // Append a rect to catch mouse movements on the canvas
      svg
        .append("rect")
        .attr("width", width)
        .attr("height", height)
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
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
          title: "Average sales per week of certain products",
          xLabel: "Day of the Week and Product",
          yLabel: "Amount Sold",
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
      .attr(
        "transform",
        (d, i) =>
          `translate(${width + margin.right / 4}, ${
            height - 270 - legendTotalHeight + i * legendItemHeight
          })`
      ); // Adjust the x translation to position the legend more to the right

    // Draw legend colored rectangles
    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => color(i));

    // Draw legend text
    legend
      .append("text")
      .attr("x", 22) // Slight offset from the colored rectangle
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d) => d.series);
  }, [data]); // Only re-run the effect if new data comes in

  return <div id="multi-d3-container"></div>;
};

export default MyMultiSeriesD3Component;

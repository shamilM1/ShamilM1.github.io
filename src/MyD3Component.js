import React, { useEffect } from "react";
import * as d3 from "d3";
import voxlens from "voxlens";

const MyD3Component = ({ data }) => {
  useEffect(() => {
    d3.select("#d3-container").selectAll("*").remove();

    const margin = { top: 50, right: 50, bottom: 90, left: 80 }, // Increased bottom margin
      width = 600 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom;

    const svg = d3
      .select("#d3-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.category))
      .padding(0.2);

    const xAxis = svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(0,0)rotate(-40)")
      .style("text-anchor", "end");

    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    // Create a tooltip div
    const tooltip = d3
      .select("#d3-container")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    // Create a color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw bars with color
    const bars = svg
      .selectAll("mybar")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d.category))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d, i) => color(i));

    // Tooltip mouseover event
    bars
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html("Value: " + d.value)
          .style("position", "absolute")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 20 + "px");
      })
      .on("mouseleave", () => {
        tooltip.style("opacity", 0);
      });

    // Add title to the chart
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "15px")
      .text("Sales of Electronic Shop During Last Week");

    // Add X-axis label
    svg
      .append("text")
      .attr("x", width / 1 + 40)
      .attr("y", height + 50)
      .style("text-anchor", "middle")
      .text("Product Name");

    // Add Y-axis label
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amount Sold");

    // Additional textual description
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 70)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-style", "italic")
      .text(
        "This chart shows the sales of products in an electronic shop during the last week. Each bar represents a product."
      );

    // VoxLens Integration
    const voxlensOptions = {
      x: "category",
      y: "value",
      title: "Sales of Electronic Shop During Last Week",
      xLabel: "Product Name",
      yLabel: "Amount Sold",
    };

    bars.call((d) => voxlens("d3", d, data, voxlensOptions));
  }, [data]);

  return <div id="d3-container"></div>;
};

export default MyD3Component;

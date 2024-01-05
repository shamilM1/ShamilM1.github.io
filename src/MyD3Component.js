import React, { useEffect } from "react";
import * as d3 from "d3";
import voxlens from "voxlens";
import "./MyD3Component.css";

const MyD3Component = ({ data }) => {
  useEffect(() => {
    d3.select("#d3-container").selectAll("*").remove();

    const margin = { top: 50, right: 150, bottom: 100, left: 80 },
      width = 1500 - margin.left - margin.right,
      height = 550 - margin.top - margin.bottom;

    const svg = d3
      .select("#d3-container")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 1000)
      .attr("role", "figure")
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("title").text("Sales of Electronic Shop During Last Week");

    svg
      .append("desc")
      .text(
        "This chart displays a bar graph showing the sales of products in an electronic shop during the last week. " +
          "Each bar represents a different product category with the height indicating the quantity sold."
      );

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

    const colors = [
      "#333333",
      "#007ACC",
      "#006400",
      "#8B0000",
      "#FFD700",
      "#6E5600",
      "#009933",
      "#FF6600",
      "#4B0082",
      "#FF1493",
    ];

    const color = d3.scaleOrdinal(colors);

    const bars = svg
      .selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.category))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d, i) => color(i))
      .attr("tabindex", 0)
      .attr("role", "img")
      .attr("aria-label", (d) => `Category: ${d.category}, Value: ${d.value}`)
      .on("focus", function (event, d) {
        d3.select(this).style("stroke", "black").style("stroke-width", 2);
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip
          .html(`Product: ${d.category}<br/>Sold Amount: ${d.value}`)
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY - 28}px`);
      })
      .on("blur", function () {
        d3.select(this).style("stroke", "none");
        tooltip.transition().duration(500).style("opacity", 0);
      })
      .on("keydown", function (event, d) {
        let newIdx;
        if (event.key === "ArrowRight") {
          newIdx = (data.findIndex((item) => item === d) + 1) % data.length;
        } else if (event.key === "ArrowLeft") {
          newIdx =
            (data.findIndex((item) => item === d) - 1 + data.length) %
            data.length;
        } else {
          return;
        }
        const newElem = svg.selectAll(".bar").nodes()[newIdx];
        newElem.focus();
      });

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("fill", (d, i) => color(i));

    const legend = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(data.map((d) => d.category))
      .join("g")
      .attr("transform", (d, i) => `translate(70,${i * 20})`);

    legend
      .append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", (d, i) => color(i));

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text((d) => d)
      .attr("aria-hidden", "true");

    const legendDescription =
      "Legend: Each color represents a product category";

    svg
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(legendDescription)
      .attr("visibility", "hidden")
      .attr("aria-hidden", "false")
      .attr("role", "presentation");

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

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -20)
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .text("Sales of Electronic Shop During Last Week")
      .attr("role", "heading")
      .attr("aria-level", "1");

    svg
      .append("text")
      .attr("x", width / 1 + 40)
      .attr("y", height + 50)
      .style("text-anchor", "middle")
      .text("Products");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amount Sold");

    const descriptionLines = [
      "This chart shows the sales of products in an electronic shop during the last week.",
      "Each bar represents a product, with categories including Laptops, Smartphones, Tablets,",
      "Smartwatches, Speakers, Digital Cameras, Gaming Consoles, VR Headsets, 4K Monitors, and LED TVs.",
      "The vertical axis represents the quantity sold, with amounts ranging from 0 to 100.",
      "The tallest bars indicate the highest sales for Smartphones, followed by Tablets and Gaming Consoles.",
    ];

    const textBlock = svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom / 1)
      .style("font-size", "20px")
      .style("font-style", "italic")
      .attr("id", "chart-description");

    textBlock
      .append("tspan")
      .attr("x", width / 2)
      .text(descriptionLines[0]);

    descriptionLines.slice(1).forEach((line, index) => {
      textBlock
        .append("tspan")
        .attr("x", width / 2)
        .attr("dy", "1.2em")
        .text(line);
    });
    svg.attr("aria-describedby", "chart-description");

    const voxlensOptions = {
      x: "category",
      y: "value",
      title: "Sales of Electronic Shop During Last Week",
      xLabel: "Products",
      yLabel: "Amount Sold",
    };

    const navigationDesc =
      "This chart is interactive. Use arrow keys to navigate between bars.";

    svg
      .append("desc")
      .text(navigationDesc)
      .attr("id", "navigation-description");

    const voxlensInteractions = `
      Interaction Modes
      Modifier Keys: Ctrl + Shift (Windows) and Option (MacOS)
      
      Mode    Activation Key    Description
      Question-and-Answer    Modifier Keys + A or Modifier Keys + 1    Enables users to interact with the visualization through voice commands using their microphone
      Summary    Modifier Keys + S or Modifier Keys + 2    Provides a holistic summary of the data contained in the visualization
      Sonification    Modifier Keys + M or Modifier Keys + 3    Plays a sonified version of the data using the sonifier library
      Instructions    Modifier Keys + I or Modifier Keys + 4    Provides the user with instructions on how to interact with VoxLens
      Pause    Modifier Keys + P or Modifier Keys + 5    Pauses the output from VoxLens. Also works with sonification
      `;

    svg
      .append("desc")
      .text(voxlensInteractions)
      .attr("id", "voxlens-interactions");

    bars.call((d) => voxlens("d3", d, data, voxlensOptions));
    createAccessibleTable();
  }, [data]);
  const createAccessibleTable = () => {
    const container = d3.select("#d3-container");

    const table = container
      .append("table")
      .attr("class", "accessible-table data-table")
      .attr("class", "accessible-table")
      .style("position", "absolute")
      .style("left", "0px")
      .style("bottom", "0px")
      .style("max-height", "300px")
      .style("overflow", "auto")
      .attr("aria-labelledby", "chart-title")
      .attr("role", "table");

    const thead = table.append("thead");
    thead
      .attr("class", "accessible-table data-table")
      .append("tr")
      .selectAll("th")
      .data(["Products", "Amount Sold"])
      .enter()
      .append("th")
      .text((d) => d);

    const tbody = table.append("tbody");

    const rows = tbody.selectAll("tr").data(data).enter().append("tr");

    rows.append("td").text((d) => d.category);
    rows.append("td").text((d) => d.value);

    table.attr("aria-rowcount", data.length + 1).attr("aria-colcount", 2);
  };
  return <div id="d3-container"></div>;
};

export default MyD3Component;

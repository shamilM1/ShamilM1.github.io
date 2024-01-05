import React, { useEffect } from "react";
import * as d3 from "d3";
import voxlens from "voxlens";

const MySingleSeriesD3Component = ({ data }) => {
  useEffect(() => {
    d3.select("#multi-d3-container").selectAll("*").remove();

    const legendItemHeight = 20;
    const legendTotalHeight = data.length * legendItemHeight;

    const margin = { top: 100, right: 150, bottom: 100, left: 100 },
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const svg = d3
      .select("#multi-d3-container")
      .append("svg")
      .attr("role", "graphics-document")
      .attr("aria-labelledby", "chartTitle chartDesc")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom + 60)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    svg
      .append("title")
      .attr("id", "chartTitle")
      .text("Average sales of Speakers per days of week");
    svg
      .append("desc")
      .attr("id", "chartDesc")
      .text(
        "This chart shows the average speaker sales for each day of the week. Sales peak on Wednesday near 65 and hit the lowest on Saturday around 15."
      );

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", -margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "24px")
      .text("Average sales of Speakers per days of week");
    const captionText = svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height + 50)
      .attr("text-anchor", "middle")
      .style("font-size", "14px")
      .style("font-style", "italic");

    captionText
      .append("tspan")
      .attr("x", width / 2)
      .attr("dy", "1.2em")
      .text(
        "A single-series chart showing Speakers sales for each day of the week. Sales peak on Wednesday near 65 and hit the lowest on Saturday around 15."
      );

    const categories = Array.from(
      new Set(data.flatMap((d) => d.values.map((v) => v.category)))
    );
    const maxValue = d3.max(data, (s) => d3.max(s.values, (v) => v.value));

    const xScale = d3.scalePoint().range([0, width]).domain(categories);
    const yScale = d3.scaleLinear().domain([0, maxValue]).range([height, 0]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top - 65})`)
      .style("text-anchor", "middle")
      .text("Day of the Week");

    svg.append("g").call(d3.axisLeft(yScale));

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 50 - margin.left)
      .attr("x", 0 - height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amount Sold");

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x((d) => xScale(d.category))
      .y((d) => yScale(d.value));
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
      .style("position", "absolute")
      .style("z-index", "10");
    const focusOnPoint = (points, index) => {
      d3.select(points.nodes()[index]).node().focus();
    };

    data.forEach((seriesData, i) => {
      const lineElement = svg
        .append("path")
        .datum(seriesData.values)
        .attr("role", "graphics-symbol")
        .attr("aria-roledescription", "line")
        .attr("aria-label", `Series ${i + 1}: ${seriesData.series}`)
        .attr("fill", "none")
        .attr("stroke", color(i))
        .attr("stroke-width", 1.5)
        .attr("d", line);

      const points = svg
        .selectAll(".point")
        .data(seriesData.values)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("tabindex", "0")
        .attr("role", "img")
        .attr("aria-label", (d) => `Day: ${d.category}, Sales: ${d.value}`)
        .attr("cx", (d) => xScale(d.category))
        .attr("cy", (d) => yScale(d.value))
        .attr("r", 5)
        .attr("fill", color(i))
        .on("focus", (event, d) => handleFocus(event, d, tooltip))
        .on("blur", handleBlur)
        .on("keydown", (event, d) => handleKeyDown(event, d, points));

      if (i === 0) focusOnPoint(points, 0);

      try {
        voxlens("d3", lineElement, seriesData.values, {
          x: "category",
          y: "value",
          series: "series",
          title: "Average sales per week of certain products",
          xLabel: "Day of the Week and Product",
          yLabel: "Amount Sold",
        });
      } catch (error) {
        console.error("VoxLens integration error:", error);
      }
    });

    const legend = svg
      .attr("role", "list")
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
      )
      .attr("role", "listitem")
      .attr(
        "aria-label",
        (d) => `Series ${d.series}: Color ${color(d.series)}`
      );
    function handleFocus(event, d, tooltip) {
      const e = event.currentTarget;
      const circleRadius = parseInt(d3.select(e).attr("r"));
      const strokeWidth = parseInt(d3.select(e).attr("stroke-width") || 0);

      const totalRadius = circleRadius + strokeWidth;

      d3.select(e).attr("stroke", "black").attr("stroke-width", 2);

      const x = xScale(d.category);
      const y = yScale(d.value);

      tooltip.transition().duration(200).style("opacity", 1);
      tooltip
        .html("Day: " + d.category + "<br/>Sales: " + d.value)
        .style(
          "left",
          svg.node().getBoundingClientRect().left + x + totalRadius + 5 + "px"
        )
        .style(
          "top",
          svg.node().getBoundingClientRect().top +
            window.scrollY +
            y -
            totalRadius -
            10 +
            "px"
        );
    }

    function handleBlur(event, d) {
      const e = event.currentTarget;
      d3.select(e).attr("stroke", null).attr("stroke-width", null);

      tooltip.transition().duration(500).style("opacity", 0);
    }
    function handleKeyDown(event, d, points) {
      const index = points.data().indexOf(d);
      if (event.key === "ArrowLeft") {
        const prevIndex = index > 0 ? index - 1 : points.size() - 1;
        focusOnPoint(points, prevIndex);
      } else if (event.key === "ArrowRight") {
        const nextIndex = index < points.size() - 1 ? index + 1 : 0;
        focusOnPoint(points, nextIndex);
      }
    }

    legend
      .append("rect")
      .attr("x", 0)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (d, i) => color(i));

    legend
      .append("text")
      .attr("x", 22)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d) => d.series);

    svg.selectAll(".domain, .tick").attr("role", "presentation");

    svg
      .selectAll(".axis-title")
      .attr("role", "doc-subtitle")
      .attr("aria-roledescription", "axis title");

    const table = d3
      .select("#multi-d3-container")
      .append("table")
      .style("position", "absolute")
      .style("left", "0px")
      .style("bottom", "0px")
      .attr("class", "data-table")
      .attr("role", "table")
      .attr("aria-labelledby", "tableTitle");

    d3.select("#multi-d3-container")
      .append("div")
      .attr("id", "tableTitle")
      .style("position", "absolute")
      .style("left", "-9999px")
      .text("Table representing speaker sales data per day");

    const thead = table.append("thead");
    thead
      .append("tr")
      .selectAll("th")
      .data(["Day", "Sales"])
      .enter()
      .append("th")
      .text((d) => d)
      .attr("scope", "col")
      .attr("role", "columnheader");

    const tbody = table.append("tbody").attr("role", "rowgroup");
    data.forEach((seriesData) => {
      seriesData.values.forEach((d) => {
        const row = tbody.append("tr").attr("role", "row");
        row.append("td").text(d.category).attr("role", "cell");
        row.append("td").text(d.value).attr("role", "cell");
      });
    });
  }, [data]);

  return (
    <div
      id="multi-d3-container"
      style={{ position: "relative", outline: "none" }}
      tabIndex="0"
    ></div>
  );
};

export default MySingleSeriesD3Component;

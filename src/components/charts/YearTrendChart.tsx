import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchYearWiseTrend } from "../../services/api.service";
import { AggregatedData } from "../../types";
import { Loader2 } from "lucide-react";
import { getChartColors } from "../../utils/chartColors";

interface YearTrendChartProps {
  isDark: boolean;
}

const YearTrendChart = ({ isDark }: YearTrendChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetchYearWiseTrend();
      setData(response.data);
    } catch (error) {
      console.error("Error loading year data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const colors = getChartColors(isDark);

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 1100;
    const height = 400;
    const margin = { top: 40, right: 100, bottom: 60, left: 60 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scalePoint()
      .domain(data.map((d) => d._id))
      .range([margin.left, width - margin.right])
      .padding(0.5);

    const y = d3
      .scaleLinear()
      .domain([
        0,
        Math.max(
          d3.max(data, (d) => d.avgIntensity || 0) || 0,
          d3.max(data, (d) => d.avgLikelihood || 0) || 0,
          d3.max(data, (d) => d.avgRelevance || 0) || 0
        ),
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const lineIntensity: any = d3
      .line<AggregatedData>()
      .x((d) => x(d._id) || 0)
      .y((d) => y(d.avgIntensity || 0))
      .curve(d3.curveMonotoneX);

    const lineLikelihood: any = d3
      .line<AggregatedData>()
      .x((d) => x(d._id) || 0)
      .y((d) => y(d.avgLikelihood || 0))
      .curve(d3.curveMonotoneX);

    const lineRelevance: any = d3
      .line<AggregatedData>()
      .x((d) => x(d._id) || 0)
      .y((d) => y(d.avgRelevance || 0))
      .curve(d3.curveMonotoneX);

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .tickSize(-(width - margin.left - margin.right))
          .tickFormat(() => "")
      )
      .attr("stroke-opacity", 0.1);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", colors.tooltipBg)
      .style("color", colors.tooltipText)
      .style("padding", "10px")
      .style("border-radius", "8px")
      .style("font-size", "12px")
      .style("pointer-events", "none")
      .style("z-index", "1000")
      .style("border", `1px solid ${colors.tooltipBorder}`);

    const pathIntensity = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 3)
      .attr("d", lineIntensity);

    const pathLikelihood = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#10b981")
      .attr("stroke-width", 3)
      .attr("d", lineLikelihood);

    const pathRelevance = svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f59e0b")
      .attr("stroke-width", 3)
      .attr("d", lineRelevance);

    const totalLengthIntensity = pathIntensity.node()?.getTotalLength() || 0;
    const totalLengthLikelihood = pathLikelihood.node()?.getTotalLength() || 0;
    const totalLengthRelevance = pathRelevance.node()?.getTotalLength() || 0;

    pathIntensity
      .attr(
        "stroke-dasharray",
        `${totalLengthIntensity} ${totalLengthIntensity}`
      )
      .attr("stroke-dashoffset", totalLengthIntensity)
      .transition()
      .duration(2000)
      .attr("stroke-dashoffset", 0);

    pathLikelihood
      .attr(
        "stroke-dasharray",
        `${totalLengthLikelihood} ${totalLengthLikelihood}`
      )
      .attr("stroke-dashoffset", totalLengthLikelihood)
      .transition()
      .duration(2000)
      .delay(200)
      .attr("stroke-dashoffset", 0);

    pathRelevance
      .attr(
        "stroke-dasharray",
        `${totalLengthRelevance} ${totalLengthRelevance}`
      )
      .attr("stroke-dashoffset", totalLengthRelevance)
      .transition()
      .duration(2000)
      .delay(400)
      .attr("stroke-dashoffset", 0);

    svg
      .selectAll(".dot-intensity")
      .data(data)
      .join("circle")
      .attr("class", "dot-intensity")
      .attr("cx", (d) => x(d._id) || 0)
      .attr("cy", (d) => y(d.avgIntensity || 0))
      .attr("r", 0)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function (event: any, d: AggregatedData) {
        d3.select(this).attr("r", 8);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>Year: ${
              d._id
            }</strong><br/>Intensity: ${d.avgIntensity?.toFixed(
              2
            )}<br/>Likelihood: ${d.avgLikelihood?.toFixed(
              2
            )}<br/>Relevance: ${d.avgRelevance?.toFixed(2)}`
          );
      })
      .on("mousemove", function (event: any) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 5);
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(500)
      .delay((_: AggregatedData, i: number) => i * 100 + 2000)
      .attr("r", 5);

    svg
      .selectAll(".dot-likelihood")
      .data(data)
      .join("circle")
      .attr("class", "dot-likelihood")
      .attr("cx", (d) => x(d._id) || 0)
      .attr("cy", (d) => y(d.avgLikelihood || 0))
      .attr("r", 0)
      .attr("fill", "#10b981")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function (event: any, d: AggregatedData) {
        d3.select(this).attr("r", 8);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>Year: ${
              d._id
            }</strong><br/>Likelihood: ${d.avgLikelihood?.toFixed(2)}`
          );
      })
      .on("mousemove", function (event: any) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 5);
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(500)
      .delay((_: AggregatedData, i: number) => i * 100 + 2200)
      .attr("r", 5);

    svg
      .selectAll(".dot-relevance")
      .data(data)
      .join("circle")
      .attr("class", "dot-relevance")
      .attr("cx", (d) => x(d._id) || 0)
      .attr("cy", (d) => y(d.avgRelevance || 0))
      .attr("r", 0)
      .attr("fill", "#f59e0b")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .on("mouseover", function (event: any, d: AggregatedData) {
        d3.select(this).attr("r", 8);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>Year: ${
              d._id
            }</strong><br/>Relevance: ${d.avgRelevance?.toFixed(2)}`
          );
      })
      .on("mousemove", function (event: any) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("r", 5);
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(500)
      .delay((_: AggregatedData, i: number) => i * 100 + 2400)
      .attr("r", 5);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", colors.text)
      .attr("font-size", "12px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .attr("color", colors.text);

    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right + 10}, ${margin.top})`
      );

    const legendData = [
      { label: "Intensity", color: "#3b82f6" },
      { label: "Likelihood", color: "#10b981" },
      { label: "Relevance", color: "#f59e0b" },
    ];

    legendData.forEach((item, i) => {
      const legendRow = legend
        .append("g")
        .attr("transform", `translate(0, ${i * 25})`);

      legendRow
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", item.color)
        .attr("rx", 3);

      legendRow
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .attr("fill", colors.text)
        .attr("font-size", "12px")
        .text(item.label);
    });

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .text("Year");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .text("Average Value");

    return () => {
      tooltip.remove();
    };
  }, [data, isDark]);

  if (loading) {
    return (
      <div className="card h-[450px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 gradient-text">
        Year-wise Trend Analysis
      </h3>
      <div className="flex justify-center overflow-x-auto">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default YearTrendChart;

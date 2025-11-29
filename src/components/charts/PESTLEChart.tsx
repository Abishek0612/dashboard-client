import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchPESTLEAnalysis } from "../../services/api.service";
import { AggregatedData } from "../../types";
import { Loader2 } from "lucide-react";
import { getChartColors } from "../../utils/chartColors";

interface PESTLEChartProps {
  isDark: boolean;
}

const PESTLEChart = ({ isDark }: PESTLEChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetchPESTLEAnalysis();
      setData(response.data);
    } catch (error) {
      console.error("Error loading PESTLE data:", error);
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
    const margin = { top: 40, right: 140, bottom: 60, left: 60 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d._id))
      .range([margin.left, width - margin.right])
      .padding(0.3);

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

    const barWidth = x.bandwidth() / 3;

    svg
      .selectAll(".bar-intensity")
      .data(data)
      .join("rect")
      .attr("class", "bar-intensity")
      .attr("x", (d) => x(d._id) || 0)
      .attr("width", barWidth)
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("fill", "#3b82f6")
      .attr("rx", 4)
      .on("mouseover", function (event: any, d: AggregatedData) {
        d3.select(this).attr("opacity", 0.7);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${d._id}</strong><br/>Intensity: ${d.avgIntensity?.toFixed(
              2
            )}`
          );
      })
      .on("mousemove", function (event: any) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(800)
      .delay((_: AggregatedData, i: number) => i * 100)
      .attr("y", (d) => y(d.avgIntensity || 0))
      .attr("height", (d) => height - margin.bottom - y(d.avgIntensity || 0));

    svg
      .selectAll(".bar-likelihood")
      .data(data)
      .join("rect")
      .attr("class", "bar-likelihood")
      .attr("x", (d) => (x(d._id) || 0) + barWidth)
      .attr("width", barWidth)
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("fill", "#10b981")
      .attr("rx", 4)
      .on("mouseover", function (event: any, d: AggregatedData) {
        d3.select(this).attr("opacity", 0.7);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${
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
        d3.select(this).attr("opacity", 1);
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(800)
      .delay((_: AggregatedData, i: number) => i * 100 + 100)
      .attr("y", (d) => y(d.avgLikelihood || 0))
      .attr("height", (d) => height - margin.bottom - y(d.avgLikelihood || 0));

    svg
      .selectAll(".bar-relevance")
      .data(data)
      .join("rect")
      .attr("class", "bar-relevance")
      .attr("x", (d) => (x(d._id) || 0) + barWidth * 2)
      .attr("width", barWidth)
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("fill", "#f59e0b")
      .attr("rx", 4)
      .on("mouseover", function (event: any, d: AggregatedData) {
        d3.select(this).attr("opacity", 0.7);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${d._id}</strong><br/>Relevance: ${d.avgRelevance?.toFixed(
              2
            )}`
          );
      })
      .on("mousemove", function (event: any) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 1);
        tooltip.style("visibility", "hidden");
      })
      .transition()
      .duration(800)
      .delay((_: AggregatedData, i: number) => i * 100 + 200)
      .attr("y", (d) => y(d.avgRelevance || 0))
      .attr("height", (d) => height - margin.bottom - y(d.avgRelevance || 0));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .attr("font-weight", "bold");

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
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .text("PESTLE Categories");

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
      <h3 className="text-xl font-bold mb-4 gradient-text">PESTLE Analysis</h3>
      <div className="flex justify-center overflow-x-auto">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default PESTLEChart;

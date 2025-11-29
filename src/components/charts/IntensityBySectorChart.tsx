import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchIntensityBySector } from "../../services/api.service";
import { AggregatedData } from "../../types";
import { Loader2, AlertCircle } from "lucide-react";
import { getChartColors } from "../../utils/chartColors";

interface IntensityBySectorChartProps {
  isDark: boolean;
}

const IntensityBySectorChart = ({ isDark }: IntensityBySectorChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchIntensityBySector();

      if (!response || !response.data || response.data.length === 0) {
        setError("No data available");
        return;
      }

      setData(response.data);
    } catch (error: any) {
      console.error("Error loading sector data:", error);
      setError(error.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || data.length === 0) return;

    const colors = getChartColors(isDark);
    const containerWidth = containerRef.current.clientWidth;

    d3.select(svgRef.current).selectAll("*").remove();

    const width = Math.min(containerWidth, 550);
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 120, left: 60 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d._id))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.avgIntensity || 0) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3
      .scaleSequential()
      .domain([0, data.length])
      .interpolator(isDark ? d3.interpolateRainbow : d3.interpolateTurbo);

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

    svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", (d) => x(d._id) || 0)
      .attr("width", x.bandwidth())
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("fill", (_: AggregatedData, i: number) => colorScale(i))
      .attr("rx", 6)
      .on("mouseover", function (_: any, d: AggregatedData) {
        d3.select(this).attr("opacity", 0.7);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${
              d._id
            }</strong><br/>Avg Intensity: ${d.avgIntensity?.toFixed(
              2
            )}<br/>Count: ${d.count}`
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
      .delay((_: AggregatedData, i: number) => i * 50)
      .attr("y", (d) => y(d.avgIntensity || 0))
      .attr("height", (d) => height - margin.bottom - y(d.avgIntensity || 0));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("fill", colors.text)
      .attr("font-size", "11px");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .attr("color", colors.text);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .text("Average Intensity");

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

  if (error) {
    return (
      <div className="card h-[450px] flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <p className="text-red-400 text-center">{error}</p>
        <button
          onClick={loadData}
          className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="card h-[450px] flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 gradient-text">
        Intensity by Sector
      </h3>
      <div ref={containerRef} className="flex justify-center overflow-x-auto">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default IntensityBySectorChart;

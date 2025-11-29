import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchDataByCountry } from "../../services/api.service";
import { AggregatedData } from "../../types";
import { Loader2 } from "lucide-react";
import { getChartColors } from "../../utils/chartColors";

interface CountryChartProps {
  isDark: boolean;
}

const CountryChart = ({ isDark }: CountryChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetchDataByCountry();
      setData(response.data.slice(0, 15));
    } catch (error) {
      console.error("Error loading country data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const colors = getChartColors(isDark);

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 550;
    const height = 500;
    const margin = { top: 20, right: 30, bottom: 60, left: 150 };

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count) || 0])
      .nice()
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleBand()
      .domain(data.map((d) => d._id))
      .range([margin.top, height - margin.bottom])
      .padding(0.2);

    const colorScale = d3
      .scaleLinear<string>()
      .domain([0, data.length])
      .range(isDark ? ["#3b82f6", "#8b5cf6"] : ["#2563eb", "#7c3aed"]);

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
      .attr("x", margin.left)
      .attr("y", (d) => y(d._id) || 0)
      .attr("width", 0)
      .attr("height", y.bandwidth())
      .attr("fill", (d, i) => colorScale(i))
      .attr("rx", 4)
      .on("mouseover", function (event, d) {
        d3.select(this).attr("opacity", 0.7);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${d._id}</strong><br/>Count: ${
              d.count
            }<br/>Avg Intensity: ${d.avgIntensity?.toFixed(2)}`
          );
      })
      .on("mousemove", function (event) {
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
      .delay((d, i) => i * 50)
      .attr("width", (d) => x(d.count) - margin.left);

    svg
      .selectAll(".value-label")
      .data(data)
      .join("text")
      .attr("class", "value-label")
      .attr("x", (d) => x(d.count) + 5)
      .attr("y", (d) => (y(d._id) || 0) + y.bandwidth() / 2)
      .attr("dy", "0.35em")
      .attr("fill", colors.text)
      .attr("font-size", "11px")
      .style("opacity", 0)
      .text((d) => d.count)
      .transition()
      .duration(800)
      .delay((d, i) => i * 50 + 400)
      .style("opacity", 1);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .attr("color", colors.text);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll("text")
      .attr("fill", colors.text)
      .attr("font-size", "11px");

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 20)
      .attr("text-anchor", "middle")
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .text("Number of Records");

    return () => {
      tooltip.remove();
    };
  }, [data, isDark]);

  if (loading) {
    return (
      <div className="card h-[550px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 gradient-text">
        Top Countries by Data Count
      </h3>
      <div className="flex justify-center overflow-auto">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default CountryChart;

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchTopicAnalysis } from "../../services/api.service";
import { AggregatedData } from "../../types";
import { Loader2 } from "lucide-react";
import { getChartColors } from "../../utils/chartColors";

interface TopicChartProps {
  isDark: boolean;
}

const TopicChart = ({ isDark }: TopicChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetchTopicAnalysis();
      setData(response.data.slice(0, 12));
    } catch (error) {
      console.error("Error loading topic data:", error);
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
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const pack: any = d3
      .pack()
      .size([
        width - margin.left - margin.right,
        height - margin.top - margin.bottom,
      ])
      .padding(3);

    const root: any = d3
      .hierarchy({ children: data })
      .sum((d: any) => d.count || 0);

    const nodes = pack(root).leaves();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const colorScale = d3
      .scaleSequential()
      .domain([0, data.length])
      .interpolator(isDark ? d3.interpolateCool : d3.interpolateWarm);

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

    const bubbles = svg
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("cx", (d: any) => d.x)
      .attr("cy", (d: any) => d.y)
      .attr("r", 0)
      .attr("fill", (_: any, i: number) => colorScale(i))
      .attr("opacity", 0.8)
      .attr("stroke", isDark ? "#fff" : "#1f2937")
      .attr("stroke-width", 2)
      .on("mouseover", function (_: any, d: any) {
        d3.select(this).attr("opacity", 1).attr("stroke-width", 3);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${d.data._id}</strong><br/>Count: ${
              d.data.count
            }<br/>Avg Intensity: ${d.data.avgIntensity?.toFixed(2)}`
          );
      })
      .on("mousemove", function (event: any) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).attr("opacity", 0.8).attr("stroke-width", 2);
        tooltip.style("visibility", "hidden");
      });

    bubbles
      .transition()
      .duration(800)
      .delay((_: any, i: number) => i * 50)
      .attr("r", (d: any) => d.r);

    svg
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("x", (d: any) => d.x)
      .attr("y", (d: any) => d.y)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", isDark ? "white" : "#1f2937")
      .attr("font-size", (d: any) => Math.min(d.r / 3, 12))
      .attr("font-weight", "bold")
      .attr("pointer-events", "none")
      .style("opacity", 0)
      .text((d: any) => (d.r > 20 ? d.data._id : ""))
      .transition()
      .duration(800)
      .delay(800)
      .style("opacity", 1);

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
        Topic Analysis (Bubble Chart)
      </h3>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default TopicChart;

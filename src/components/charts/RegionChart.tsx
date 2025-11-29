import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { fetchDataByRegion } from "../../services/api.service";
import { AggregatedData } from "../../types";
import { Loader2 } from "lucide-react";
import { getChartColors } from "../../utils/chartColors";

interface RegionChartProps {
  isDark: boolean;
}

const RegionChart = ({ isDark }: RegionChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await fetchDataByRegion();
      setData(response.data);
    } catch (error) {
      console.error("Error loading region data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const colors = getChartColors(isDark);

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 550;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const pieData = data.slice(0, 8);

    const color = d3
      .scaleOrdinal()
      .domain(pieData.map((d) => d._id))
      .range(isDark ? d3.schemeSet3 : d3.schemePastel1);

    const pie = d3
      .pie<AggregatedData>()
      .value((d) => d.count)
      .sort(null);

    const arc: any = d3
      .arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const arcHover: any = d3
      .arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 1.1);

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

    const arcs = svg
      .selectAll("path")
      .data(pie(pieData))
      .join("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data._id) as string)
      .attr("stroke", isDark ? "#1e293b" : "#ffffff")
      .attr("stroke-width", 2)
      .style("opacity", 0)
      .on("mouseover", function (_, d) {
        d3.select(this).transition().duration(200).attr("d", arcHover);
        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${d.data._id}</strong><br/>Count: ${
              d.data.count
            }<br/>Avg Intensity: ${d.data.avgIntensity?.toFixed(2)}`
          );
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY - 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        d3.select(this).transition().duration(200).attr("d", arc);
        tooltip.style("visibility", "hidden");
      });

    arcs
      .transition()
      .duration(800)
      .delay((_, i) => i * 100)
      .style("opacity", 1)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function (t) {
          return arc(interpolate(t)) || "";
        };
      });

    svg
      .selectAll("text")
      .data(pie(pieData))
      .join("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("fill", isDark ? "white" : "#1f2937")
      .attr("font-size", "11px")
      .attr("font-weight", "bold")
      .style("opacity", 0)
      .text((d) => (d.data.count > 5 ? d.data._id : ""))
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
      <div className="card h-[450px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 gradient-text">Data by Region</h3>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default RegionChart;

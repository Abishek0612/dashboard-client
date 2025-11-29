import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DataItem } from "../../types";
import { getChartColors } from "../../utils/chartColors";

interface LikelihoodDistributionProps {
  data: DataItem[];
  isDark: boolean;
}

const LikelihoodDistribution = ({
  data,
  isDark,
}: LikelihoodDistributionProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const colors = getChartColors(isDark);

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 400;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 40 };

    const histogram = d3.bin().domain([0, 5]).thresholds([0, 1, 2, 3, 4, 5]);
    const bins = histogram(data.map((d) => d.likelihood));

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleLinear()
      .domain([0, 5])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(bins, (d) => d.length) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const colorScale = d3
      .scaleSequential()
      .domain([0, bins.length])
      .interpolator(isDark ? d3.interpolateCool : d3.interpolateWarm);

    svg
      .selectAll("rect")
      .data(bins)
      .join("rect")
      .attr("x", (d) => x(d.x0 || 0) + 1)
      .attr("width", (d) => Math.max(0, x(d.x1 || 0) - x(d.x0 || 0) - 2))
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("fill", (_: any, i: number) => colorScale(i))
      .attr("rx", 4)
      .transition()
      .duration(800)
      .delay((_: any, i: number) => i * 100)
      .attr("y", (d) => y(d.length))
      .attr("height", (d) => y(0) - y(d.length));

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr("color", colors.text);

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .attr("color", colors.text);

    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .text("Likelihood Score");

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -height / 2)
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", colors.text)
      .attr("font-size", "12px")
      .text("Frequency");
  }, [data, isDark]);

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 gradient-text">
        Likelihood Distribution
      </h3>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default LikelihoodDistribution;

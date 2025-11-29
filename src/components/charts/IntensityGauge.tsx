import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { DataItem } from "../../types";
import { getChartColors, getGradientColors } from "../../utils/chartColors";

interface IntensityGaugeProps {
  data: DataItem[];
  isDark: boolean;
}

const IntensityGauge = ({ data, isDark }: IntensityGaugeProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const colors = getChartColors(isDark);
    const gradients = getGradientColors(isDark);

    const avgIntensity =
      data.reduce((sum, item) => sum + item.intensity, 0) / data.length;
    const maxIntensity = d3.max(data, (d) => d.intensity) || 10;

    d3.select(svgRef.current).selectAll("*").remove();

    const width = 400;
    const height = 300;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };
    const radius = Math.min(width, height) / 2 - margin.top;

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const arc: any = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2);

    svg
      .append("path")
      .datum({ endAngle: Math.PI / 2 })
      .attr("d", arc)
      .attr("fill", colors.background)
      .attr("opacity", 0.3);

    const percentage = avgIntensity / maxIntensity;
    const endAngle = -Math.PI / 2 + Math.PI * percentage;

    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", `gaugeGradient-${isDark ? "dark" : "light"}`)
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", -radius)
      .attr("y1", 0)
      .attr("x2", radius)
      .attr("y2", 0);

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", gradients.primary[0]);
    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", gradients.primary[1]);

    const path = svg
      .append("path")
      .datum({ endAngle: -Math.PI / 2 })
      .attr("d", arc)
      .attr("fill", `url(#gaugeGradient-${isDark ? "dark" : "light"})`);

    path
      .transition()
      .duration(1500)
      .attrTween("d", function () {
        const interpolate = d3.interpolate(-Math.PI / 2, endAngle);
        return function (t: number) {
          const currentAngle = interpolate(t);
          return arc({ endAngle: currentAngle }) || "";
        };
      });

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.3em")
      .attr("class", "text-4xl font-bold")
      .attr("fill", colors.textPrimary)
      .text(avgIntensity.toFixed(1));

    svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "2.5em")
      .attr("class", "text-sm")
      .attr("fill", colors.text)
      .text("Average Intensity");
  }, [data, isDark]);

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-4 gradient-text">Intensity Gauge</h3>
      <div className="flex justify-center">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};

export default IntensityGauge;

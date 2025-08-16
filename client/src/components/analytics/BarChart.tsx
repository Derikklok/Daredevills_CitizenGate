import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

interface BarChartProps {
	data: Array<{label: string; value: number; color?: string}>;
	width?: number;
	height?: number;
	title?: string;
}

const BarChart: React.FC<BarChartProps> = ({data, width, height, title}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({width: 0, height: 0});

	// Responsive dimensions
	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.offsetWidth;
				const aspectRatio = 0.6; // height/width ratio
				const newWidth = width || containerWidth;
				const newHeight = height || Math.max(250, newWidth * aspectRatio);
				setDimensions({width: newWidth, height: newHeight});
			}
		};

		updateDimensions();
		window.addEventListener("resize", updateDimensions);
		return () => window.removeEventListener("resize", updateDimensions);
	}, [width, height]);

	useEffect(() => {
		if (!data || data.length === 0 || dimensions.width === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		// Responsive margins
		const isMobile = dimensions.width < 480;
		const margin = {
			top: 40,
			right: isMobile ? 20 : 30,
			bottom: isMobile ? 80 : 60,
			left: isMobile ? 40 : 60,
		};

		const chartWidth = dimensions.width - margin.left - margin.right;
		const chartHeight = dimensions.height - margin.top - margin.bottom;

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// Scales
		const xScale = d3
			.scaleBand()
			.domain(data.map((d) => d.label))
			.range([0, chartWidth])
			.padding(0.1);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(data, (d) => d.value) || 0])
			.range([chartHeight, 0]);

		// Color scale
		const colorScale = d3
			.scaleOrdinal()
			.domain(data.map((d) => d.label))
			.range(data.map((d) => d.color || "#3b82f6"));

		// Bars
		g.selectAll(".bar")
			.data(data)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", (d) => xScale(d.label) || 0)
			.attr("width", xScale.bandwidth())
			.attr("y", chartHeight)
			.attr("height", 0)
			.attr("fill", (d) => colorScale(d.label) as string)
			.transition()
			.duration(750)
			.attr("y", (d) => yScale(d.value))
			.attr("height", (d) => chartHeight - yScale(d.value));

		// X Axis
		const xAxis = g
			.append("g")
			.attr("transform", `translate(0, ${chartHeight})`)
			.call(d3.axisBottom(xScale));

		// Rotate labels on mobile for better readability
		if (isMobile) {
			xAxis
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-45)")
				.style("font-size", "12px");
		} else {
			xAxis.selectAll("text").style("font-size", "14px");
		}

		// Y Axis
		g.append("g")
			.call(d3.axisLeft(yScale))
			.selectAll("text")
			.style("font-size", isMobile ? "12px" : "14px");

		// Title
		if (title) {
			svg
				.append("text")
				.attr("x", dimensions.width / 2)
				.attr("y", 25)
				.attr("text-anchor", "middle")
				.style("font-size", isMobile ? "16px" : "18px")
				.style("font-weight", "bold")
				.style("fill", "#374151")
				.text(title);
		}

		// Value labels on bars
		g.selectAll(".bar-label")
			.data(data)
			.enter()
			.append("text")
			.attr("class", "bar-label")
			.attr("x", (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
			.attr("y", (d) => yScale(d.value) - 5)
			.attr("text-anchor", "middle")
			.style("font-size", isMobile ? "11px" : "12px")
			.style("fill", "#374151")
			.style("opacity", 0)
			.text((d) => d.value)
			.transition()
			.delay(750)
			.duration(300)
			.style("opacity", 1);
	}, [data, dimensions]);

	return (
		<div ref={containerRef} className="w-full">
			<svg
				ref={svgRef}
				width={dimensions.width}
				height={dimensions.height}
				className="overflow-visible"
			/>
		</div>
	);
};

export default BarChart;

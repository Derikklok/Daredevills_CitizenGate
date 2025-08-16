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
	const [dimensions, setDimensions] = useState({
		width: width || 320,
		height: height || 240,
	});

	// Responsive resize logic
	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.offsetWidth;
				const newWidth = width || Math.max(320, containerWidth - 32); // 32px for padding
				const newHeight = height || Math.max(240, newWidth * 0.6); // Maintain aspect ratio
				setDimensions({width: newWidth, height: newHeight});
			}
		};

		// Initial size
		handleResize();

		// Add resize listener
		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => window.removeEventListener("resize", handleResize);
	}, [width, height]);

	useEffect(() => {
		if (!data || data.length === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const margin = {top: 40, right: 20, bottom: 60, left: 50}; // Smaller margins for mobile
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
			.attr("y", chartHeight)
			.attr("width", xScale.bandwidth())
			.attr("height", 0)
			.attr("fill", (d) => colorScale(d.label) as string)
			.transition()
			.duration(750)
			.attr("y", (d) => yScale(d.value))
			.attr("height", (d) => chartHeight - yScale(d.value));

		// Add value labels on top of bars
		g.selectAll(".label")
			.data(data)
			.enter()
			.append("text")
			.attr("class", "label")
			.attr("x", (d) => (xScale(d.label) || 0) + xScale.bandwidth() / 2)
			.attr("y", (d) => yScale(d.value) - 5)
			.attr("text-anchor", "middle")
			.style("font-size", "12px")
			.style("fill", "#374151")
			.text((d) => d.value);

		// X Axis
		g.append("g")
			.attr("transform", `translate(0, ${chartHeight})`)
			.call(d3.axisBottom(xScale))
			.selectAll("text")
			.style("text-anchor", "end")
			.attr("dx", "-.8em")
			.attr("dy", ".15em")
			.attr("transform", "rotate(-45)");

		// Y Axis
		g.append("g").call(d3.axisLeft(yScale));

		// Title
		if (title) {
			svg
				.append("text")
				.attr("x", dimensions.width / 2)
				.attr("y", 20)
				.attr("text-anchor", "middle")
				.style("font-size", "16px")
				.style("font-weight", "bold")
				.style("fill", "#1f2937")
				.text(title);
		}
	}, [data, dimensions, title]);

	return (
		<div ref={containerRef} className="w-full">
			<svg
				ref={svgRef}
				width={dimensions.width}
				height={dimensions.height}
				className="w-full h-auto border rounded"
				style={{maxWidth: "100%"}}
			/>
		</div>
	);
};

export default BarChart;

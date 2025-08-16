import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

interface LineChartProps {
	data: Array<{date: string; value: number}>;
	width?: number;
	height?: number;
	title?: string;
}

const LineChart: React.FC<LineChartProps> = ({data, width, height, title}) => {
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
				const newWidth = width || Math.max(320, containerWidth - 32);
				const newHeight = height || Math.max(240, newWidth * 0.6);
				setDimensions({width: newWidth, height: newHeight});
			}
		};

		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [width, height]);

	useEffect(() => {
		if (!data || data.length === 0) return;

		const svg = d3.select(svgRef.current);
		svg.selectAll("*").remove();

		const margin = {top: 40, right: 20, bottom: 60, left: 50};
		const chartWidth = dimensions.width - margin.left - margin.right;
		const chartHeight = dimensions.height - margin.top - margin.bottom;

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// Parse dates
		const parseDate = d3.timeParse("%Y-%m-%d");
		const processedData = data.map((d) => ({
			date: parseDate(d.date) || new Date(),
			value: d.value,
		}));

		// Scales
		const xScale = d3
			.scaleTime()
			.domain(d3.extent(processedData, (d) => d.date) as [Date, Date])
			.range([0, chartWidth]);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(processedData, (d) => d.value) || 0])
			.range([chartHeight, 0]);

		// Line generator
		const line = d3
			.line<{date: Date; value: number}>()
			.x((d) => xScale(d.date))
			.y((d) => yScale(d.value))
			.curve(d3.curveMonotoneX);

		// Add the line
		g.append("path")
			.datum(processedData)
			.attr("fill", "none")
			.attr("stroke", "#3b82f6")
			.attr("stroke-width", 2)
			.attr("d", line);

		// Add dots
		g.selectAll(".dot")
			.data(processedData)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("cx", (d) => xScale(d.date))
			.attr("cy", (d) => yScale(d.value))
			.attr("r", 4)
			.attr("fill", "#3b82f6");

		// X Axis
		g.append("g")
			.attr("transform", `translate(0, ${chartHeight})`)
			.call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d") as any));

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

export default LineChart;

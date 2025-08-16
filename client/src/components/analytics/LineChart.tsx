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
			bottom: isMobile ? 60 : 60,
			left: isMobile ? 50 : 60,
		};

		const chartWidth = dimensions.width - margin.left - margin.right;
		const chartHeight = dimensions.height - margin.top - margin.bottom;

		const g = svg
			.append("g")
			.attr("transform", `translate(${margin.left}, ${margin.top})`);

		// Parse dates
		const parseDate = d3.timeParse("%Y-%m-%d");
		const parsedData = data.map((d) => ({
			date: parseDate(d.date) || new Date(),
			value: d.value,
		}));

		// Scales
		const xScale = d3
			.scaleTime()
			.domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
			.range([0, chartWidth]);

		const yScale = d3
			.scaleLinear()
			.domain([0, d3.max(parsedData, (d) => d.value) || 0])
			.range([chartHeight, 0]);

		// Line generator
		const line = d3
			.line<{date: Date; value: number}>()
			.x((d) => xScale(d.date))
			.y((d) => yScale(d.value))
			.curve(d3.curveMonotoneX);

		// Add the line
		const path = g
			.append("path")
			.datum(parsedData)
			.attr("fill", "none")
			.attr("stroke", "#3b82f6")
			.attr("stroke-width", isMobile ? 2 : 3)
			.attr("d", line);

		// Animate the line
		const totalLength = path.node()?.getTotalLength() || 0;
		path
			.attr("stroke-dasharray", totalLength + " " + totalLength)
			.attr("stroke-dashoffset", totalLength)
			.transition()
			.duration(1500)
			.attr("stroke-dashoffset", 0);

		// Add dots
		g.selectAll(".dot")
			.data(parsedData)
			.enter()
			.append("circle")
			.attr("class", "dot")
			.attr("cx", (d) => xScale(d.date))
			.attr("cy", (d) => yScale(d.value))
			.attr("r", 0)
			.attr("fill", "#3b82f6")
			.transition()
			.delay((_, i) => i * 50)
			.duration(300)
			.attr("r", isMobile ? 3 : 4);

		// X Axis
		g.append("g")
			.attr("transform", `translate(0, ${chartHeight})`)
			.call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m/%d") as any))
			.selectAll("text")
			.style("font-size", isMobile ? "12px" : "14px");

		// Rotate x-axis labels on mobile if needed
		if (isMobile && data.length > 10) {
			g.select(".x-axis")
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-45)");
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

		// Add grid lines for better readability on mobile
		if (isMobile) {
			// Horizontal grid lines
			g.selectAll(".grid-line")
				.data(yScale.ticks(5))
				.enter()
				.append("line")
				.attr("class", "grid-line")
				.attr("x1", 0)
				.attr("x2", chartWidth)
				.attr("y1", (d) => yScale(d))
				.attr("y2", (d) => yScale(d))
				.attr("stroke", "#e5e7eb")
				.attr("stroke-width", 1)
				.attr("opacity", 0.5);
		}
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

export default LineChart;

import React, {useEffect, useRef, useState} from "react";
import * as d3 from "d3";

interface DonutChartProps {
	data: Array<{label: string; value: number; color?: string}>;
	width?: number;
	height?: number;
	title?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
	data,
	width,
	height,
	title,
}) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState({
		width: width || 280,
		height: height || 280,
	});

	// Responsive resize logic
	useEffect(() => {
		const handleResize = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.offsetWidth;
				const size = width || Math.min(containerWidth - 32, 400); // Square aspect ratio
				setDimensions({width: size, height: height || size});
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

		const radius = Math.min(dimensions.width, dimensions.height) / 2 - 40;
		const innerRadius = radius * 0.5;

		const g = svg
			.append("g")
			.attr(
				"transform",
				`translate(${dimensions.width / 2}, ${dimensions.height / 2})`
			);

		// Color scale
		const colorScale = d3
			.scaleOrdinal()
			.domain(data.map((d) => d.label))
			.range(
				data.map((d) => d.color || d3.schemeCategory10[data.indexOf(d) % 10])
			);

		// Pie generator
		const pie = d3
			.pie<{label: string; value: number}>()
			.value((d) => d.value)
			.sort(null);

		// Arc generator
		const arc = d3
			.arc<d3.PieArcDatum<{label: string; value: number}>>()
			.innerRadius(innerRadius)
			.outerRadius(radius);

		const labelArc = d3
			.arc<d3.PieArcDatum<{label: string; value: number}>>()
			.innerRadius(radius + 10)
			.outerRadius(radius + 10);

		// Create arcs
		const arcs = g
			.selectAll(".arc")
			.data(pie(data))
			.enter()
			.append("g")
			.attr("class", "arc");

		// Add paths
		arcs
			.append("path")
			.attr("d", arc)
			.attr("fill", (d) => colorScale(d.data.label) as string)
			.style("opacity", 0.8)
			.on("mouseover", function () {
				d3.select(this).style("opacity", 1);
			})
			.on("mouseout", function () {
				d3.select(this).style("opacity", 0.8);
			});

		// Add labels
		arcs
			.append("text")
			.attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
			.attr("text-anchor", "middle")
			.style("font-size", "12px")
			.style("font-weight", "bold")
			.style("fill", "#374151")
			.text((d) => (d.data.value > 0 ? d.data.label : ""));

		// Add percentage labels
		arcs
			.append("text")
			.attr("transform", (d) => `translate(${arc.centroid(d)})`)
			.attr("text-anchor", "middle")
			.style("font-size", "12px")
			.style("fill", "white")
			.style("font-weight", "bold")
			.text((d) => {
				const total = data.reduce((sum, item) => sum + item.value, 0);
				const percentage =
					total > 0 ? ((d.data.value / total) * 100).toFixed(1) : 0;
				return d.data.value > 0 ? `${percentage}%` : "";
			});

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

		// Legend
		const legend = svg
			.append("g")
			.attr("class", "legend")
			.attr("transform", `translate(20, ${dimensions.height - 100})`);

		const legendItems = legend
			.selectAll(".legend-item")
			.data(data)
			.enter()
			.append("g")
			.attr("class", "legend-item")
			.attr("transform", (_, i) => `translate(0, ${i * 20})`);

		legendItems
			.append("rect")
			.attr("width", 15)
			.attr("height", 15)
			.attr("fill", (d) => colorScale(d.label) as string);

		legendItems
			.append("text")
			.attr("x", 20)
			.attr("y", 12)
			.style("font-size", "12px")
			.style("fill", "#374151")
			.text((d) => `${d.label}: ${d.value}`);
	}, [data, dimensions, title]);

	return (
		<div ref={containerRef} className="w-full flex justify-center">
			<svg
				ref={svgRef}
				width={dimensions.width}
				height={dimensions.height}
				className="border rounded"
				style={{maxWidth: "100%"}}
			/>
		</div>
	);
};

export default DonutChart;

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
	const [dimensions, setDimensions] = useState({width: 0, height: 0});

	// Responsive dimensions
	useEffect(() => {
		const updateDimensions = () => {
			if (containerRef.current) {
				const containerWidth = containerRef.current.offsetWidth;
				const size = width || Math.min(containerWidth, 400);
				setDimensions({width: size, height: height || size});
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

		const isMobile = dimensions.width < 400;
		const radius =
			Math.min(dimensions.width, dimensions.height) / 2 - (isMobile ? 30 : 40);
		const innerRadius = radius * (isMobile ? 0.4 : 0.5);

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

		// Create arcs
		const arcs = g
			.selectAll(".arc")
			.data(pie(data))
			.enter()
			.append("g")
			.attr("class", "arc");

		// Add the paths
		arcs
			.append("path")
			.attr("d", arc)
			.attr("fill", (d) => colorScale(d.data.label) as string)
			.attr("stroke", "white")
			.attr("stroke-width", 2)
			.style("opacity", 0)
			.transition()
			.duration(750)
			.style("opacity", 1);

		// Add percentage labels on larger screens
		if (!isMobile) {
			const total = d3.sum(data, (d) => d.value);
			arcs
				.append("text")
				.attr("transform", (d) => `translate(${arc.centroid(d)})`)
				.attr("text-anchor", "middle")
				.style("font-size", "12px")
				.style("font-weight", "bold")
				.style("fill", "white")
				.style("opacity", 0)
				.text((d) => {
					const percentage = ((d.data.value / total) * 100).toFixed(1);
					return parseFloat(percentage) > 5 ? `${percentage}%` : "";
				})
				.transition()
				.delay(750)
				.duration(300)
				.style("opacity", 1);
		}

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

		// Legend
		const legend = svg
			.append("g")
			.attr("class", "legend")
			.attr(
				"transform",
				isMobile
					? `translate(10, ${dimensions.height - 20 * data.length - 10})`
					: `translate(${dimensions.width - 120}, 40)`
			);

		const legendItems = legend
			.selectAll(".legend-item")
			.data(data)
			.enter()
			.append("g")
			.attr("class", "legend-item")
			.attr("transform", (_, i) => `translate(0, ${i * (isMobile ? 18 : 20)})`);

		legendItems
			.append("rect")
			.attr("width", isMobile ? 12 : 15)
			.attr("height", isMobile ? 12 : 15)
			.attr("fill", (d) => colorScale(d.label) as string)
			.attr("rx", 2);

		legendItems
			.append("text")
			.attr("x", isMobile ? 18 : 20)
			.attr("y", isMobile ? 10 : 12)
			.style("font-size", isMobile ? "12px" : "14px")
			.style("fill", "#374151")
			.text((d) => {
				const maxLength = isMobile ? 15 : 20;
				return d.label.length > maxLength
					? d.label.substring(0, maxLength) + "..."
					: d.label;
			});

		// Add value text on mobile in legend
		if (isMobile) {
			legendItems
				.append("text")
				.attr("x", 0)
				.attr("y", -2)
				.style("font-size", "10px")
				.style("fill", "#6b7280")
				.text((d) => `(${d.value})`);
		}

		// Add hover effects on desktop
		if (!isMobile) {
			arcs
				.on("mouseover", function () {
					d3.select(this)
						.select("path")
						.transition()
						.duration(200)
						.attr("transform", "scale(1.05)");
				})
				.on("mouseout", function () {
					d3.select(this)
						.select("path")
						.transition()
						.duration(200)
						.attr("transform", "scale(1)");
				});
		}
	}, [data, dimensions]);

	return (
		<div ref={containerRef} className="w-full flex justify-center">
			<svg
				ref={svgRef}
				width={dimensions.width}
				height={dimensions.height}
				className="overflow-visible"
			/>
		</div>
	);
};

export default DonutChart;

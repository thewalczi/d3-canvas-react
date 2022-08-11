import React, { useEffect, useRef } from 'react'
import * as d3 from "d3";


export const BarChart = ({data}) => {
	const chartRef = useRef(null);

	const svgWidth = 800;
	const svgHeight = 600;
	const scale = 20;
	const barWidth = 40;
	const barGap = 5;
	
	useEffect(() => {
		d3.selectAll('svg').remove()

		const svg = d3.select(chartRef.current)
			.append('svg')
			.attr('width', svgWidth)
			.attr('height', svgHeight)
			.style('border', '1px solid black');

		svg.selectAll('rect')
			.data(data)
			.enter()
				.append('rect')
				.attr('width', barWidth)
				.attr('height', d => d * scale)
				.attr('fill', 'orange')
				.attr('x', (d, i) => i * (barWidth + barGap))
				.attr('y', (d) => svgHeight - d * scale);
		svg.selectAll('text')
			.data(data)
			.enter()
				.append('text')
				.attr('x', (d, i) => i * (barWidth + barGap) + 10)
				.attr('y', (d, i) => svgHeight - d * scale - 10)
				.text(d => d)
	}, []);
  return (
	<div ref={chartRef}></div>
  )
}

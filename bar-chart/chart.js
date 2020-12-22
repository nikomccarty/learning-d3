// Goal:
// Make a bar chart of letter frequency with scaleband
// Make beautiful x-axis label
//
// Resources:
// https://observablehq.com/@d3/bar-chart
// https://observablehq.com/@d3/axis-ticks

async function drawBars() {
	// Import Data
	const dataset = await d3.csv("https://assets.codepen.io/4506684/alphabet.csv", d3.autoType)

	console.table(dataset[0])

	// Add Accessor Functions
	yAccessor = (d) => d.frequency
	xAccessor = (d) => d.letter

	// Set up chart dimensions
	let dimensions = {
		width: 500,
		height: 500,
		margin: {
			top: 15,
			right: 15,
			bottom: 40,
			left: 60
		}
	};

	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right;
	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

	const padding = 0.2

	// Set up wrapper and bound dimensions
	const wrapper = d3
		.select("#wrapper-bar-chart")
		.append("svg")
		.attr("viewBox", [0, 0, dimensions.width, dimensions.height])
		.style("overflow", "visible");

	const bounds = wrapper
		.append("g")
		.style(
			"transform",
			`translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
		);

	// Set up scales
	const xScale = d3.scaleBand()
		.domain(d3.range(dataset.length))
		.range([0, dimensions.boundedWidth])
		.padding(padding)

	const yScale = d3.scaleLinear()
		.domain(d3.extent(dataset, yAccessor))
		.range([dimensions.boundedHeight, 0])
		.nice();

	// Set up and draw axes

	const xAxisGenerator = d3.axisBottom().scale(xScale).tickFormat(i => xAccessor(dataset[i])).tickSizeOuter(0);

	const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(6, "%")

	const xAxis = bounds
		.append("g")
		.call(xAxisGenerator)
		.style("transform", `translateY(${dimensions.boundedHeight}px)`)
		.call(xAxisGenerator)
			

	const yAxis = bounds
		.append("g")
		.call(yAxisGenerator)
		.call(g => g.select('.domain').remove())
		.append("text")
			.attr("x", dimensions.margin.left - 10)
			.attr("y", dimensions.margin.top)
			// .style("transform", "rotate(-90deg)")
			.attr("fill", "currentColor")
			.attr("text-anchor", "end")
			.html("Letter Frequency ↑")

	// const yGrid = g => g 
	// 	.attr('class', 'ygrid')
	// 	.selectAll('line')
	// 	.data(yScale.ticks())
	// 	.join('line')
	// 	.attr('x1', 0)
	// 	.attr('x2', dimensions.boundedWidth)
	// 	.attr('y1', d => yScale(d))
	// 	.attr('y2', d => yScale(d))

	// const ygrid = bounds.append("g").call(yGrid);

	const bars = bounds.selectAll("rect")
		.data(dataset)
		.join("rect")
		.attr("x", (d, i) => xScale(i))
		.attr("y", (d) => yScale(yAccessor(d)))
		.attr("height", d => yScale(0) - yScale(yAccessor(d)))
		.attr("width", xScale.bandwidth())
		.attr("fill", 'steelblue')

}

drawBars();
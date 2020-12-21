async function drawLine() {
	// Import Data
	const dataset = await d3.csv("https://assets.codepen.io/4506684/bitcoin_prices.csv");

	dateParser = d3.timeParse("%m/%e/%Y");

	// Add Accessor Functions
	xAccessor = (d) => dateParser(d.date)
	yAccessor = (d) => d.close;

	console.log(yAccessor(dataset[0]))

	// Set up chart dimensions
	let dimensions = {
		width: window.innerWidth * 0.9,
		height: 400,
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

	// Set up wrapper and bound dimensions
	const wrapper = d3
		.select("#wrapper-two")
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
	const xScale = d3.scaleTime()
		.domain(d3.extent(dataset, xAccessor))
		.range([0, dimensions.boundedWidth])
		.nice();

	const yScale = d3.scaleLog()
		.domain(d3.extent(dataset, yAccessor))
		.range([0, dimensions.boundedHeight])
		.nice();

	// Add bounding box for freezing range

	lunacyPlacement = yScale(15000)
	console.log(lunacyPlacement)

	const lunacyPrice = bounds.append("rect")
		.attr("class", "lunacyPrice")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", dimensions.boundedWidth)
		.attr("height", lunacyPlacement)

	// Set up and draw axes

	const xAxisGenerator = d3.axisBottom().scale(xScale).tickFormat(d3.timeFormat("%b"));

	const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);

	const xAxis = bounds
		.append("g")
		.call(xAxisGenerator)
		.style("transform", `translateY(${dimensions.boundedHeight}px)`);

	const yAxis = bounds.append("g").call(yAxisGenerator);

	const xAxisLabel = xAxis
		.append("text")
		.attr("x", dimensions.boundedWidth / 2)
		.attr("y", dimensions.margin.bottom - 5)
		.attr("fill", "black")
		.style("font-size", "1.4em")
		.html("Date (2019-2020)");

	const yAxisLabel = yAxis
		.append("text")
		.attr("x", -dimensions.boundedHeight / 2)
		.attr("y", -dimensions.margin.left + 10)
		.style("transform", "rotate(-90deg)")
		.style("text-anchor", "middle")
		.attr("fill", "black")
		.style("font-size", "1.4em")
		.html("Bitcoin Price (USD)");

	const lineGenerator = d3.line()
		.x(d => xScale(xAccessor(d)))
		.y(d => yScale(yAccessor(d)))

	const line = bounds
		.append("path")
		.data(dataset)
		.join("path")
		.attr("d", lineGenerator(dataset))
		.attr("fill", "none")
		.attr("stroke", "#af9358")
		.attr("stroke-width", 2);
}

drawLine();
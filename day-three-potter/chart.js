async function drawPotter() {
	// Import Data
	const dataset = await d3.csv("https://assets.codepen.io/4506684/harry_potter.csv", d3.autoType)

	console.table(dataset[0])

	// Add Accessor Functions
	xAccessor = (d) => d.book_mentions
	yAccessor = (d) => d.screen_time

	// Set up chart dimensions
	let dimensions = {
		width: 700,
		height: 700,
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
		.select("#wrapper-three")
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
	const xScale = d3.scaleLog()
		.domain(d3.extent(dataset, xAccessor))
		.range([0, dimensions.boundedWidth])
		.nice();

	const yScale = d3.scaleLog()
		.domain(d3.extent(dataset, yAccessor))
		.range([dimensions.boundedHeight, 0])
		.nice();

	// Add line to show 1:1

	const potterEquiv = bounds.append("line")
		.attr("class", "potter_equiv")
		.attr("x1", xScale(xAccessor(0)))
		.attr("y1", dimensions.boundedHeight)
		.attr("x2", dimensions.boundedWidth)
		.attr("y2", 0);

	// Set up and draw axes

	const xAxisGenerator = d3.axisBottom().scale(xScale);

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
		.html("No. of Book Mentions");

	const yAxisLabel = yAxis
		.append("text")
		.attr("x", -dimensions.boundedHeight / 2)
		.attr("y", -dimensions.margin.left + 20)
		.style("transform", "rotate(-90deg)")
		.style("text-anchor", "middle")
		.attr("fill", "black")
		.style("font-size", "1.4em")
		.html("Screen Time (minutes)");
	
	const underLabel = bounds.append("text")
		.attr("x", dimensions.boundedWidth - 130)
		.attr("y", dimensions.boundedHeight - 20)
		.style("text-anchor", "middle")
		.attr("fill", "black")
		.style("font-size", "1.4em")
		.html("Under-represented in films");


	const overLabel = bounds.append("text")
		.attr("x", 130)
		.attr("y", 20)
		.style("text-anchor", "middle")
		.attr("fill", "black")
		.style("font-size", "1.4em")
		.html("Over-represented in films");

	const dots = bounds.selectAll("circle")
		.data(dataset)
		.join("circle")
		.attr("cx", d => xScale(xAccessor(d)))
		.attr("cy", d => yScale(yAccessor(d)))
		.attr("r", 5)
		.attr("fill", 'steelblue')

}

drawPotter();
async function drawScatter() {
	// Import Data
	const dataset = await d3.json(
		"https://assets.codepen.io/4506684/my_weather_data.json"
	);

	dateParser = d3.timeParse("%Y-%m-%d");

	// Add Accessor Functions
	xAccessor = (d) => d.temperatureLow;
	yAccessor = (d) => d.temperatureMax;
	colorAccessor = (d) => dateParser(d.date);

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
		.select("#wrapper")
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
	const xScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset, xAccessor))
		.range([0, dimensions.boundedWidth])
		.nice();

	const yScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset, yAccessor))
		.range([dimensions.boundedHeight, 0])
		.nice();

	const colorScale = d3
		.scaleLinear()
		.domain(d3.extent(dataset, colorAccessor))
		.range(["#ccc", "#000"]);

	bounds
		.append("circle")
		.attr("cx", dimensions.boundedWidth / 2)
		.attr("cy", dimensions.boundedHeight / 2)
		.attr("r", 20);

	const dots = bounds
		.selectAll("circle")
		.data(dataset)
		.join("circle")
		.attr("cx", (d) => xScale(xAccessor(d)))
		.attr("cy", (d) => yScale(yAccessor(d)))
		.attr("r", 5)
		.attr("fill", (d) => colorScale(colorAccessor(d)));

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
		.html("Minimum Temperature (&deg;F)");

	const yAxisLabel = yAxis
		.append("text")
		.attr("x", -dimensions.boundedHeight / 2)
		.attr("y", -dimensions.margin.left + 30)
		.style("transform", "rotate(-90deg)")
		.style("text-anchor", "middle")
		.attr("fill", "black")
		.style("font-size", "1.4em")
		.html("Maximum Temperature (&deg;F)");

	// function drawDots(dataset, color) {
	//   const dots = bounds.selectAll("circle").data(dataset)

	//   dots.join("circle")
	//       .attr("cx", d => xScale(xAccessor(d)))
	//       .attr("cy", d => yScale(yAccessor(d)))
	//       .attr("r", 5)
	//       .attr("fill", color)
	// }

	// drawDots(dataset, "steelblue")

	// drawDots(dataset.slice(0, 200), "darkgrey")

	// setTimeout(() => {
	//   drawDots(dataset, "steelblue")
	// }, 3000)
}

drawScatter();
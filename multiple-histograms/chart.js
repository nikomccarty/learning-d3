// Goal:
// Make a histogram of humidity values from NYC weather 2018
// Make beautiful x-axis and y-axis label
//
// Resources:
// Wattenberger book

async function drawHistogram() {
	// Import Data
	const dataset = await d3.json("./../my_weather_data.json", d3.autoType)

	// Set up chart dimensions
	const width = 600

	let dimensions = {
		width: width,
		height: width * 0.6,
		margin: {
			top: 30,
			right: 10,
			bottom: 50,
			left: 50
		}
	};

	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right;
	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

	const barPadding = 1

	const drawCharts = metric => {
		// Add Accessor Functions
		const metricAccessor = d => d[metric]
		const yAccessor = d => d.length

		const wrapper = d3.select("#wrapper-histogram")
		.append("svg")
		.attr("viewBox", [0, 0, dimensions.width, dimensions.height])
		.style("overflow", "visible");

		const bounds = wrapper.append("g")
			.style("transform", `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`);

		// Set up scales
		const xScale = d3.scaleLinear()
			.domain(d3.extent(dataset, metricAccessor))
			.range([0, dimensions.boundedWidth])
			.nice()

		const binsGenerator = d3.histogram()
			.domain(xScale.domain())
			.value(metricAccessor)
			.thresholds(10)

		const bins = binsGenerator(dataset)

		const yScale = d3.scaleLinear()
			.domain([0, d3.max(bins, yAccessor)])
			.range([dimensions.boundedHeight, 0])
			.nice()

		// Draw data 
		const binsGroup = bounds.append("g")
		const binGroups = binsGroup.selectAll("g")
			.data(bins)
			.join("g")

		console.log(bins)

		const barRects = binGroups.append("rect")
			.attr("x", d => xScale(d.x0) + barPadding / 2)
			.attr("y", d => yScale(yAccessor(d)))
			.attr("width", d => d3.max([
				0,
				xScale(d.x1) - xScale(d.x0) - barPadding
			]))
			.attr("height", d => dimensions.boundedHeight 
				- yScale(yAccessor(d)))
			.attr("fill", "steelblue")

		// Set up and draw axes

		const barText = binGroups.filter(yAccessor)
			.append("text")
			.attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
			.attr("y", d => yScale(yAccessor(d)) - 5)
			.text(yAccessor)
			.style("text-anchor", "middle")
			.attr("fill", "darkgrey")
			.style("font-size", "12px")
			.style("font-family", "sans-serif")
			.style("opacity", 1)

		// Add a line for the mean 
		const mean = d3.mean(dataset, metricAccessor)
		const meanRound = d3.format(".2f")(mean)
		const meanLine = bounds.append("line")
			.attr("class", "meanline")
			.attr("x1", d => xScale(mean))
			.attr("x2", d => xScale(mean))
			.attr("y1", dimensions.boundedHeight)
			.attr("y2", -7)
			
		const meanText = bounds.append("text")
				.attr("x", d => xScale(meanRound))
				.attr("y", -10)
				.html(`mean ≈ ${meanRound}`)
				.style("text-anchor", "middle")
				.style("font-family", "sans-serif")
				.style("font-size", "12px")
				.attr("fill", "black")

		const xAxisGenerator = d3.axisBottom().scale(xScale)

		const xAxis = bounds
			.append("g")
			.call(xAxisGenerator)
			.style("transform", `translateY(${dimensions.boundedHeight}px)`)
			.call(xAxisGenerator)
		
		const xAxisLabel = xAxis.append("text")
			.attr("x", dimensions.boundedWidth / 2)
			.attr("y", dimensions.margin.bottom - 10)
			.attr("fill", "black")
			.style("font-size", "1.4em")
			.text(metric)
	}

	const metrics = [
		"windSpeed",
		"moonPhase",
		"dewPoint",
		"humidity",
		"uvIndex",
		"windBearing",
		"temperatureMin",
		"temperatureMax",
	]

	metrics.forEach(drawCharts)
}

drawHistogram()




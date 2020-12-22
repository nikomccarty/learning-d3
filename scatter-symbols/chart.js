// Scatterplot of iris.csv
// Symbols and colors used to denote each species
// Add a grid
// Add x and y labels positioned accordingly, with arrows.

// To make this chart, I used: https://observablehq.com/@d3/scatterplot-with-shapes and https://observablehq.com/@jeantimex/simple-line-chart-with-grid-lines

async function drawScatterSymbols() {
	// Import Data
	const dataset = await d3.csv("https://assets.codepen.io/4506684/iris.csv", d3.autoType)

	console.table(dataset[0])

	// Add Accessor Functions
	xAccessor = (d) => d.sepal_length
	yAccessor = (d) => d.sepal_width

	// console.log(xAccessor(dataset(i)))

	// Set up chart dimensions
	let dimensions = {
		width: 600,
		margin: {
			top: 15,
			right: 15,
			bottom: 40,
			left: 60
		}
	};

	dimensions.height = dimensions.width;

	dimensions.boundedWidth =
		dimensions.width - dimensions.margin.left - dimensions.margin.right;
	dimensions.boundedHeight =
		dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

	// Set up wrapper and bound dimensions
	const wrapper = d3
		.select("#wrapper-scatter-symbols")
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
	const xScale = d3.scaleLinear()
		.domain(d3.extent(dataset, xAccessor))
		.range([0, dimensions.boundedWidth])
		.nice();

	const yScale = d3.scaleLinear()
		.domain(d3.extent(dataset, yAccessor))
		.range([dimensions.boundedHeight, 0])
		.nice();

	const shape = d3.scaleOrdinal(dataset.map(d => d.species), d3.symbols.map(s => d3.symbol().type(s)()))
	const color = d3.scaleOrdinal(d3.schemeCategory10)
	
	// Set up grids 
	const xGrid = g => g 
		.attr('class', 'grid-lines')
		.selectAll('line')
		.data(xScale.ticks())
		.join('line')
		.attr('x1', d => xScale(d))
		.attr('x2', d => xScale(d))
		.attr('y1', 0)
		.attr('y2', dimensions.boundedHeight)

	const yGrid = g => g
		.attr('class', 'grid-lines')
		.selectAll('line')
		.data(yScale.ticks())
		.join('line')
		.attr('x1', 0)
		.attr('x2', dimensions.boundedWidth)
		.attr('y1', d => yScale(d))
		.attr('y2', d => yScale(d))
				
	
	// Set up and draw axes

	const xAxisGenerator = d3.axisBottom().scale(xScale);

	const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4);

	const xAxis = bounds
		.append("g")
		.call(xAxisGenerator)
		.style("transform", `translateY(${dimensions.boundedHeight}px)`)
		.call(g => g.select('.domain').remove())
		.append("text")
			.attr("x", dimensions.width - 80)
			.attr("y", dimensions.margin.bottom - 4)
			.attr("fill", "currentColor")
			.attr("text-anchor", "end")
			.html("Sepal Length (cm) →")

	const yAxis = bounds
		.append("g")
		.call(yAxisGenerator)
		.call(g => g.select('.domain').remove())
		.append("text")
			.attr("x", -dimensions.margin.top)
			.attr("y", -dimensions.margin.left + 30)
			.style("transform", "rotate(-90deg)")
			.attr("fill", "currentColor")
			.attr("text-anchor", "end")
			.html("Sepal Width (cm) →")

	const xgrid = bounds.append("g").call(xGrid)
	const ygrid = bounds.append("g").call(yGrid)

	const symbols = bounds.append("g")
			.attr("stroke-width", 1)
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
		.selectAll("path")
		.data(dataset)
		.join("path")
			.attr("class", "symbols")
			.attr("transform", d => `translate(${xScale(xAccessor(d))}, ${yScale(yAccessor(d))})`)
			.attr("fill", d => color(d.species))
			.attr("d", d => shape(d.species))

}

drawScatterSymbols();
async function drawChart() {

	const data = await d3.csv("data.csv", d3.autoType)
	console.log(data[0])

	const xAccessor = d => d.xpoint;
	const yAccessor = d => d.ypoint;


	console.log(xAccessor(data[0]))
	console.log(yAccessor(data[50]))

	const margin = {top: 5, right: 5, bottom: 20, left: 20};
	const width = 450 - margin.left - margin.right;
	const height = 450 - margin.top - margin.bottom;

  	var svg = d3.select("#wrapper").append("svg")
	  .attr("width", width + margin.left + margin.right)
	  .attr("height", height + margin.top + margin.bottom)
	.append("g")
	  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  	var xScale = d3.scaleLinear()
	  .domain(d3.extent(data, xAccessor))
	  .range([0,width])
	  .nice();

  	var yScale = d3.scaleLinear()
	  .domain(d3.extent(data, yAccessor))
	  .range([height,0])
	  .nice();

  var xAxis = d3.axisBottom()
	  .scale(xScale);

  var yAxis = d3.axisLeft()
	  .scale(yScale);

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", `translate(0, ${height})`)
		.call(xAxis)

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);

	const dots = svg
		.selectAll("circle")
		.data(data)
		.join("circle")
		.attr("cx", (d) => xScale(xAccessor(d)))
		.attr("cy", (d) => yScale(yAccessor(d)))
		.attr("r", 5)
		.attr("fill", "steelblue");
		
		const type = d3.annotationCalloutElbow

	
	const addedLine = svg.append("line")
			.attr("x1", xScale(xAccessor(data[40])))
			.attr("x2", xScale(xAccessor(data[40])))
			.attr("y1", height)
			.attr("y2", 0)
			.attr("stroke", "black")

	const addedHorizontal = svg.append("line")
			.attr("x1", xScale(0))
			.attr("x2", xScale(width))
			.attr("y1", yAccessor(data[40]))
			.attr("y2", yAccessor(data[40]))
			.attr("stroke", "black")

	const annotations = [{
		note: {
			label: "Longer text to show text wrapping",
			title: "Annotations :)"
		},
		//can use x, y directly instead of data
		data: {xpoint: 8.994238858, ypoint: 83.04809322 },
		dy: 0,
		dx: 0
		}]

	
	// prints 8.994238858, 83.04809322
	console.log(xAccessor(data[40]), yAccessor(data[40]))


	const makeAnnotations = d3.annotation()
		.editMode(true)
		.textWrap(100)
		.notePadding(15)
		.type(type)
		.accessors({
			x: d => xScale(xAccessor(d)),
			y: d => yScale(yAccessor(d))
		})
		.accessorsInverse({
			x: d => xScale.invert(d.xpoint),
			y: d => yScale.invert(d.ypoint)
		})
		.annotations(annotations)

	d3.select("svg")
		.append("g")
		.attr("class", "annotation-group")
		.call(makeAnnotations);

}
drawChart()
function makeChart(dataset) {
	let w = 900;
	let h = 450;
	let marginT = 0;
	let marginL = 40;
	let marginR = 40;
	let marginB = 70;

	//bar width = (width of chart - margins ) / length of dataset  - padding
	let barwidth = (w - (marginL + marginR)) / (dataset.length) - 15;

	let chart = d3.select('#stackedbar')
		.attr('width', w)
		.attr('height', h);

	let xScale = d3.scaleBand()
		.domain(dataset.map(d => d.country))
		.range([marginL, w - marginR]);

	let yScale = d3.scaleLinear()
		.domain([0, d3.max(dataset, d => d.public)])
		.range([h - marginB, marginT]);
	
	console.log(d3.max(dataset, d => d.public));

	let xAxis = d3.axisBottom(xScale);
	let yAxis = d3.axisLeft(yScale);

	let stack = d3.stack()
		.keys(['public', 'private'])
		.order(d3.stackOrderAscending);

	let stackedData = stack(dataset);

	//draw the stacked group
	let groups = chart.selectAll('g')
		.data(stackedData)
		.enter()
		.append('g')
		.style('fill', function (d, i) {
			if (i % 2 == 0) {
				return '#fdbe85';
			} else {
				return '#ff5e00';
			}
		});

	groups.selectAll('rect')
		.data(d => d)
		.enter()
		.append('rect')
		.attr('x', d => xScale(d.data.country))
		.attr('y', d => yScale(d[1]))
		.attr('width', barwidth)
		.attr('height', d => yScale(d[0]) - yScale(d[1]))
		.attr('transform', `translate(47, 0)`);

	//AXES
	chart.append('g')
		.attr('transform', `translate(40, ${h-marginB})`)
		.call(xAxis)
		.selectAll('text')
		.attr("transform", "rotate(45)")
		.style("text-anchor", "start");

	chart.append('g')
		.attr('transform', `translate(80, 0)`)
		.call(yAxis);

	//LABELS

	//x-axis
	chart.append("text")
		.attr("class", "labels")
		.attr("x", h)
		.attr("y", (w / 2))
		.style("text-anchor", "middle")
		.text("Countries");

	//y-axis
	chart.append('text')
		.attr('class', 'labels')
		.attr("transform", "rotate(-90)")
		.attr("x", -(h - marginB) / 2)
		.attr("y", 30)
		.style("text-anchor", "middle")
		.text("Percentage Spent");
}


window.onload = function () {
	let dataset;

	d3.json('../datasets/health.json')
		.then((json) => {
			dataset = json;
			console.log(dataset);
			makeChart(dataset);
		});
}
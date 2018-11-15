function rowConverter(row) {
  return {
		score: row.score,
		hours: row.hours,
	}
}

function makeChart(dataset) {
	
	let w = 700;
	let h = 350;
	
	let marginT = 20;
	let marginL = 40;
	let marginR = 50;
	let marginB = 50;
	
	let tooltip = d3.select("body").append("div").attr('id', 'tooltip').style("opacity", 0);
	
	let chart = d3.select('#scatterplotchart')
		.attr('width', w)
		.attr('height', h);
	
	let xScale = d3.scaleLinear()
		.domain([Number(d3.min(dataset, d=> d.score))-2, 100])
		.range([marginL, w - marginR]);

	let yScale =
		d3.scaleLinear()
		.domain([0, Number(d3.max(dataset, d => d.hours))+2])
		.range([h - marginB, marginT]);
	
	let xAxis = d3.axisBottom(xScale);
	let yAxis = d3.axisLeft(yScale);
	xAxis.ticks(15);
	yAxis.ticks(5);
	
	chart.selectAll('circle')
		.data(dataset)
		.enter()
		.append('circle')
		.attr('cx', d=> xScale(d.score))
		.attr('cy', d=> yScale(d.hours))
		.attr('r', 8)
		.attr('fill', '#71d6a7')
		.attr('transform', `translate(30,0)`)
		.on('mousemove', function (d) {

			d3.select(this)
				.transition("fill")
				.duration(250)
				.style('fill', '#efa38c')
				.style('cursor', 'pointer');

			tooltip
				.style('left', (d3.event.pageX) - 50 + "px")
				.style('top', (d3.event.pageY) - 40 + "px")
				.text( d.score + ", " + d.hours)
				.transition("tooltip")
				.duration(200)
				.style("opacity", .8);
		})
		.on('mouseout', function (d) {
			d3.select(this)
				.transition("fill")
				.duration(250)
				.style('fill', '#71d6a7');

			tooltip
				.transition("tooltip")
				.duration(500)
				.style("opacity", 0);
		});
	
	//AXES
	chart.append('g')
		.attr('transform', `translate(30, ${h-marginB})`)
		.attr('color', '#737373')
		.call(xAxis);

	chart.append('g')
		.attr('transform', `translate(70, 0)`)
		.attr('color', '#737373')
		.call(yAxis);

	// LABELS
	//x-axis
	chart.append("text")
		.attr("class", "labels")
		.attr("x", w / 2)
		.attr("y", h - 10)
		.style("text-anchor", "middle")
		.text("Scores");
	
	//y-axis
	chart.append("text")
		.attr("class", "labels")
		.attr("transform", "rotate(-90)")
		.attr("x", -(h - marginB) / 2)
		.attr("y", 30)
		.style("text-anchor", "middle")
		.text("Study Hours");
}


window.onload = function () {
	d3.csv('../datasets/test_score.csv', rowConverter)
		.then((d) => {
			dataset = d;
			makeChart(dataset)
		});
	chartlink();
}
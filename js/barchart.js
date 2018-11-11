function rowConverter(row) {
	return {
		class: row.class,
		boxtops: parseInt(row.boxtops),
	}
};

let dataset;

function makeChart(dataset) {

	let w = 700;
	let h = 300;
	let marginT = 20;
	let marginL = 40;
	let marginR = 50;
	let marginB = 50;

	let tooltip = d3.select("body").append("div").attr('id', 'tooltip').style("opacity", 0);

	//bar width = (width of chart - margins ) / length of dataset  - padding
	let barwidth = (w - (marginL + marginR)) / (dataset.length) - 30;

	//set overall chart size
	let chart = d3.select('#barchart')
		.attr('width', w)
		.attr('height', h);

	let xScale = d3.scaleLinear()
		.domain([0, 11])
		.range([marginL, w - marginR]);

	let yScale =
		d3.scaleLinear()
		.domain([0, d3.max(dataset, d => d.boxtops) + 10])
		.range([h - marginB, marginT]);

	let xAxis = d3.axisBottom(xScale);
	let yAxis = d3.axisLeft(yScale);
	
	//create dotted horizontal lines
	chart.selectAll('.y-grid')
		.data(dataset)
		.enter()
		.append("g")
		.attr("class", "y-grid")
		.style("stroke-dasharray", ("3,3"))
		.attr('transform', `translate(${80},0)`)
		.style('opacity', 0)
		.call(
			d3.axisLeft(yScale)
			.ticks(5)
			.tickSize(-610)
			.tickFormat("")
		)
		.style('opacity', 1);

	//create the bars
	chart.selectAll('rect')
		.data(dataset)
		.enter()
		.append('rect')
		.attr('x', d => xScale(d.class))
		.attr('y', d => yScale(d.boxtops))
		.attr('width', barwidth)
		.attr('height', d => h - yScale(d.boxtops) - marginB)
		.attr('transform', `translate(15,0)`)
		.style('fill', '#8dafef')
		.on('mousemove', function (d) {

			d3.select(this)
				.transition("fill")
				.duration(250)
				.style('fill', '#efa38c')
				.style('cursor', 'pointer');

			tooltip
				.style('left', (d3.event.pageX) - 50 + "px")
				.style('top', (d3.event.pageY) - 40 + "px")
				.text("Collected: " + d.boxtops)
				.transition("tooltip")
				.duration(200)
				.style("opacity", .8);
		})
		.on('mouseout', function (d) {
			d3.select(this)
				.transition("fill")
				.duration(250)
				.style('fill', '#8dafef');

			tooltip
				.transition("tooltip")
				.duration(500)
				.style("opacity", 0);
		});

	xAxis.tickFormat(function (d, i) {
		if (i > 0 && i < 11) return "Class " + d
	});
	
	yAxis.ticks(5);

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
	//y-axis
	chart.append("text")
		.attr("class", "labels")
		.attr("transform", "rotate(-90)")
		.attr("x", -(h - marginB) / 2)
		.attr("y", 30)
		.style("text-anchor", "middle")
		.text("Amount Collected");

	//x-axis
	chart.append("text")
		.attr("class", "labels")
		.attr("x", h)
		.attr("y", (w / 2))
		.style("text-anchor", "middle")
		.text("Classes");
}


window.onload = function () {
	d3.csv('../datasets/boxtops.csv', rowConverter)
		.then((d) => {
			dataset = d;
			makeChart(dataset)
		});
	
	chartlink();
}
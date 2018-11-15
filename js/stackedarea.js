function rowConverter(row) {
	return {
		year: parseDate(row.year),
		latte: parseInt(row.latte),
		brewed_coffee: parseInt(row.brewed_coffee),
		ice_coffee: parseInt(row.ice_coffee),
	}
};

let dataset;
let parseDate = d3.timeParse("%Y");

function makeChart(dataset) {
	let w = 700;
	let h = 350;
	let marginT = 20;
	let marginL = 40;
	let marginR = 50;
	let marginB = 50;
	let color = ['#78c679', '#ffffcc', '#c2e699']
	let tooltip = d3.select("body").append("div").attr('id', 'tooltip').style("opacity", 0);

	//sort the data first!
	dataset.sort((a, b) => b.year - a.year);

	let stack = d3.stack();
	let keys = (['latte', 'brewed_coffee', 'ice_coffee']);
	//.order(d3.stackOrderAscending);

	let chart = d3.select('#stackedareachart')
		.attr('width', w)
		.attr('height', h);

	let xScale = d3.scaleTime()
		.domain([d3.min(dataset, d => d.year), d3.max(dataset, d => d.year)])
		.range([marginL, w - marginR]);

	let yScale = d3.scaleLinear()
		.domain([0, d3.max(dataset, d => {
			let sum = 0;

			for (var i = 0; i < keys.length; i++) {
				sum += d[keys[i]];
			}

			return sum;
		})])
		.range([h - marginB, marginT]);

	let xAxis = d3.axisBottom(xScale);
	let yAxis = d3.axisLeft(yScale);
	xAxis.tickFormat(d3.timeFormat("%Y"));
	yAxis.ticks(5).tickFormat(d => (d / 1000) + "k");


	stack.keys(keys);
	let stackedData = stack(dataset);
	console.log(stackedData);

	let area = d3.area()
		.x(d => xScale(d.data.year))
		.y0(d => yScale(d[0]))
		.y1(d => yScale(d[1]));

	chart.selectAll("path")
		.data(stackedData)
		.enter()
		.append("path")
		.attr("d", area)
		.attr("fill", (d, i) => color[i])
		.style('opacity', 1)
		.attr('transform', `translate(30, 0)`)
		.on('mousemove', function (d) {

			d3.select(this)
				.transition("fill")
				.duration(250)
				.style('cursor', 'pointer');

			tooltip
				.style('left', (d3.event.pageX) - 50 + "px")
				.style('top', (d3.event.pageY) - 40 + "px")
				.text(d.key)
				.transition("tooltip")
				.duration(200)
				.style("opacity", .8);
		})
		.on('mouseout', function (d) {
			d3.select(this)
				.transition("fill")
				.duration(250);

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

	//LABELS

	//x-axis
	chart.append("text")
		.attr("class", "labels")
		.attr("x", w / 2)
		.attr("y", h - 10)
		.style("text-anchor", "middle")
		.text("Years");

	//y-axis
	chart.append('text')
		.attr('class', 'labels')
		.attr("transform", "rotate(-90)")
		.attr("x", -(h - marginB) / 2)
		.attr("y", 30)
		.style("text-anchor", "middle")
		.text("Revnue");
}


window.onload = function () {
	d3.csv('../datasets/drinks.csv', rowConverter)
		.then((d) => {
			dataset = d;
			makeChart(dataset)
		});

	chartlink();
}
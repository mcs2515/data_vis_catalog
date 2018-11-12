function rowConverter(row) {
	return {
		year: row.year,
		developer: parseInt(row.developer),
		designer: parseInt(row.designer),
		teacher: parseInt(row.teacher),
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

	let parseDate = d3.timeParse("%Y");
	
	let stack = d3.stack();
	let keys = (['developer', 'designer', 'teacher']);
	//.order(d3.stackOrderAscending);

	let chart = d3.select('#stackedareachart')
		.attr('width', w)
		.attr('height', h);

	let xScale = d3.scaleTime()
		.domain([d3.min(dataset, d=> parseDate(d.year)), d3.max(dataset, d=>parseDate(d.year))])
		.range([marginL, w - marginR]);

	let yScale = d3.scaleLinear()
		.domain([0, d3.max(dataset, d => {
			let sum = 0;
			
			for(var i = 0; i < keys.length; i++) {
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
		.x(d => xScale(parseDate(d.data.year)))
		.y0(d => yScale(d[0]))
		.y1(d => yScale(d[1]));

	chart.selectAll("path")
		.data(stackedData)
		.enter()
		.append("path")
		.attr("d", area)
		.attr("fill", function(d, i) {
			return d3.schemeCategory10[i];
		})
		.attr('transform', `translate(30, 0)`);

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
		.text("Income");
}


window.onload = function () {
	d3.csv('../datasets/job_income.csv', rowConverter)
		.then((d) => {
			dataset = d;
			makeChart(dataset)
		});

	chartlink();
}
function rowConverter(row) {
	return {
		date: row.date,
		open: parseFloat(row.open),
		high: parseFloat(row.high),
		low: parseFloat(row.low),
		close: parseFloat(row.close),
	}
}

function makeChart(dataset) {
	let w = 700;
	let h = 350;

	let marginT = 20;
	let marginL = 40;
	let marginR = 50;
	let marginB = 50;

	let parseDate = d3.timeParse("%Y-%m-%d");

	let tooltip = d3.select("body").append("div").attr('id', 'tooltip').style("opacity", 0);

	//bar width = (width of chart - margins ) / length of dataset  - padding
	let barwidth = (w - (marginL + marginR)) / (dataset.length) - 30;

	let xScale = d3.scaleTime()
		.domain(d3.extent(dataset, d => parseDate(d.date)))
		.range([marginL, w - marginR]);

	let yScale =
		d3.scaleLinear()
		.domain([90, d3.max(dataset, d => d.high) + 2])
		.range([h - marginB, marginT]);

	let xAxis = d3.axisBottom(xScale);
	let yAxis = d3.axisLeft(yScale);
	yAxis.tickFormat(d => ('$' + d));

	let chart = d3.select('#candlestickchart')
		.attr('width', w)
		.attr('height', h);

	//https://beta.observablehq.com/@mbostock/d3-candlestick-chart?fbclid=IwAR2k08DkTK92G3vLncqId4dbzUpM4etYvy9Av0BrAHJeKmzxU2zyZEjjGSs
	const g = chart.append("g")
		.attr("stroke", "black")
		.selectAll("g")
		.data(dataset)
		.enter()
		.append("g")
		.attr("transform", d => `translate(${xScale(parseDate(d.date))+30},0)`)
		.attr("stroke", d => {
			if (d.open > d.close) {
				return d3.schemeSet1[0];
			} else if (d.close > d.open) {
				return d3.schemeSet1[2];
			} else {
				return d3.schemeSet1[8];
			}
		})
		.attr("y1", d => yScale(d.low))
		.attr("y2", d => yScale(d.high));

	g.append("line")
		.attr("y1", d => yScale(d.low))
		.attr("y2", d => yScale(d.high))
		.attr("stroke-width", 2);

	g.append('line')
		.attr("y1", d => yScale(d.open))
		.attr("y2", d => yScale(d.close))
		.attr("stroke-width", 8);

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
		.text("Classes");

	//y-axis
	chart.append("text")
		.attr("class", "labels")
		.attr("transform", "rotate(-90)")
		.attr("x", -(h - marginB) / 2)
		.attr("y", 30)
		.style("text-anchor", "middle")
		.text("Prices");
}


window.onload = function () {
	d3.csv('../datasets/google_stock.csv', rowConverter)
		.then((d) => {
			//get data only from sept 1-30
			d = d.slice(9, 31);
			makeChart(d);
		});
	chartlink();
}
function rowConverter(row) {
	return {
		country: row.country,
		public: parseFloat(row.public),
		private: parseFloat(row.private),
	}
}

let dataset;

function makeChart(dataset) {
	let w = 900;
	let h = 450;
	let marginT = 20;
	let marginL = 20;
	let marginR = 20;
	let marginB = 50;
	let colors = d3.scaleOrdinal(d3.schemeAccent);

	//bar width = (width of chart - margins ) / length of dataset  - padding
	let barwidth = (w - (marginL + marginR)) / (dataset.length) - 15;

	let chart = d3.select('#stackedbar')
		.attr('width', w)
		.attr('height', h);

	let xScale = d3.scaleBand()
		.domain(dataset.map(d => d.country))
		.range(marginL, w - marginR);

	let yScale = d3.scaleLinear()
		.domain([0, d3.max(dataset, d => d.public + d.private)] + 1)
		.domain([h - marginB, marginT]);

	let stack = d3.stack()
		.keys(['public', 'private']);

	let stackedData = stack(dataset);
	console.log(stackedData);

	let groups = chart.selectAll('g')
		.data(stackedData)
		.enter()
		.append('g')
		.style('fill', (d, i) => colors(i));

	groups.selectAll('rect')
		.data(d => d)
		.enter()
		.append('rect')
		.attr('x', d => xScale(d.data.country))
		.attr('y', d => yScale(d[1]))
		.attr('width', barwidth)
		.attr('height', d => yScale(d[0]) - yScale(d[1]));
}


window.onload = function () {
	dataset = [
		{country: 'United States', public: 16.9, private:  9 },
		{country: 'Netherlands', public: 11.8, private: 3.1 },
		{country: 'Switzerland', public: 11.8, private: 4.5 },
		{country: 'Sweden', public: 11.3, private: 3.5 },
		{country: 'German', public: 11.3, private: 3.9 },
		{country: 'France', public: 10.9, private: 3.7 },
		{country: 'Denmark', public: 10.2, private: 2.9 },
		{country: 'Japan', public: 10.2, private: 2.9 },
		{country: 'Belgium', public: 10.2, private: 3.5 },
		{country: 'Canada', public: 10.2, private: 4 },
		{country: 'Austria', public: 10.1, private: 3.9 },
		{country: 'New Zealand', public: 9.5, private: 3.7 },
		{country: 'Greece', public: 9.1, private: 4.6 },
		{country: 'Portugal', public: 9, private: 4 },
		{country: 'Spain', public: 8.5, private: 3.2 },
		{country: 'Norway', public: 8.5, private: 2.3 },
	];
	
	makeChart(dataset);
}
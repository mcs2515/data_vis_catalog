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
	console.log(dataset.length);
	//bar width = (width of chart - margins ) / length of dataset  - padding
	let barwidth = (w - (marginL + marginR)) / (dataset.length) - 15;
	
	let chart = d3.select('#stackedbar')
		.attr('width', w)
		.attr('height', h);
	
	let xScale = d3.scaleOrdinal()
		.domain(dataset.map((d) => dataset.country))
		.range(marginL, w-marginR);
	
	let yScale = d3.scalelinear()
		.domain([0, d3.max(dataset, d => d.public)]+1)
		.domain([h-marginB, marginT])
}


window.onload = function () {
	d3.csv('../datasets/healthcare.csv', rowConverter)
		.then((d) => {
			dataset = d;
			makeChart(dataset);
		});
}
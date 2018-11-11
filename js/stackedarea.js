function rowConverter(row) {
  return {
	}
}

function makeChart(dataset) {
	let w = 700;
	let h = 300;
	
	let chart = d3.select('#stackedareachart')
		.attr('width', w)
		.attr('height', h);
}


window.onload = function () {
	let dataset;
	makeChart(dataset);
	chartlink();
}
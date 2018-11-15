function rowConverter(row) {
  return {
	}
}

function makeChart(dataset) {
	let w = 700;
	let h = 350;
	
	let chart = d3.select('#choroplethchart')
		.attr('width', w)
		.attr('height', h);
}


window.onload = function () {
	let dataset;
	makeChart(dataset);
	chartlink();
}
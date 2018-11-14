function rowConverter(row) {
  return {
	}
}

function makeChart(dataset) {
	let w = 700;
	let h = 300;
	
	var color = d3.scaleOrdinal().range(d3.schemeSet2);
	
	let chart = d3.select('#partitionchart')
		.attr('width', w)
		.attr('height', h);
	
	var root = d3.hierarchy(dataset).count();

	var partition = d3.partition()
		.size([w - 20, h])
		.padding(5)
		.round(true);

	partition(root);

	//create treemap 
	chart.selectAll('rect')
		.data(root.descendants())
		.enter()
		.append('rect')
		.attr('x', d => d.x0)
		.attr('y', d => d.y0)
		.attr('width', d => d.x1 - d.x0)
		.attr('height', d => d.y1 - d.y0)
		.style('fill', d => color(d.depth))
		.style('fill-opacity', 0.6)
		.attr('transform', `translate(15, 0)`);

	// add text 
	chart.selectAll('text')
		.data(root.descendants())
		.enter()
		.append('text')
		.attr('x', d => d.x0 + 10)
		.attr('y', d => d.y0 + 20)
		.text(d => d.data.parent)
		.attr('transform', `translate(15, 0)`);
}


window.onload = function () {
	d3.json('../datasets/pet_shop.json')
		.then((json) => {
			dataset = json;
			makeChart(dataset);
		});
	chartlink();
}
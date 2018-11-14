function rowConverter(row) {
	return {}
}

function makeChart(dataset) {
	let w = 700;
	let h = 300;

	let root = d3.hierarchy(dataset).sum(d => d.value || 0);
	var color = d3.scaleOrdinal().range(d3.schemeSet3);

	let chart = d3.select('#packedchart')
		.attr('width', w)
		.attr('height', h);

	let pack = d3.pack()
		.size([w, h])
		.padding(5);

	pack(root);

	//create packed circle
	chart.selectAll('circle')
		.data(root.descendants())
		.enter()
		.append('circle')
		.style('fill', d => color(d.depth))
		.style('fill-opacity', 0.6)
		.attr('cx', d => d.x)
		.attr('cy', d => d.y)
		.attr('r', d => d.r);

	//create text
	chart.selectAll('text')
		.data(root.descendants())
		.enter()
		//.filter(d => d.depth == 2)
		.append('text')
		.style('text-anchor', 'middle')
		.attr('x', d => d.x)
		.attr('y', d => d.y + 4)
		.text(d => d.data.parent);
}


window.onload = function () {
	d3.json('../datasets/pets_owned.json')
		.then((json) => {
			dataset = json;
			makeChart(dataset);
		});
	chartlink();
}
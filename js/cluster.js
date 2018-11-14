function rowConverter(row) {
	return {}
}

function makeChart(dataset) {
	let w = 700;
	let h = 300;

	var color = d3.scaleOrdinal().range(d3.schemePastel1);

	let chart = d3.select('#clusterchart')
		.attr('width', w)
		.attr('height', h);

	var root = d3.hierarchy(dataset);
	let cluster = d3.cluster().size([w - 40, h - 40]);

	cluster(root);

	chart.selectAll('lines')
		.data(root.links())
		.enter()
		.append('line')
		.classed('link', true)
		.style('stroke', 'grey')
		.attr('x1', d => d.source.x + 30)
		.attr('y1', d => d.source.y + 20)
		.attr('x2', d => d.target.x + 30)
		.attr('y2', d => d.target.y + 20);

	chart.selectAll('rect')
		.data(root.descendants())
		.enter()
		.append('circle')
		.classed('node', true)
		.style('fill', d => color(d.depth))
		.attr('cx', d => d.x + 30)
		.attr('cy', d => d.y + 20)
		.attr('r', 20);

	chart.selectAll('text')
		.data(root.descendants())
		.enter()
		.append('text')
		.classed('node-label', true)
		.attr('x', d => d.x + 30)
		.attr('y', d => d.y + 25)
		.text(d => d.data.name)
		.style('text-anchor', 'middle');
}


window.onload = function () {
	d3.json('../datasets/mammals.json')
		.then((json) => {
			dataset = json;
			makeChart(dataset);
		});
	chartlink();
}
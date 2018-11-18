function makeChart(dataset) {
	let w = 700;
	let h = 350;

	var colors = ['#f99c92', '#92BCF9', '#92f9cf']
	var color = d3.scaleOrdinal().range(colors);

	let chart = d3.select('#treechart')
		.attr('width', w)
		.attr('height', h);

	var root = d3.hierarchy(dataset);
	let tree = d3.tree().size([w - 40, h - 50]);

	tree(root);

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
		.append('rect')
		.classed('node', true)
		.style('fill', d => color(d.depth))
		.attr('width', 80)
		.attr('height', 30)
		.attr('x', d => d.x - 9)
		.attr('y', d => d.y + 4)
		.attr('rx', 5)
		.attr('ry', 5);

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
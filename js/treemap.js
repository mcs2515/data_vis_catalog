function makeChart(dataset) {
	let w = 700;
	let h = 350;

	var color = d3.scaleOrdinal().range(d3.schemeSet3);

	let chart = d3.select('#treemapchart')
		.attr('width', w)
		.attr('height', h);

	var root = d3.hierarchy(dataset).sum(d => d.value);

	var treeMap = d3.treemap()
		.size([w - 20, h])
		.paddingOuter(30)
		.paddingInner(10);

	treeMap(root);

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
		.style('fill-opacity', 0.5)
		.attr('transform', `translate(15, 0)`);

	// add text 
	chart.selectAll('text')
		.data(root.descendants())
		.enter()
		.append('text')
		.attr('x', d => d.x0 + (d.x1-d.x0) / 2)
		.attr('y', d => d.y0 + 20)
		.style("text-anchor", "middle")
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
function makeChart(dataset) {
	let w = 700;
	let h = 300;

	console.log(dataset);

	let chart = d3.select('#treemapchart')
		.attr('width', w)
		.attr('height', h);

	var root = d3.hierarchy(dataset);
	root = root.sum(d => d.value);

	var treeMap = d3.treemap()
		.size([w - 20, h])
		.paddingOuter(30)
		.paddingInner(5);

	treeMap = treeMap(root);
	console.log(treeMap);

	var color = d3.scaleOrdinal().range(d3.schemeSet3);


	//create treemap 
	chart.selectAll('rect')
		.data(treeMap.descendants())
		.enter()
		.append('rect')
		.attr('x', (d) => d.x0)
		.attr('y', (d) => d.y0)
		.attr('width', (d) => d.x1 - d.x0)
		.attr('height', (d) => d.y1 - d.y0)
		.style('fill', d => color(d.depth))
		.style('fill-opacity', 0.5)
		.attr('transform', `translate(15, 0)`);

	// add text 
	chart.selectAll('text')
		.data(treeMap.descendants())
		.enter()
		.append('text')
		.attr('x', d => d.x1 / 2)
		.attr('y', d => d.y0 + 20)
		.style("text-anchor", "middle")
		.text(d => d.data.parent)
		.attr('transform', `translate(15, 0)`);
}


window.onload = function () {
	d3.json('../datasets/animals.json')
		.then((json) => {
			dataset = json;
			makeChart(dataset);
		});
	chartlink();
}
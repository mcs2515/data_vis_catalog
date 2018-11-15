function rowConverter(row) {
	return {}
}

function makeChart(dataset) {
	let w = 700;
	let h = 350;

	let chart = d3.select('#forcedchart')
		.attr('width', w)
		.attr('height', h);

	let linkTargetLength = 100;
	
	let force = d3.forceSimulation(dataset.nodes)
		.force('charge', d3.forceManyBody())
		.force('link', d3.forceLink(dataset.edges)
			.distance(linkTargetLength))
		.force('center', d3.forceCenter()
			.x(w / 2)
			.y(h / 2));
	
	let edges = chart.selectAll('line')
		.data(dataset.edges)
		.enter()
		.append('line')
		.style('stroke', 'grey');
	
	let nodes = chart.selectAll('circle')
		.data(dataset.nodes)
		.enter()
		.append('circle')
		.attr('r', 20)
		.style('fill', (d,i) => (i < 2) ? 'green' : 'aliceblue');
	
	
	force.on('tick', () =>{
		edges
			.attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
		
		nodes
			.attr('cx', d => d.x)
      .attr('cy', d => d.y);
	})
	
}


window.onload = function () {
	d3.json('../datasets/states.json')
		.then((json) => {
			makeChart(json);
		})
	chartlink();
}
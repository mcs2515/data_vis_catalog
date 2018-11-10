function makeChart(dataset) {
	
	let w = 900;
	let h = 450;
	
	//set the inner radius and outer radius of pie
	let innerRadius = 0;
	let outerRadius = h/2.2;
	
	let colorScheme = d3.schemeCategory10;
	let color = d3.scaleOrdinal(colorScheme);
	
	let chart = d3.select('#piechart')
		.attr('width', w)
		.attr('height', h);
	
	let pie = d3.pie()
		.value(d => d.value);
	
	let pieData = pie(dataset);
	
	let arc = d3.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius);
	
	let arcs = chart.selectAll('g.arc')
		.data(pieData)
		.enter()
		.append('g')
			.attr('class', 'arc')
			.attr('transform', `translate(${w/2.5}, ${h/2})`);
	
	//create the pie chart
	arcs.append('path')
		.attr('fill', (d,i) => color(i))
		.attr('d', arc)
		.append('title')
			.text(d => d.data.name);
	
	//add value labels to pie chart
	arcs.append('text')
		.attr('transform', d => `translate(${arc.centroid(d)})`)
    .attr('text-anchor', 'middle')
    .text(d => d.value + '%')
		.style('fill', 'white');
	
	//legend
	let legendScale = d3.scaleOrdinal()
		.domain(pieData.map(d => d.data.name))
		.range(colorScheme);
	
	chart.append('g')
		.attr('class', 'legendOrdinal')
		.attr("transform", `translate(${w-250}, 120)`);
	
	var legend = d3.legendColor()
		.shape('path', d3.symbol().type(d3.symbolSquare).size(700)())
		.shapePadding(20)
		.scale(legendScale);
	
	chart.select('.legendOrdinal')
		.call(legend);
}


window.onload = function () {
	
	d3.json("../datasets/pets.json")
		.then((json) => {
			makeChart(json);
	})
}
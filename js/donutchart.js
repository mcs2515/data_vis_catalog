function makeChart(dataset) {

	let w = 700;
	let h = 356;

	let innerRadius = (h / 2.3) - 50;
	let outerRadius = h / 2.3;

	let colorScheme = d3.schemeSet2;
	let color = d3.scaleOrdinal(colorScheme);

	let chart = d3.select('#donutchart')
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
		.attr('transform', `translate(${(w/2)+5}, ${(h/2)+20})`);

	arcs.append('path')
		.attr('fill', (d, i) => color(i))
		.attr('d', arc)
		.append('title')
		.text(d => d.data.name);

	//chart title
	chart.append('text')
		.attr('transform', `translate(${(w/2)+5}, ${(h/2)+ 25})`)
		.attr('text-anchor', 'middle')
		.text("Pet Owners")
		.style("font-size", "24px")
		.style('fill', '#737373');

	//add value labels to pie chart
	arcs.append('text')
		.attr('transform', d => `translate(${arc.centroid(d)})`)
		.attr('text-anchor', 'middle')
		.text(d => d.value + '%')
		.style('fill', 'white');

	//add pet names
	//code: https://stackoverflow.com/questions/8053424/label-outside-arc-pie-chart-d3-js
	arcs.append('text')
		.attr('class', 'pet-names')
		.attr("transform", function (d) {
			var c = arc.centroid(d),
				x = c[0],
				y = c[1],
				// pythagorean theorem for hypotenuse
				h = Math.sqrt(x * x + y * y);
			return `translate(${(x/h * (outerRadius + 30))},
					 ${(y/h * (outerRadius + 10))})`;
		})
		.attr('text-anchor', 'middle')
		.style('fill', '#737373')
		.text(d => d.data.name);
}


window.onload = function () {

	d3.json('../datasets/pets.json')
		.then((json) => {
			makeChart(json);
		})

	chartlink();
}
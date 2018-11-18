function makeChart(dataset) {
	let w = 700;
	let h = 350;
	
	let outerRadius = Math.min(w, h) * 0.5;
	let innerRadius = outerRadius-20;

	
	var colors = ['#f99c92', '#92BCF9', '#92f9cf', '#92f0f9'];
	var color = d3.scaleOrdinal().range(colors);
	
	let chart = d3.select('#chordchart')
		.attr('width', w)
		.attr('height', h)
		.attr("viewBox", [-w / 2, -h / 2, w, h]);
	
	let ribbon = d3.ribbon()
    .radius(innerRadius);
	
	let arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
	
	let chord = d3.chord()
    .padAngle(0.05)
    .sortSubgroups(d3.descending);
	
	let chords = chord(dataset);
	
	let group = chart.append('g')
		.selectAll('g')
		.data(chords.groups)
		.enter()
		.append('g');
	
	group.append("path")
      .attr("fill", d => color(d.index))
      .attr("stroke", d => d3.rgb(color(d.index)).darker()) //darker adds a border that is darker than acutal color
      .attr("d", arc);
	
	chart.append("g")
		.attr("fill-opacity", 0.7)
    .selectAll("path")
    .data(chords)
    .enter()
		.append("path")
		.attr("d", ribbon)
		.attr("fill", d => color(d.target.index))
		.attr("stroke", d => d3.rgb(color(d.target.index)).darker());
}


window.onload = function () {

	d3.json('../datasets/butterfly.json')
		.then((json) => {
			makeChart(json.data);
		})
	chartlink();
}
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
	
	group.append("g")
		.attr("fill-opacity", 0.7)
    .selectAll("path")
    .data(chords)
    .enter()
		.append("path")
		.attr("d", ribbon)
		.attr("fill", d => color(d.target.index))
		.attr("stroke", d => d3.rgb(color(d.target.index)).darker());
	
	//LABELS
	group.append("text")
    .attr("dx", 4)
    .attr("dy", 0)
    .text(function(d) {
				if(d.index == 0){
					return "Nintendo";
				}else if(d.index == 1){
					return "PS4";
				}
				else if(d.index == 2){
					return "xBox";
				}
				else if(d.index == 3){
					return "Steam";
				}
		})
		.attr('fill', 'grey')
		.attr("transform", function (d) {
			var c = arc.centroid(d),
			x = c[0],
			y = c[1],
			// pythagorean theorem for hypotenuse
			h = Math.sqrt(x * x + y * y);
			return `translate(${(x/h * (outerRadius+90))},${(y/h * (outerRadius))})`;
		})
		.attr('text-anchor', 'middle');
}


window.onload = function () {

	d3.json('../datasets/consoles.json')
		.then((json) => {
			makeChart(json.data);
		})
	chartlink();
}
function rowConverter(row) {
	return {
		country: row.country,
		wonder: row.wonder,
		lat: parseFloat(row.lat),
		long: parseFloat(row.long),
	}
}

function makeChart(countries, wonder) {
	let w = 700;
	let h = 350;

	let tooltip = d3.select("body").append("div").attr('id', 'tooltip').style("opacity", 0);

	let chart = d3.select('#mapchart')
		.attr('width', w)
		.attr('height', h);
	
	//Define a map projection
	var projection = d3.geoNaturalEarth1()
		.scale(w / 1.85 / Math.PI)
		.translate([w / 2, h / 2]);
	
	let projectionDefaultScale = projection.scale();

	//Define a path generator using the projection
	let path = d3.geoPath()
		.projection(projection);


	let map = chart.append('g');
	//create world map
	map.selectAll("path")
		.data(countries.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style('stroke', "grey")
		.style("fill", "ccc");

	//create POI
	map.selectAll('circle')
		.data(wonder)
		.enter()
		.append("circle")
		.attr('cx', d => projection([d.long, d.lat])[0])
		.attr('cy', d => projection([d.long, d.lat])[1])
		.attr('r', 6)
		.attr('fill', "green")
		.style('opacity', .6)
		.on('mousemove', function (d) {
			d3.select(this)
				.transition("fill")
				.duration(250)
				.style('opacity', 1)
				.style('cursor', 'pointer');

			tooltip
				.style('left', (d3.event.pageX) - 50 + "px")
				.style('top', (d3.event.pageY) - 40 + "px")
				.text(d.wonder)
				.transition("tooltip")
				.duration(200)
				.style("opacity", .8);
		})
		.on('mouseout', function (d) {
			d3.select(this)
				.transition("fill")
				.duration(250)
				.style('opacity', .6);

			tooltip
				.transition("tooltip")
				.duration(500)
				.style("opacity", 0);
		});

	/* PAN AND ZOOM INTERACTIVITY */

	let updateMap = () => {
		//Update all paths and circles
		map.selectAll("path")
			.attr("d", path);

		map.selectAll("circle")
			.attr("cx", d => projection([d.long, d.lat])[0])
			.attr("cy", d => projection([d.long, d.lat])[1]);
	};

	// what we want to do whenever we pan/zoom
	let handleZoom = (d) => {

		//New offset array
		var offset = [w / 2 + d3.event.transform.x, h / 2 + d3.event.transform.y];

		//Calculate new scale
		var newScale = d3.event.transform.k * projectionDefaultScale;

		//Update projection with new offset and scale
		projection.translate(offset).scale(newScale);

		updateMap();
	};
	
	// define the D3 zoom 
  let zoom = d3.zoom()
		.scaleExtent([1, 10])
		.translateExtent([[-w, -h], [w * 2, h * 2]])
		.on('zoom', handleZoom);

  //Bind the zoom behavior
  chart.call(zoom);
}




window.onload = function () {

	Promise.all([
    d3.json('../datasets/countries.json'),
    d3.csv('../datasets/wonders.csv', rowConverter)])
		.then((values) => {

			let [countries, wonders] = values;
			makeChart(countries, wonders);
			chartlink();
		})
}
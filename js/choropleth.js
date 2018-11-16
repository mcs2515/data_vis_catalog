function makeChart(dataset) {
	let w = 700;
	let h = 350;

	let chart = d3.select('#choroplethchart')
		.attr('width', w)
		.attr('height', h);

	//Define a map projection
	let projection = d3.geoAlbersUsa()
		.translate([w / 2, h / 2])
		.scale(700);

	//Define a path generator using the projection
	let path = d3.geoPath()
		.projection(projection);

	let color = d3.scaleOrdinal()
		.domain([d3.min(dataset, d=> d.features.properties.value), d3.max(dataset, d=> d.features.properties.value)])
		.range(d3.schemeBlues[8]);

	console.log(d3.min(dataset, d=> d.features.properties.value));
	console.log(d3.max(dataset, d=>  d.features.properties.value));

	//Bind data and create one path per GeoJSON feature
	chart.selectAll("path")
		.data(dataset.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style('stroke', "#2c7fb8")
		.style("fill", d => {
			//Get data value
			let value = d.properties.value;
	//	console.log(value);

			if (value) {
				//If value exists…
				return color(value);
			} else {
				//If value is undefined…
				return "#ccc";
			}
		});
}


window.onload = function () {
	d3.csv('../datasets/tips.csv')
		.then(data => {

			d3.json('../datasets/us-states.json')
				.then(json => {
				
					for(var i = 0; i<data.length; i++){
						var dataState = data[i].state;
						var dataValue = parseFloat(data[i].value);
						
						for(var k = 0; k<json.features.length;k ++){
							var jsonState = json.features[i].properties.name;
							
							if(dataState = jsonState){
								json.features[k].properties.value = dataValue;
								break;
							}
						}
					}
				
				console.log(json);
					makeChart(json);
				})

		})
	chartlink();
}